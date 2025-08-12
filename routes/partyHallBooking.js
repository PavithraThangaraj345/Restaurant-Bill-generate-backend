// routes/partyHallBookingRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getAllPartyHallBookings, 
  createPartyHallBooking,
  confirmPartyBooking 
} = require('../controllers/partyHallBookingController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Route to fetch all party hall bookings
router.get('/', protect, isAdmin, getAllPartyHallBookings);

// Route to create a new party hall booking
router.post('/', protect, createPartyHallBooking);
router.put('/confirm/:id', protect, isAdmin, confirmPartyBooking);

module.exports = router;