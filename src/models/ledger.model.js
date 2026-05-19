const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({

    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [true, "Account is required"],
        index: true,
        immutable: true
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        immutable: true,
        default: 0
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        required: [true, "Transaction is required"],
        immutable: true,
        index: true
    },
    type: {
        type: String,
        enum: ["DEBIT", "CREDIT"],
        required: [true, "Type is required"]
    },

});

function preverntLedgerModification() {
    throw new Error("Ledger cannot be modified or deleted");
}

const operations = [
    'findOneAndUpdate',
    'updateOne',
    'updateMany',
    'deleteOne',
    'deleteMany',
    'remove',
    'findOneAndDelete',
    'findOneAndReplace'
];

operations.forEach(op => {
    ledgerSchema.pre(op, preverntLedgerModification);
});

const ledgerModel = mongoose.model("Ledger", ledgerSchema);

module.exports = ledgerModel;