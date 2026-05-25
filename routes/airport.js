const express = require("express");
const router = express.Router();
const { resolveAirport } = require("../utils/airportResolver");

/**
 * POST /api/airport/resolve
 * Converts city or airport name to IATA code
 */
router.post("/resolve", (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        error: "Query parameter is required",
        example: { query: "Los Angeles" },
      });
    }

    const result = resolveAirport(query);

    if (!result) {
      return res.status(404).json({
        error: "Airport not found",
        query: query,
        suggestion: "Please provide a valid city or airport name",
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
