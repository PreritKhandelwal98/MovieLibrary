const UserModel = require("../models/UserModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        const checkUser = await UserModel.findOne({
            $or: [
                { email },
                { password }
            ]
        });

        //checking user presence 
        if (!checkUser) {
            return res.status(400).json({
                message: "Invalid Credentials",
                error: true
            });
        }

        const verifyPassword = await bcrypt.compare(password, checkUser.password);
        //checking user presence 
        if (!verifyPassword) {
            return res.status(400).json({
                message: "Wrong Credentials",
                error: true
            });
        }

        const tokenData = {
            id: checkUser._id,
            email: checkUser.email
        };
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        const cookieOptions = {
            httpOnly: true,
            secure: true
        };

        res.cookie('token', token, cookieOptions);

        return res.status(200).json({
            message: "Login Successfully",
            data: token,
            success: true
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true
        });
    }
}

module.exports = loginUser;
