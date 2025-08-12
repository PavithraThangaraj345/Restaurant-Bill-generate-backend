// server/controllers/eventBookingController.js

const EventBooking = require("../models/EventBooking");
const { sendEventBookingConfirmationEmail } = require('../utils/mailSender');

// Create a new event hall booking
const createEventBooking = async (req, res) => {
    try {
        const {
            name, email, phone, date, time, guests, occasion, message, amount,
            advanceAmount, balanceAmount, selectedItems
        } = req.body;

        const newBooking = new EventBooking({
            name,
            email,
            phone,
            date,
            time,
            guests,
            occasion,
            message,
            amount,
            advanceAmount,
            balanceAmount,
            selectedItems,
            paymentStatus: 'Advance Paid', // Initial status set to "Advance Paid"
        });

        await newBooking.save();

        // The confirmation email is no longer sent here.
        res.status(201).json({ message: 'Event booking created successfully and is awaiting admin confirmation.' });
    } catch (err) {
        console.error('Error creating event booking:', err);
        res.status(500).json({ error: 'Server error' });
    }
};


// Get all event bookings
const getAllEventBookings = async (req, res) => {
    try {
        const bookings = await EventBooking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        console.error('Error fetching event bookings:', err);
        res.status(500).json({ error: "Failed to fetch event bookings" });
    }
};

// Define the confirmEventBooking function to be exported
const confirmEventBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await EventBooking.findById(id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Update the payment status to 'Confirmed'
        booking.paymentStatus = 'Confirmed';
        await booking.save();
        
        // Now, send the confirmation email with the updated status
        const user = { name: booking.name, email: booking.email };
        await sendEventBookingConfirmationEmail(user, booking);

        res.status(200).json({ message: 'Booking confirmed and email sent successfully' });
    } catch (err) {
        console.error('Error confirming booking:', err);
        res.status(500).json({ error: 'Server error' });
    }
};


// Define a new denyEventBooking function for the deny button
const denyEventBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await EventBooking.findById(id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        booking.paymentStatus = 'Denied';
        await booking.save();

        // You could also send a denial email here if you have a mail sender for it.
        // await sendEventBookingDenialEmail({ name: booking.name, email: booking.email });

        res.status(200).json({ message: 'Booking denied successfully' });
    } catch (err) {
        console.error('Error denying booking:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    createEventBooking,
    getAllEventBookings,
    confirmEventBooking,
    denyEventBooking,
};