const express = require("express");
const router = express.Router();
const { createBooking, getBooking } = require("../utils/bookingManager");

/**
 * POST /api/booking/create
 * Create a new flight booking
 */
router.post("/create", async (req, res) => {
  try {
    const {
      flightId,
      flightNumber,
      passengerName,
      email,
      phone,
      departure,
      destination,
      date,
    } = req.body;

    console.log("\n=== BOOKING REQUEST ===");
    console.log("Request body:", req.body);

    // Validate required fields
    if (!flightId || !passengerName || !departure || !destination || !date) {
      return res.status(400).json({
        error: "Missing required fields",
        required: [
          "flightId",
          "passengerName",
          "departure",
          "destination",
          "date",
        ],
        optional: ["email", "phone", "flightNumber"],
        received: req.body,
      });
    }

    // Must have at least email or phone for confirmation
    if (!email && !phone) {
      return res.status(400).json({
        error: "Must provide email or phone number for confirmation",
      });
    }

    // Create the booking
    const booking = await createBooking({
      flightId,
      flightNumber,
      passengerName,
      email,
      phone,
      departure,
      destination,
      date,
    });

    res.json({
      success: true,
      message: "Booking confirmed",
      booking: booking,
    });
  } catch (error) {
    console.error("Error in booking route:", error);
    res.status(500).json({
      error: error.message,
      details: "Check server logs for more info",
    });
  }
});

/**
 * GET /api/booking/:confirmationNumber
 * Retrieve booking details
 */
router.get("/:confirmationNumber", (req, res) => {
  try {
    const { confirmationNumber } = req.params;

    console.log("Looking up booking:", confirmationNumber);

    const booking = getBooking(confirmationNumber);

    if (!booking) {
      return res.status(404).json({
        error: "Booking not found",
        confirmationNumber: confirmationNumber,
      });
    }

    res.json({
      success: true,
      booking: booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
