const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { listProtect } = require('../middleware/listMiddleware')
const listController = require('../controller/listController');

// Middleware to protect routes
router.use(protect);

// Routes for lists
router.post('/', listController.createList); // Create a new list
router.get('/', listController.getUserLists); // Get all lists belonging to a user
router.get('/:id', listController.getListById); // Get a single list by ID

router.put('/update/:id', listController.updateListById); // Update a list by ID
router.delete('/:id', listController.deleteListById); // Delete a list by ID

// Route for adding movies to a list
router.put('/add-movies/:id', listController.addMoviesToList);
router.patch('/toggle-visibility/:id', listController.toggleListVisibility);
router.get('/details/:id', listController.getListDetails);


module.exports = router;
