// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust the path to your User model

// @route   GET /api/users
// @desc    Get all users with pagination and filtering
// @access  Private (e.g., for admins)
router.get('/', async (req, res) => {
  try {
    const { _page, _limit } = req.query;

    if (_page && _limit) {
      const page = parseInt(_page);
      const limit = parseInt(_limit);
      
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      
      const results = {};
      const totalUsers = await User.countDocuments().exec();
      
      if (endIndex < totalUsers) {
        results.next = {
          page: page + 1,
          limit: limit
        };
      }
      
      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit
        };
      }

      results.results = await User.find().limit(limit).skip(startIndex).exec();
      res.json(results.results); // Send back only the paginated results

    } else {
      // If no pagination, return all users
      const users = await User.find();
      res.json(users);
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ... You will also need a PUT route for the user status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    user.status = status;
    await user.save();

    res.json({ msg: 'User status updated successfully', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;