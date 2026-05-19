const express = require('express');

const authController = require('../controllers/auth.controller');

const authRouter = express.Router();

// /api/auth/register
authRouter.post("/register", authController.userRegisterController)

///api/auth/login
authRouter.post("/login", authController.userLoginController)


// /POST /api/auth/logout
authRouter.post("/logout", authController.userLogoutController)
module.exports = authRouter;