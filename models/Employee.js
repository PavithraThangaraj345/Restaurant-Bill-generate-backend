// models/Employee.js
const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
    },
    salary: {
        type: Number,
        required: [true, 'Salary is required'],
        min: [0, 'Salary cannot be negative'],
    },
    bonus: {
        type: Number,
        default: 0,
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        enum: [
            'waiter',
            'chef',
            'cashier',
            'receptionist',
            'cook',
            'dishwasher',
            'cleaning staff',
            'booking manager',
            'event coordinator',
            'supervisor',
        ],
    },
    image: {
        type: String, // Base64 string for image
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

module.exports = mongoose.model('Employee', EmployeeSchema);