const List = require('../models/ListModel');

// Create a new list
const createList = async (req, res) => {
    try {
        const { name, isPublic, movies } = req.body;
        const owner = req.user._id; // Assuming user ID is available in the request
        console.log(name, isPublic, owner, movies);
        const newList = new List({
            name,
            owner,
            isPublic,
            movies,
        });
        console.log("before saveList");
        const savedList = await newList.save();
        console.log("after saveList");
        res.status(201).json(savedList);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all lists belonging to a user
const getUserLists = async (req, res) => {
    try {
        const userId = req.user._id;
        const lists = await List.find({ owner: userId });
        res.json(lists);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get a single list by ID
const getListById = async (req, res) => {
    try {
        const listId = req.params.id;
        const list = await List.findById(listId);

        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }

        res.json(list);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update a list by ID
const updateListById = async (req, res) => {
    try {
        const listId = req.params.id;
        const { name, isPublic, movies } = req.body;

        const updatedList = await List.findByIdAndUpdate(listId, {
            name,
            isPublic,
            movies,
        }, { new: true });

        if (!updatedList) {
            return res.status(404).json({ message: 'List not found' });
        }

        res.json(updatedList);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete a list by ID
const deleteListById = async (req, res) => {
    try {
        const listId = req.params.id;
        const deletedList = await List.findByIdAndDelete(listId);

        if (!deletedList) {
            return res.status(404).json({ message: 'List not found' });
        }

        res.json({ message: 'List deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Add movies to an existing list
const addMoviesToList = async (req, res) => {
    console.log("calling addMoviesToList function only");
    try {
        const listId = req.params.id;
        const { movies } = req.body; // Assume movies is an array of movie objects

        const list = await List.findById(listId);

        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }

        // Validate incoming movies array
        if (!Array.isArray(movies) || movies.length === 0) {
            return res.status(400).json({ message: 'Movies must be a non-empty array' });
        }

        // Add new movies to the list
        list.movies.push(...movies);

        // Save the updated list
        const updatedList = await list.save();

        console.log("Updated list:", updatedList);

        res.json(updatedList);
    } catch (error) {
        console.error("Error updating list:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Toggle visibility of a list
const toggleListVisibility = async (req, res) => {
    try {
        const listId = req.params.id;
        const list = await List.findById(listId);

        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }

        list.isPublic = !list.isPublic;
        const updatedList = await list.save();

        res.json(updatedList);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getListDetails = async (req, res) => {
    try {
        console.log('Received request for list details'); // Log entry point

        const listId = req.params.id;
        const list = await List.findById(listId).populate('movies');

        if (!list) {
            console.log('List not found:', listId); // Log when list is not found
            return res.status(404).json({ message: 'List not found' });
        }

        const userId = req.user ? req.user._id : null;
        console.log('User ID:', userId); // Log user ID
        console.log('List is public:', list.isPublic); // Log list visibility

        // Check if the list is private
        if (!list.isPublic && (!userId || !list.owner.equals(userId))) {
            console.log('Access denied for user:', userId); // Log access denied
            return res.status(403).json({ message: 'You do not have access to view this list' });
        }

        console.log('Returning movies for list:', listId); // Log successful data fetch
        res.json(list.movies); // Only return the movies
    } catch (error) {
        console.error('Server error:', error); // Log server errors
        res.status(500).json({ message: 'Server Error' });
    }
};







module.exports = {
    createList,
    getUserLists,
    getListById,
    updateListById,
    deleteListById,
    addMoviesToList,
    toggleListVisibility,
    getListDetails
};
