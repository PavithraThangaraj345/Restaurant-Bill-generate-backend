// server/models/EventBooking.js

const mongoose = require('mongoose');

const EventBookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    guests: {
        type: Number,
        required: true,
    },
    occasion: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: false,
    },
    amount: {
        type: Number,
        required: true,
    },
    advanceAmount: {
        type: Number,
        required: false,
    },
    balanceAmount: {
        type: Number,
        required: false,
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Advance Paid', 'Fully Paid', 'Confirmed'],
        default: 'Pending',
    },
    selectedItems: {
        type: Array,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('EventBooking', EventBookingSchema);