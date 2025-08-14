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
<<<<<<< HEAD
app.use(cors({
  origin: "app.use(cors({
  origin: "https://restaurant-bill-generate-1.onrender.com", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));", // your frontend live link
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(cors({
  origin: "https://restaurant-bill-generate-1.onrender.com", // your frontend live link
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
=======

// ✅ Proper CORS setup for both local & deployed frontend
app.use(cors({
  origin: [
    "http://localhost:5173", // Local development
    "https://restaurant-bill-generate-1.onrender.com" // Render deployed frontend URL
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Parse incoming JSON requests
>>>>>>> e02e493 (Fix CORS for deployed frontend)
app.use(express.json());

// ✅ Connect to MongoDB Atlas
connectDB();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/partybookings", partyHallBookingRoutes);
app.use("/api/privatehallbookings", privateHallBookingRoutes);
app.use("/api/eventbookings", eventBookingRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/employees", employeeRoutes);

// ✅ Serve static files (avatars)
app.use('/uploads/avatars', express.static(path.join(__dirname, 'uploads', 'avatars')));

<<<<<<< HEAD
app.get('/', (req, res) => {
  res.send('API is running...');
});

=======
// Root test route
app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

// Start the server
>>>>>>> e02e493 (Fix CORS for deployed frontend)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
