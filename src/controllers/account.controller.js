const AccountModel = require("../models/account.model");
const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");


/**
 * - Create new Account
 * - POST /api/accounts/
 */

async function createAccountController(req, res){
    
    const user = req.user;
    const account = await AccountModel.create({
        user: user._id
    })

    res.status(201).json({
        message: "Account created successfully",
        status: "Success",
        data: account
    })

}

async function getUserAccountsController(req, res) {

    const accounts = await AccountModel.find({ user: req.user._id });

    res.status(200).json({
        accounts
    })
}


async function getLedgerBalanceController(req, res) {
    
    const { accountId } = req.params;
    console.log("accountId", accountId);
    const account = await AccountModel.findById(accountId);
    console.log(account);

    if(!account){
        return res.status(404).json({
            message: "Account not found",
            status: "Error"
        })
    }

    if(account.user.toString() != req.user._id.toString()){
        return res.status(401).json({
            message: "Unauthorized",
            status: "Error"
        })
    }

    const balance = await account.getLedgerBalance();
    res.status(200).json({
        message: "Account balance retrieved successfully",
        status: "Success",
        balance: balance
    })

}


module.exports = {
    createAccountController,
    getLedgerBalanceController,
    getUserAccountsController
}
