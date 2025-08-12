// routes/billRoutes.js
const express = require('express');
const router = express.Router();
const { getAllBills, createBill } = require('../controllers/billController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Route to get all bills
router.get('/', protect, isAdmin, getAllBills);

// Route to create a new bill
router.post('/', protect, isAdmin, createBill);

module.exports = router;