// models/PrivateHallBooking.js
const mongoose = require('mongoose');

const privateHallBookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true },
    eventType: { type: String, required: true },
    amount: { type: Number, required: true },
    advanceAmount: { type: Number, required: true },
    balanceAmount: { type: Number, required: true },
    paymentStatus: { type: String, default: 'Pending' },
    selectedItems: [{
        id: { type: Number },
        name: { type: String },
        price: { type: Number }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PrivateHallBooking', privateHallBookingSchema);