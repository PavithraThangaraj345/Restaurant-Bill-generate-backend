// server/utils/mailSender.js
const nodemailer = require("nodemailer");
const puppeteer = require("puppeteer");

// ======================================
// ⚙️ Transporter and Helper Functions
// ======================================

/**
 * Creates a new Nodemailer transporter instance.
 * @returns {object} The configured transporter object.
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      ciphers: 'SSLv3'
    }
  });
};

/**
 * Renders HTML to a PDF buffer using Puppeteer.
 * @param {string} htmlContent - The HTML string to convert.
 * @returns {Promise<Buffer>} The PDF buffer.
 */
const renderHtmlToPdf = async (htmlContent) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    return await page.pdf({ format: 'A4' });
  } finally {
    if (browser) await browser.close();
  }
};


// ==========================
// 📧 Email Sending Functions
// ==========================

/**
 * Sends a table reservation confirmation email with a PDF attachment.
 * @param {object} user - User details (e.g., { username, email }).
 * @param {object} reservation - Reservation details.
 */
const sendTableConfirmationEmail = async (user, reservation) => {
  try {
    const transporter = createTransporter();

    const htmlContent = `
      <div style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #333;">
        <h2>Hi ${user.name},</h2>
        <p>Thank you for reserving a table with <strong>INN Dine</strong>!</p>
        <h3>🔖 Table Reservation Details</h3>
        <ul style="list-style-type: none; padding: 0;">
          <li><b>Date:</b> ${reservation.date}</li>
          <li><b>Time:</b> ${reservation.time}</li>
          <li><b>Guests:</b> ${reservation.people}</li>
          <li><b>Status:</b> ${reservation.paymentStatus}</li>
          <li><b>Advance Paid:</b> ₹${reservation.amount}</li>
        </ul>
        <p>We look forward to serving you!</p>
        <p>– INN Dine Team</p>
      </div>
    `;

    const pdfBuffer = await renderHtmlToPdf(htmlContent);

    const mailOptions = {
      from: `"INN Dine" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "✅ Table Reservation Confirmed",
      html: htmlContent,
      attachments: [{
        filename: 'table_reservation_details.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf'
      }]
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Table reservation email sent successfully.");
  } catch (error) {
    console.error("❌ Error sending table reservation email:", error);
    throw error;
  }
};


/**
 * Sends a party booking confirmation email with a PDF bill.
 * @param {object} user - User details (e.g., { name, email }).
 * @param {object} booking - Booking details.
 */
const sendPartyConfirmationEmail = async (user, booking) => {
  try {
    const transporter = createTransporter();

    // Generate HTML for the email body and PDF
    const selectedItemsHtml = booking.selectedItems
      .filter((item) => item.category !== "Occasion")
      .map((item) => `<li><b>${item.name}</b> - ₹${item.price}</li>`)
      .join("");

    const advanceAmount = Math.round(booking.amount * 0.3);
    const balanceAmount = booking.amount - advanceAmount;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #a42021;">🎉 Party Hall Booking Confirmed! 🎉</h2>
        <p>Hi ${user.name},</p>
        <p>Your party hall booking at <strong>INN Dine</strong> is officially confirmed!</p>
        
        <h3>Booking Details</h3>
        <ul style="list-style-type: none; padding: 0;">
          <li><b>Date:</b> ${booking.date}</li>
          <li><b>Time Slot:</b> ${booking.timeSlot}</li>
          <li><b>Guests:</b> ${booking.guests}</li>
          <li><b>Total Estimated Cost:</b> ₹${booking.amount}</li>
          <li><b>Advance Paid:</b> ₹${advanceAmount}</li>
          <li><b>Remaining Balance:</b> ₹${balanceAmount}</li>
        </ul>
        
        ${booking.selectedItems.length > 0 ? `<p><strong>Add-ons Selected:</strong></p><ul>${selectedItemsHtml}</ul>` : ""}
        
        <p>The remaining balance is to be paid at the venue.</p>
        <p>We look forward to celebrating with you!</p>
        <p>– INN Dine Team</p>
      </div>
    `;

    const pdfBuffer = await renderHtmlToPdf(htmlContent);

    const mailOptions = {
      from: `"INN Dine" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "🎉 Your Party Hall Booking is Confirmed!",
      html: htmlContent,
      attachments: [{
        filename: 'party_booking_bill.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf'
      }]
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Party booking email with PDF sent successfully.");
  } catch (error) {
    console.error("❌ Error sending party confirmation email:", error);
    throw error;
  }
};


/**
 * Sends a private hall booking confirmation email.
 */
const sendPrivateHallConfirmationEmail = async (user, booking) => {
  try {
    const transporter = createTransporter();

    // Generate HTML for the email
    let itemsHtml = booking.selectedItems.map(item => `<li>${item.name} - ₹${item.price}</li>`).join('');

    const htmlContent = `
      <div style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #333;">
        <h2>Hi ${user.name},</h2>
        <p>Your private hall booking at <strong>INN Dine</strong> is confirmed!</p>
        <h3>🎊 Private Hall Booking Details</h3>
        <ul style="list-style-type: none; padding: 0;">
          <li><b>Date:</b> ${booking.date}</li>
          <li><b>Time:</b> ${booking.time}</li>
          <li><b>Guests:</b> ${booking.guests}</li>
          <li><b>Event Type:</b> ${booking.eventType}</li>
          <li><b>Selected Items:</b> <ul>${itemsHtml}</ul></li>
          <li><b>Total Amount:</b> ₹${booking.amount}</li>
          <li><b>Advance Paid:</b> ₹${booking.advanceAmount}</li>
          <li><b>Balance Due:</b> ₹${booking.balanceAmount}</li>
          <li><b>Payment Status:</b> ${booking.paymentStatus}</li>
        </ul>
        <p>We look forward to hosting your event!</p>
        <p>– INN Dine Team</p>
      </div>
    `;

    const pdfBuffer = await renderHtmlToPdf(htmlContent);

    const mailOptions = {
      from: `"INN Dine" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "🎊 Private Hall Booking Confirmed",
      html: htmlContent,
      attachments: [{
        filename: 'private_hall_booking.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf'
      }]
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Private hall booking email sent successfully.");
  } catch (error) {
    console.error("❌ Error sending private hall booking email:", error);
    throw error;
  }
};

/**
 * Sends an event catering confirmation email.
 */
/* @param {object} user - User details (e.g., { name, email }).
 * @param {object} booking - Booking details.
 */
const sendEventBookingConfirmationEmail = async (user, booking) => {
  try {
    const transporter = createTransporter();

    // Generate HTML for the email
    let itemsHtml = booking.selectedItems.map(item => `<li>${item.name} - ₹${item.price}</li>`).join('');

    const htmlContent = `
      <div style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #333;">
        <h2>Hi ${user.name},</h2>
        <p>Your event hall booking at <strong>INN Dine</strong> is confirmed!</p>
        <h3>🎉 Event Hall Booking Details</h3>
        <ul style="list-style-type: none; padding: 0;">
          <li><b>Date:</b> ${booking.date}</li>
          <li><b>Time:</b> ${booking.time}</li>
          <li><b>Guests:</b> ${booking.guests}</li>
          <li><b>Occasion:</b> ${booking.occasion}</li>
          <li><b>Selected Items:</b> <ul>${itemsHtml}</ul></li>
          <li><b>Total Amount:</b> ₹${booking.amount}</li>
          <li><b>Advance Paid:</b> ₹${booking.advanceAmount}</li>
          <li><b>Balance Due:</b> ₹${booking.balanceAmount}</li>
          <li><b>Payment Status:</b> ${booking.paymentStatus}</li>
          <li><b>Additional Message:</b> ${booking.message || "N/A"}</li>
        </ul>
        <p>We can't wait to host your event!</p>
        <p>– INN Dine Team</p>
      </div>
    `;

    const pdfBuffer = await renderHtmlToPdf(htmlContent);

    const mailOptions = {
      from: `"INN Dine" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "🎉 Event Hall Booking Confirmed",
      html: htmlContent,
      attachments: [{
        filename: 'event_hall_booking.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf'
      }]
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Event booking email with PDF sent successfully.");
  } catch (error) {
    console.error("❌ Error sending event booking confirmation email:", error);
    throw error;
  }
};

module.exports = {
  sendTableConfirmationEmail,
  sendPartyConfirmationEmail,
  sendPrivateHallConfirmationEmail,
  sendEventBookingConfirmationEmail,
};
