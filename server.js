const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require('./config/db');
const path = require('path');


// Import all routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require('./routes/userRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const partyHallBookingRoutes = require('./routes/partyHallBooking');
const eventBookingRoutes = require('./routes/eventBooking');
const privateHallBookingRoutes = require('./routes/privateHallBookingRoutes');
const billRoutes = require('./routes/billRoutes');
const employeeRoutes = require('./routes/employeeRoutes');


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Connect to the database
connectDB();

// API Routes
app.use("/api/auth", authRoutes); // This is the correct route definition
app.use('/api/users', userRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/partybookings', partyHallBookingRoutes);
app.use('/api/privatehallbookings', privateHallBookingRoutes);
app.use("/api/eventbookings", eventBookingRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/employees', employeeRoutes);

// Serve static files from the 'uploads/avatars' directory
app.use('/uploads/avatars', express.static(path.join(__dirname, 'uploads', 'avatars')));

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
