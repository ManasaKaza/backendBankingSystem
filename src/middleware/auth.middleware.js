const userModel = require("../models/user.model");
const tokenBlacklistModel = require("../models/blacklist.model");
const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
    
    console.log("Auth header:", req.headers.authorization);

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    console.log("Token:", token);

    if(!token){
        return res.status(401).json({
            message: "Unauthorized access, token is missing",
            status: "Failed"
        })
    }

    if (await tokenBlacklistModel.findOne({ token })) {
        return res.status(401).json({
            message: "Unauthorized access, token is blacklisted",
            status: "Failed"
        })
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRETKEY);
        const user = await userModel.findById(decodedToken.userId);
        req.user = user;
        return next();
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized",
            status: "Failed"
        })
    }   

}


async function authSystemUserMiddleware(req, res, next) {

    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]
    console.log(token);

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access, token is missing",
            status: "Failed"
        })
    }

    if(await tokenBlacklistModel.findOne({token})){
        return res.status(401).json({
            message: "Unauthorized access, token is blacklisted",
            status: "Failed"
        })
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRETKEY);
        console.log("Decoded token:", decodedToken);

        const user = await userModel.findById(decodedToken.userId).select("+systemUser");
        console.log("User:", user);

        if (!user) {
            return res.status(401).json({
                message: "User not found",
                status: "Failed"
            });
        }

        if (user.systemUser === true) {
            return res.status(403).json({
                message: "Forbidden: Not a system user",
                status: "Failed"
            });
        }

        req.user = user

        return next()
    }
    catch (err) {
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }
}


module.exports = {authMiddleware, authSystemUserMiddleware};