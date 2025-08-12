// server/routes/privateHallBookingRoutes.js
const express = require('express');
const router = express.Router();
const privateHallBookingController = require('../controllers/privateHallBookingController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// ... (existing routes)

// Get all private hall bookings (for admin dashboard)
router.get('/', protect, isAdmin, privateHallBookingController.getAllBookings);

// Create a new private hall booking (from user side)
router.post('/', privateHallBookingController.createBooking);

// Change this line from .post to .put
router.put('/confirm/:id', protect, isAdmin, privateHallBookingController.confirmBooking);

// Change this line from .post to .delete
router.delete('/deny/:id', protect, isAdmin, privateHallBookingController.denyBooking);

module.exports = router;