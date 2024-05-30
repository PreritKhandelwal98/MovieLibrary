const mongoose = require('mongoose');

async function connectDB() {
    try {
        mongoose.connect(process.env.MONGODB_URL)

        const connection = mongoose.connection

        connection.on('connected', () => {
            console.log("Connected Successfully")
        })

        connection.on('error', (err) => {
            console.log("Something went wrong ", err)
        })
    } catch (err) {
        console.log("Something went wrong ", err)
    }
}

module.exports = connectDB