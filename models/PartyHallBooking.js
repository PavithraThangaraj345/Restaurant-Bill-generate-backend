// models/PartyBooking.js
const mongoose = require('mongoose');

const PartyBookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  selectedItems: {
    type: Array, // Or an array of objects, depending on your data structure
    default: [],
  },
  paymentStatus: {
    type: String,
    default: 'Advance Paid',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('PartyBooking', PartyBookingSchema);