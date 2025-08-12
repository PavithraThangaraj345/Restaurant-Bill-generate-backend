// server/controllers/reservationController.js
const Reservation = require('../models/Reservation');
const { createBillFromBooking } = require('../services/billService');
const { sendTableConfirmationEmail } = require('../utils/mailSender');

// Create a new reservation
const createReservation = async (req, res) => {
    try {
        const { name, email, date, time, people, amount, paymentStatus } = req.body;
        const newReservation = new Reservation({
            name, email, date, time, people, amount, paymentStatus
        });
        const savedReservation = await newReservation.save();

        // No bill generation or email sent here, the status is 'Pending'
        res.status(201).json({ message: 'Reservation submitted for review.' });
    } catch (error) {
        console.error('Error creating reservation:', error);
        res.status(500).json({ error: 'Failed to create reservation', details: error.message });
    }
};

// Get all reservations
const getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({});
        res.json(reservations);
    } catch (err) {
        console.error("Error fetching reservations:", err);
        res.status(500).send('Server Error');
    }
};

// New function: Confirm a reservation
const confirmReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Reservation.findByIdAndUpdate(id, { paymentStatus: 'Fully Paid' }, { new: true });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found.' });
        }

        // Send confirmation email
        await sendTableConfirmationEmail({ name: booking.name, email: booking.email }, booking);

        // Generate the bill
        await createBillFromBooking(booking, 'Table Reservation');

        res.status(200).json({ message: 'Reservation confirmed and email sent.', booking });
    } catch (error) {
        console.error('Error confirming reservation:', error);
        res.status(500).json({ error: 'Failed to confirm reservation', details: error.message });
    }
};

// New function: Deny a reservation
const denyReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Reservation.findByIdAndUpdate(id, { paymentStatus: 'Denied' }, { new: true });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found.' });
        }

        // You could also send a denial email here if you wish
        res.status(200).json({ message: 'Reservation denied.', booking });
    } catch (error) {
        console.error('Error denying reservation:', error);
        res.status(500).json({ error: 'Failed to deny reservation', details: error.message });
    }
};

// Export all controller functions
module.exports = {
    createReservation,
    getAllReservations,
    confirmReservation,
    denyReservation
};