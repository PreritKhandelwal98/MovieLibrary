const express = require('express');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const List = require('./models/ListModel');
const User = require('./models/UserModel'); // Ensure this import

const connectDB = require('./config/connectDB');

const router = require('./routes/index');
const listRoutes = require('./routes/listRoute');

const cookiesParser = require('cookie-parser');
const { protect } = require('./middleware/authMiddleware'); // Ensure the correct path

const app = express();
app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());
app.use(cookiesParser());

const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.send("<h1>Hello from server</h1>");
});

// Route for getting list details
app.get('/api/lists/details/:id', async (req, res) => {
    try {

        const listId = req.params.id;
        const list = await List.findById(listId).populate('movies');

        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }

        // Check if the list is public
        if (list.isPublic) {
            return res.json(list.movies); // Return movies for public list
        }

        // For private lists, check if the user is authenticated
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                const token = req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
                req.user = await User.findById(decoded.id).select('-password');

                // Check if the authenticated user is the owner of the private list
                if (!list.owner.equals(req.user._id)) {
                    return res.status(403).json({ message: 'You do not have access to view this list' });
                }
                return res.json(list.movies); // Return movies for private list
            } catch (error) {
                return res.status(401).json({ message: 'Not authorized, token failed' });
            }
        }

        res.status(401).json({ message: 'Not authorized, no token' });
    } catch (error) {
        console.error('Server error:', error); // Log server errors
        res.status(500).json({ message: 'Server Error' });
    }
});

// Apply the protect middleware to routes that require user authentication
app.use('/api/lists', protect, listRoutes);
app.use('/api', router)
connectDB().then(() => {
    console.log("DB connected successfully");
});
app.listen(port, () => {
    console.log(`Server is running on the port: ${port}`);
});
