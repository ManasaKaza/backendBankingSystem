# Backend Banking System

A robust Node.js backend application that simulates a core banking system. It provides secure user authentication, account management, and reliable transaction processing using a double-entry ledger system.

## Features

- **User Authentication**: Secure user registration, login, and logout functionalities using JWT (JSON Web Tokens) and HTTP-only cookies. Passwords are cryptographically hashed using `bcryptjs`.
- **Account Management**: Users can create bank accounts and check their ledger balances. 
- **Double-Entry Ledger**: Ensures financial integrity by recording every transaction as paired debit and credit entries. The ledger is completely immutable to prevent tampering.
- **Transaction Processing**: Supports secure money transfers between accounts. It implements ACID properties using MongoDB sessions/transactions and uses idempotency keys to prevent accidental duplicate transfers.
- **Email Notifications**: Automatically sends welcome emails upon registration and notification emails when transactions are processed.
- **System Accounts**: Special system-level accounts can seed initial funds into the platform.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose (with MongoDB Sessions for ACID transactions)
- **Authentication**: JSON Web Tokens (JWT), cookie-parser
- **Security**: bcryptjs
- **Email Service**: Nodemailer (configured for OAuth2 via Gmail)
   ```
