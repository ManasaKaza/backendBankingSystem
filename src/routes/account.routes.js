const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const accountController = require('../controllers/account.controller');

const accountRouter = express.Router();

/**
 * - POST /api/accounts/
 * - create a new account
 * - protected route
 */
accountRouter.post("/", authMiddleware.authMiddleware, accountController.createAccountController)

/**
 * - GET /api/accounts/
 * - Get all accounts of the logged-in user
 * - Protected Route
 */
accountRouter.get("/", authMiddleware.authMiddleware, accountController.getUserAccountsController)

/**
 * - GET /api/accounts/balance/:accountId
 * - get the balance of a specific account
 */

accountRouter.get("/balance/:accountId", authMiddleware.authMiddleware, accountController.getLedgerBalanceController);

module.exports = accountRouter;
