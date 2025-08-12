
const PrivateHallBooking = require('../models/PrivateHallBooking');
const { sendPrivateHallConfirmationEmail } = require('../utils/mailSender');
const { sendPrivateHallDenialEmail } = require('../utils/mailSender'); // <-- New mail function

// Get all private hall bookings for admin panel
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await PrivateHallBooking.find({});
        res.json(bookings);
    } catch (err) {
        console.error("Error fetching private hall bookings:", err);
        res.status(500).send('Server Error');
    }
};

// Function to create a new booking and send a confirmation email
exports.createBooking = async (req, res) => {
    try {
        const { name, email, phone, date, time, guests, eventType, amount, advanceAmount, balanceAmount, selectedItems } = req.body;
        const newBooking = new PrivateHallBooking({
            name,
            email,
            phone,
            date,
            time,
            guests,
            eventType,
            amount,
            advanceAmount,
            balanceAmount,
            selectedItems,
            paymentStatus: 'Advance Paid (Pending Confirmation)', // Set initial status
        });
        const savedBooking = await newBooking.save();
        res.status(201).json({ message: 'Private hall booking created, pending admin confirmation.', booking: savedBooking });
    } catch (error) {
        console.error('Error creating private hall booking:', error);
        res.status(500).json({ error: 'Failed to create booking', details: error.message });
    }
};

// Function to confirm a booking and send a confirmation email
// Function to confirm a booking and send a confirmation email
exports.confirmBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await PrivateHallBooking.findById(id);

        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        // Update booking status to 'Confirmed'
        booking.paymentStatus = 'Confirmed';
        await booking.save();

        // Send confirmation email
        await sendPrivateHallConfirmationEmail(
            { name: booking.name, email: booking.email },
            {
                date: booking.date,
                time: booking.time,
                guests: booking.guests,
                eventType: booking.eventType,
                selectedItems: booking.selectedItems,
                amount: booking.amount,
                advanceAmount: booking.advanceAmount,
                balanceAmount: booking.balanceAmount,
                paymentStatus: booking.paymentStatus
            }
        );

        res.json({ msg: 'Booking confirmed and email sent successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
// Function to deny a booking and send a denial email
exports.denyBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await PrivateHallBooking.findById(id);

        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        // Update booking status
        booking.status = 'Denied';
        await booking.save();

        // Send denial email
        const bookingData = {
            name: booking.name,
            email: booking.email,
            date: booking.date,
            time: booking.time
        };
        await sendPrivateHallDenialEmail(bookingData, bookingData); // Using a new denial email function

        res.json({ msg: 'Booking denied and email sent successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
