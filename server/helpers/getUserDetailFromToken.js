const jwt = require('jsonwebtoken');
const UserModel = require("../models/UserModel");

const getUserDetailsFromToken = async (token) => {
    const Token = token;

    if (!Token || typeof Token !== 'string') {
        console.error("Invalid token:", Token);
        return {
            message: "Invalid token",
            error: "Token must be a string"
        };
    }

    try {
        const decode = await jwt.verify(Token, process.env.JWT_SECRET_KEY);

        const user = await UserModel.findById(decode.id).select("-password");
        return user;
    } catch (error) {
        console.error("Error decoding token:", error);
        return {
            message: "Error decoding token",
            error: error
        };
    }
};

module.exports = getUserDetailsFromToken;
