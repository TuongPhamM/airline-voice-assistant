const airports = require("../data/airports.json");

// Convert city name or airport name to IATA code

function resolveAirport(query) {
  if (!query) return null;

  const searchTerm = query.toLowerCase().trim();

  // Chack if its already an IATA code (3 letters)
  if (searchTerm.length === 3) {
    const airport = airports.find(
      (a) => a.iataCode.toLowerCase() === searchTerm,
    );
    if (airport) return airport.iataCode;
  }

  // Search by city name (exact match)
  let airport = airports.find((a) => a.city.toLowerCase() === searchTerm);

  if (airport) return airport;

  // Search by airport name (partial match)
  airport = airports.find((a) =>
    a.airportName.toLowerCase().includes(searchTerm),
  );

  if (airport) return airport;

  // Fuzzy search by city (partial match)
  airport = airports.find(
    (a) =>
      a.city.toLowerCase().includes(searchTerm) ||
      searchTerm.includes(a.city.toLowerCase()),
  );

  return airport || null;
}

module.exports = { resolveAirport };
