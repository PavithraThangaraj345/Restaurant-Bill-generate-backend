const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    items: [{ type: String, required: true }],
    totalAmount: { type: Number, required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, refPath: 'bookingType', required: false },
    bookingType: { type: String, enum: ['Reservation', 'PrivateHallBooking', 'PartyBooking', 'EventBooking', 'general'], required: true, default: 'general' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Bill', billSchema);