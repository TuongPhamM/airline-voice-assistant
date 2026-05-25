const express = require("express");
const router = express.Router();
const { sendNotification } = require("../utils/notificationService");

/**
 * POST /api/notification/send
 * Send booking confirmation via SMS or Email
 */
router.post("/send", async (req, res) => {
  try {
    const { method, to, booking } = req.body;

    console.log("\n=== NOTIFICATION REQUEST ===");
    console.log("Method:", method);
    console.log("To:", to);
    console.log("Booking:", booking);

    // Validate required fields
    if (!method || !to || !booking) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["method", "to", "booking"],
        example: {
          method: "sms",
          to: "+14155551234",
          booking: { confirmationNumber: "ABC123" },
        },
      });
    }

    // Validate method
    if (!["sms", "email"].includes(method)) {
      return res.status(400).json({
        error: "Invalid method",
        validMethods: ["sms", "email"],
        received: method,
      });
    }

    // Send the notification
    const result = await sendNotification(method, to, booking);

    res.json({
      success: true,
      message: `${method.toUpperCase()} sent successfully`,
      details: result,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({
      error: error.message,
      details: "Check server logs for more info",
    });
  }
});

module.exports = router;
