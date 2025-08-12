const Bill = require('../models/Bill');

// Get all bills
exports.getAllBills = async (req, res) => {
    try {
        const bills = await Bill.find({});
        res.json(bills);
    } catch (err) {
        console.error('Error fetching bills:', err);
        res.status(500).send('Server Error');
    }
};

// Create a new bill
exports.createBill = async (req, res) => {
    try {
        const { customerName, customerEmail, items, totalAmount, bookingId, bookingType } = req.body;
        const newBill = new Bill({
            customerName,
            customerEmail,
            items,
            totalAmount,
            bookingId,
            bookingType: bookingType || 'general',
        });
        const savedBill = await newBill.save();
        res.status(201).json(savedBill);
    } catch (err) {
        console.error('Error creating bill:', err);
        res.status(500).json({ error: 'Failed to create bill', details: err.message });
    }
};