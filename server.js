const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Import all routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const partyHallBookingRoutes = require("./routes/partyHallBooking");
const eventBookingRoutes = require("./routes/eventBooking");
const privateHallBookingRoutes = require("./routes/privateHallBookingRoutes");
const billRoutes = require("./routes/billRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

dotenv.config();
const app = express();

// CORS setup
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://restaurant-bill-generate-1.onrender.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Connect to MongoDB
connectDB();

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/partybookings", partyHallBookingRoutes);
app.use("/api/privatehallbookings", privateHallBookingRoutes);
app.use("/api/eventbookings", eventBookingRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/employees", employeeRoutes);

// Serve static files for avatars
app.use("/uploads/avatars", express.static(path.join(__dirname, "uploads", "avatars")));

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
