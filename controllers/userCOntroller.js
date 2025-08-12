// controllers/userController.js
const User = require('../models/User'); // your Mongoose model

exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;

    const users = await User.find().skip(startIndex).limit(limit);
    const total = await User.countDocuments();

    res.set("x-total-count", total); // important for frontend
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
