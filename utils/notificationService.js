/**
 * Send notification (SMS or Email)
 * Currently mocked - logs to console
 * In production: integrate with Twilio (SMS) and SendGrid/AWS SES (Email)
 */
async function sendNotification(method, to, booking) {
  console.log(`\n📧 Sending ${method.toUpperCase()} notification`);
  console.log("To:", to);
  console.log("Booking:", booking);

  if (method === "sms") {
    return sendSMS(to, booking);
  } else if (method === "email") {
    return sendEmail(to, booking);
  }

  throw new Error('Invalid notification method. Use "sms" or "email"');
}

/**
 * Send SMS (mock - integrate with Twilio in production)
 */
async function sendSMS(phoneNumber, booking) {
  // Validate phone number format
  const cleanPhone = phoneNumber.replace(/\D/g, "");

  if (cleanPhone.length !== 10 && cleanPhone.length !== 11) {
    throw new Error("Invalid phone number format. Expected 10 or 11 digits.");
  }

  const message = formatSMSMessage(booking);

  // TODO: In production, integrate with Twilio
  // const client = require('twilio')(accountSid, authToken);
  // await client.messages.create({
  //   body: message,
  //   from: twilioPhoneNumber,
  //   to: phoneNumber
  // });

  console.log("\n📱 SMS Message:");
  console.log("─".repeat(50));
  console.log(message);
  console.log("─".repeat(50));

  return {
    method: "sms",
    to: phoneNumber,
    sentAt: new Date().toISOString(),
    status: "sent (mock)",
    message: "SMS would be sent in production",
  };
}

/**
 * Send Email (mock - integrate with SendGrid/AWS SES in production)
 */
async function sendEmail(email, booking) {
  // Basic email validation
  if (!email.includes("@") || !email.includes(".")) {
    throw new Error("Invalid email format");
  }

  const subject = `Flight Confirmation - ${booking.confirmationNumber}`;
  const body = formatEmailMessage(booking);

  // TODO: In production, integrate with SendGrid or AWS SES
  // const sgMail = require('@sendgrid/mail');
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  // await sgMail.send({
  //   to: email,
  //   from: 'noreply@airline.com',
  //   subject: subject,
  //   html: body
  // });

  console.log("\n📧 Email:");
  console.log("─".repeat(50));
  console.log("Subject:", subject);
  console.log("To:", email);
  console.log("─".repeat(50));
  console.log(body);
  console.log("─".repeat(50));

  return {
    method: "email",
    to: email,
    sentAt: new Date().toISOString(),
    status: "sent (mock)",
    message: "Email would be sent in production",
  };
}

/**
 * Format SMS message
 */
function formatSMSMessage(booking) {
  return `✈️ Flight Confirmed!

Confirmation: ${booking.confirmationNumber}
Airline: ${booking.airline || "N/A"}
Flight: ${booking.flightNumber || "N/A"}
Passenger: ${booking.passengerName}

${booking.flightDetails.departure} → ${booking.flightDetails.destination}
Date: ${booking.flightDetails.date}
Departure: ${booking.departureTime || "Check itinerary"}
Arrival: ${booking.arrivalTime || "Check itinerary"}

Thank you for booking with us!`;
}

/**
 * Format Email message (HTML)
 */
function formatEmailMessage(booking) {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #0066cc; color: white; padding: 20px; text-align: center; }
    .content { background-color: #f9f9f9; padding: 20px; }
    .booking-details { background-color: white; padding: 15px; margin: 20px 0; border-left: 4px solid #0066cc; }
    .flight-info { display: flex; justify-content: space-between; margin: 10px 0; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
    .highlight { font-size: 24px; font-weight: bold; color: #0066cc; }
    .route { font-size: 18px; font-weight: bold; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✈️ Flight Booking Confirmed</h1>
    </div>
    
    <div class="content">
      <p>Dear ${booking.passengerName},</p>
      <p>Your flight has been successfully booked!</p>
      
      <div class="booking-details">
        <h2>Booking Details</h2>
        <p><strong>Confirmation Number:</strong> <span class="highlight">${booking.confirmationNumber}</span></p>
        
        <div class="route">
          ${booking.flightDetails.departure} → ${booking.flightDetails.destination}
        </div>
        
        <p><strong>Airline:</strong> ${booking.airline || "N/A"}</p>
        <p><strong>Flight Number:</strong> ${booking.flightNumber || "N/A"}</p>
        <p><strong>Passenger:</strong> ${booking.passengerName}</p>
        <p><strong>Travel Date:</strong> ${booking.flightDetails.date}</p>
        <p><strong>Departure Time:</strong> ${booking.departureTime || "Check itinerary"}</p>
        <p><strong>Arrival Time:</strong> ${booking.arrivalTime || "Check itinerary"}</p>
        <p><strong>Status:</strong> ${booking.status}</p>
        <p><strong>Booked At:</strong> ${new Date(booking.bookedAt).toLocaleString()}</p>
      </div>
      
      <p><strong>Important:</strong> Please arrive at the airport at least 2 hours before departure for domestic flights and 3 hours for international flights.</p>
      
      <p>Keep this confirmation number handy. You'll need it for check-in.</p>
    </div>
    
    <div class="footer">
      <p>Thank you for choosing our airline!</p>
      <p>Have a great flight! ✈️</p>
    </div>
  </div>
</body>
</html>
  `;
}

module.exports = { sendNotification };
