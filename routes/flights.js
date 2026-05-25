const express = require("express");
const router = express.Router();
const { searchFlights } = require("../utils/flightSearch");

/**
 * POST /api/flights/search
 * Search for available flights
 */

router.post("/search", async (req, res) => {
  try {
    const { departure, destination, date } = req.body;

    // Validate required fields
    if (!departure || !destination || !date) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["departure", "destination", "date"],
        example: {
          departure: "LAX",
          destination: "JFK",
          date: "2025-12-11",
        },
      });
    }

    // Validate date format and that it's in the future
    const flightDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(flightDate.getTime())) {
      return res.status(400).json({
        error: "Invalid date format",
        example: "2025-12-11",
      });
    }

    if (flightDate < today) {
      return res.status(400).json({
        error: "Date must be today or in the future",
      });
    }

    // Check if it's more than 1 year in the future
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    if (flightDate > oneYearFromNow) {
      return res.status(400).json({
        error: "Date must be within 1 year from today",
      });
    }

    // Call the AWS API through our utility function
    const flights = await searchFlights(departure, destination, date);
    console.log("Flights returned from searchFlights:", flights);
    console.log("Number of flights:", flights.length);

    if (flights.length === 0) {
      return res.status(404).json({
        error: "No flights available",
        message: `No flights found from ${departure} to ${destination} on ${date}`,
        errorCode: 404,
      });
    }

    res.json({
      success: true,
      count: flights.length,
      flights: flights,
    });
  } catch (error) {
    console.error("Error in /search route:", error);
    res.status(500).json({
      error: error.message,
      details: "Check server logs for more info",
    });
  }
});

module.exports = router;
