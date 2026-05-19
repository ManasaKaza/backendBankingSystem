const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        unique: [true, "Email already exists"],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        minLength: [3, "Username must be at least 3 characters long"],
        maxLength: [20, "Username must be at most 20 characters long"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        minLength: [8, "Password must be at least 8 characters long"],
        maxLength: [12, "Password must be at most 12 characters long"],
        select: false,
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"],
    },
    systemUser: {
        type: Boolean,
        default: false,
        immutable: true,
        select: false
    }
}, {
    timestamps: true
})

userSchema.pre("save", async function () {

    if (!this.isModified("password")) {
        return;
    }
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    return;
})

userSchema.methods.comparePassword = async function (password) {

    return await bcrypt.compare(password, this.password);

}

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;