// server/routes/eventBooking.js

const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const { createEventBooking, getAllEventBookings, confirmEventBooking, denyEventBooking } = require('../controllers/eventBookingController');

// POST a new event booking
router.post('/', createEventBooking);

// GET all event bookings
router.get('/', getAllEventBookings);

// PUT to confirm a booking and send email
router.put('/confirm/:id', protect, isAdmin, confirmEventBooking);
router.delete('/deny/:id', protect, isAdmin, denyEventBooking);

module.exports = router;