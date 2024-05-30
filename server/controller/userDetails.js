// userDetails.js
const UserModel = require("../models/UserModel");
const getUserDetailsFromToken = require('../helpers/getUserDetailFromToken');

async function userDetails(req, res) {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Extract token from headers
        const user = await getUserDetailsFromToken(token);

        return res.status(200).json({
            message: "User Details",
            data: user
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            err: true
        });
    }
}

module.exports = userDetails;
