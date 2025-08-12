// server/models/Reservation.js
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    name: String,
    email: String,
    date: String,
    time: String,
    people: Number,
    amount: Number,
    menuItems: [String],
    paymentStatus: String, // Added this field
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);