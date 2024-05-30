const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name required"]
    },
    lastName: {
        type: String,
        required: [true, "Last Name required"]
    },
    email: {
        type: String,
        required: [true, "email required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "password required"]
    },

}, { timestamps: true })

const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel