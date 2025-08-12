const express = require('express');
// Ensure you are importing the correct controller functions
const { 
  createReservation, 
  getAllReservations, 
  confirmReservation, // This function should be imported
  denyReservation // This function should also be imported
} = require('../controllers/reservationController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Existing routes
router.get('/', protect, isAdmin, getAllReservations);
router.post('/', protect, createReservation); // Assuming this is for a user to create a reservation

// These are the new or corrected routes for the admin actions
router.put('/confirm/:id', protect, isAdmin, confirmReservation);
router.put('/deny/:id', protect, isAdmin, denyReservation);

module.exports = router;