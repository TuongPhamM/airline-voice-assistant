const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const airportRoutes = require("./routes/airport");
const flightRoutes = require("./routes/flights");
const bookingRoutes = require("./routes/booking");
const notificationRoutes = require("./routes/notification");
const validationRoutes = require("./routes/validation");

// Use routes
app.use("/api/airport", airportRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/validation", validationRoutes);

// Test endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Airline Voice Assistant API is running",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
