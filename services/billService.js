// server/services/billService.js
const Bill = require('../models/Bill');

/**
 * Creates and saves a new bill based on booking details.
 * @param {object} bookingData - The data from the booking.
 * @param {string} bookingType - The type of booking (e.g., 'Party', 'Event').
 * @returns {Promise<Bill>} The newly created bill document.
 */
exports.createBillFromBooking = async (bookingData, bookingType) => {
    try {
        const { name, email, amount, guests, date, time } = bookingData;

        // Create a list of items for the bill
        const items = [`${bookingType} Booking for ${guests} guests on ${new Date(date).toLocaleDateString()} at ${time}`];

        const newBill = new Bill({
            customerName: name,
            customerEmail: email,
            items: items,
            totalAmount: amount,
            createdAt: new Date(),
        });

        const savedBill = await newBill.save();
        console.log(`Bill generated for ${bookingType} booking: ${savedBill._id}`);
        return savedBill;
    } catch (err) {
        console.error('Error creating bill from booking:', err);
        throw new Error('Failed to create bill from booking');
    }
};
