const axios = require("axios");

const FLIGHT_API_URL =
  "https://zz1mpoguje.execute-api.us-east-1.amazonaws.com/default/airline-assessment";

// In-memory storage for bookings (in production, use a database)
const bookings = new Map();

/**
 * Generate a random confirmation number
 */
function generateConfirmationNumber() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Create a new booking using the real AWS API
 */
async function createBooking(bookingData) {
  try {
    console.log("\n=== CREATING BOOKING ===");
    console.log("Booking data received:", bookingData);

    // Split passenger name into first and last name
    const nameParts = bookingData.passengerName.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || nameParts[0]; // If no last name, use first name

    console.log("Split name:", { firstName, lastName });

    // Prepare the request for AWS
    const awsRequest = {
      flightId: bookingData.flightId,
      passenger: {
        firstName: firstName,
        lastName: lastName,
      },
      date: bookingData.date,
    };

    console.log("Sending to AWS:", awsRequest);
    console.log("URL:", FLIGHT_API_URL);
    console.log("Params:", {
      src: bookingData.departure,
      dst: bookingData.destination,
      date: bookingData.date,
    });

    // Call the AWS booking API
    const response = await axios.post(FLIGHT_API_URL, awsRequest, {
      params: {
        src: bookingData.departure,
        dst: bookingData.destination,
        date: bookingData.date,
      },
    });

    console.log("AWS booking response:", response.data);

    // Extract confirmation number from AWS or generate one
    const confirmationNumber =
      response.data.confirmationNumber ||
      response.data.confirmation ||
      generateConfirmationNumber();

    // Store the booking locally
    const booking = {
      confirmationNumber: confirmationNumber,
      flightId: bookingData.flightId,
      flightNumber: bookingData.flightNumber,
      passengerName: bookingData.passengerName,
      email: bookingData.email || null,
      phone: bookingData.phone || null,
      status: "CONFIRMED",
      bookedAt: new Date().toISOString(),
      flightDetails: {
        departure: bookingData.departure,
        destination: bookingData.destination,
        date: bookingData.date,
      },
    };

    // Save to our in-memory storage
    bookings.set(confirmationNumber, booking);

    console.log("✅ Booking created successfully:", booking);

    return booking;
  } catch (error) {
    console.error("\n=== BOOKING ERROR ===");
    console.error("Error message:", error.message);
    console.error("Error response:", error.response?.data);
    throw new Error(
      `Failed to create booking: ${error.response?.data?.message || error.message}`,
    );
  }
}

/**
 * Retrieve a booking by confirmation number
 */
function getBooking(confirmationNumber) {
  return bookings.get(confirmationNumber) || null;
}

/**
 * Get all bookings (for testing)
 */
function getAllBookings() {
  return Array.from(bookings.values());
}

module.exports = {
  createBooking,
  getBooking,
  getAllBookings,
};
