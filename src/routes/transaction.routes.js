const express = require("express");
const transactionRouter = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

const transactionController = require("../controllers/transaction.controller");

/**
 * - POST /api/transactions
 * - create a new transaction
 */

transactionRouter.post("/", authMiddleware.authMiddleware, transactionController.createTransaction);

/**
 * - POST /api/transactions/system/initial-funds
 * - Create initial funds transaction from system user
 */
transactionRouter.post("/system/initial-funds", authMiddleware.authSystemUserMiddleware, transactionController.createInitialFundsTransaction)

module.exports = transactionRouter;
