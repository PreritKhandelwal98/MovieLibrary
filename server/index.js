const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/connectDB')

const router = require('./routes/index')
const listRoutes = require('./routes/listRoute')

const cookiesParser = require('cookie-parser')

const app = express();
app.use(cors({
    origin: true,
    credentials: true
}));


app.use(express.json());
app.use(cookiesParser());
const port = process.env.PORT || 8000;


app.get('/', (req, res) => {
    res.send("<h1>Hello from server</h1>")
})

//api route call
app.use('/api', router);
//api list route
app.use('/api/lists', listRoutes);
// Define the getListDetails function

connectDB().then(() => {
    console.log("DB connected successfully")
})
app.listen(port, () => {
    console.log(`Server is running on the port: ${port}`);
})