// controllers/partyHallBookingController.js
const PartyBooking = require('../models/PartyHallBooking'); 

exports.getAllPartyHallBookings = async (req, res) => {
    try {
        const bookings = await PartyBooking.find({});
        res.json(bookings);
    } catch (err) {
        console.error('Error fetching party hall bookings:', err);
        res.status(500).send('Server Error');
    }
};

// Add this new function to handle creating a booking
exports.createPartyHallBooking = async (req, res) => {
    try {
        const newBooking = new PartyBooking(req.body);
        await newBooking.save();
        res.status(201).json({ 
            success: true, 
            message: 'Party booking created successfully', 
            booking: newBooking 
        });
    } catch (err) {
        console.error('Error creating party booking:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server Error', 
            error: err.message 
        });
    }
};
exports.confirmPartyBooking = async (req, res) => {
    try {
        const booking = await PartyBooking.findByIdAndUpdate(
            req.params.id, 
            { paymentStatus: 'Confirmed' }, 
            { new: true, runValidators: true } // Return the updated document
        );

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        res.status(200).json({ success: true, data: booking });

    } catch (err) {
        console.error('Error confirming party booking:', err);
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
};