const UserModel = require("../models/user.model");
const tokenBlackListModel = require("../models/blacklist.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");

/**
 * - user register controller
 * - POST /api/auth/register
 * - creates new user
 */
async function userRegisterController(req, res) {

    const { email, username, password } = req.body;

    const isExists = await UserModel.findOne({
        email: email
    })

    if (isExists) {
        return res.status(422).json({
            message: "User with email already exists",
            status: "Failed"
        })
    }

    const newUser = await UserModel.create({
        email, username, password
    })

    const token = jwt.sign({
        userId: newUser._id
    },
        process.env.JWT_SECRETKEY,
        { expiresIn: "3d" }
    )

    res.cookie("token", token)

    res.status(201).json({
        message: "User registered successfully",
        status: "Success",
        User: {
            _id: newUser._id,
            email: newUser.email,
            username: newUser.username,
        },
        token,
    });

    try {
        await emailService.sendWelcomeEmail(newUser.email, newUser.username);
    } catch (err) {
        console.error("Failed to send welcome email:", err);
    }

}

/**
 * - user login controller
 * - POST /api/auth/login
 * - login user
 */
async function userLoginController(req, res) {

    console.log(req.headers.authorization)
    console.log(req.cookies)

    const { email, password } = req.body;

    const user = await UserModel.findOne({
        email: email,
    }).select("+password");

    if (!user) {
        return res.status(401).json({
            message: "Invalid Credentials",
            status: "Failed"
        })
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        return res.status(401).json({
            message: "Invalid Credentials",
            status: "Failed"
        })
    }

    const token = jwt.sign({
        userId: user._id
    },
        process.env.JWT_SECRETKEY,
        { expiresIn: "3d" }
    )

    res.cookie("token", token)

    res.status(200).json({
        message: "User logged in successfully",
        status: "Success",
        User: {
            _id: user._id,
            email: user.email,
            username: user.username,
        },
        token,
    });
    
}

/**
 * - user logout controller
 * - POST /api/auth/logout
 * - logout user
 */
async function userLogoutController(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]

    if (!token) {
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }



    await tokenBlackListModel.create({
        token: token
    })

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })

}

module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController
}