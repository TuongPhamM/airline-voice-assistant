const axios = require("axios");

const FLIGHT_API_URL =
  "https://zz1mpoguje.execute-api.us-east-1.amazonaws.com/default/airline-assessment";

async function searchFlights(departure, destination, date) {
  try {
    console.log("\n=== CALLING AWS API ===");
    console.log("URL:", FLIGHT_API_URL);
    console.log("Params:", { src: departure, dst: destination, date: date });

    const response = await axios.get(FLIGHT_API_URL, {
      params: {
        src: departure,
        dst: destination,
        date: date,
      },
    });

    // Try to extract flights from different possible formats
    let flights;

    if (Array.isArray(response.data)) {
      // AWS returned an array directly
      flights = response.data;
    } else if (response.data && response.data.flights) {
      // AWS returned an object with a flights property
      flights = response.data.flights;
    } else if (response.data && typeof response.data === "object") {
      // AWS returned a single object, wrap it in array
      flights = [response.data];
    } else {
      // Unknown format
      flights = [];
    }

    if (!flights || flights.length === 0) {
      console.log("❌ No flights to return");
      return [];
    }

    const transformed = flights.map((flight, index) => {
      console.log(`Processing flight ${index + 1}:`, flight);
      return {
        flightId: flight.flightId,
        flightNumber: flight.flightNumber || flight.number || "N/A",
        airline: flight.airline || flight.carrier || "Unknown",
        departure: {
          airport: departure,
          time: flight.departureTime || flight.departure?.time || "N/A",
          date: date,
        },
        arrival: {
          airport: destination,
          time: flight.arrivalTime || flight.arrival?.time || "N/A",
          date: date,
        },
        duration: flight.duration || "N/A",
        price: flight.price || 0,
        currency: flight.currency || "USD",
        seatsAvailable: flight.seatsAvailable || flight.seats || 0,
        class: flight.class || "Economy",
      };
    });

    return transformed;
  } catch (error) {
    console.error("\n=== ERROR ===");
    console.error("Error message:", error.message);
    console.error("Error response:", error.response?.data);

    if (error.response && error.response.status === 404) {
      return [];
    }
    throw error;
  }
}

module.exports = { searchFlights };
