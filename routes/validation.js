const express = require("express");
const router = express.Router();

/**
 * POST /api/validation/date
 * Validate travel date (must be today or within 1 year)
 */
router.post("/date", (req, res) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({
        error: "Missing required field",
        required: ["date"],
        example: { date: "2026-06-22" },
      });
    }

    // Parse the date
    const travelDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if valid date format
    if (isNaN(travelDate.getTime())) {
      return res.status(400).json({
        is_valid: false,
        error: "Invalid date format",
        error_message:
          "I couldn't understand that date. Please provide a date in the format YYYY-MM-DD, for example: 2026-06-22.",
      });
    }

    // Check if date is in the past
    if (travelDate < today) {
      return res.status(400).json({
        is_valid: false,
        error: "Date in the past",
        error_message:
          "That date has already passed. Please provide a date that is today or in the future.",
      });
    }

    // Check if date is more than 1 year in the future
    const oneYearFromNow = new Date(today);
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    if (travelDate > oneYearFromNow) {
      return res.status(400).json({
        is_valid: false,
        error: "Date too far in future",
        error_message:
          "I can only book flights up to one year in advance. Please choose a date within the next year.",
      });
    }

    // Date is valid!
    res.json({
      is_valid: true,
      date: date,
      message: "Date is valid",
    });
  } catch (error) {
    res.status(500).json({
      is_valid: false,
      error: error.message,
      error_message:
        "There was an error validating the date. Please try again.",
    });
  }
});

module.exports = router;
