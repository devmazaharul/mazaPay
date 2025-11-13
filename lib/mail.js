const nodemailer =require("nodemailer")
const { AppError } = require("../utils/error");
const { responceObj } = require("../utils/responce");

// ================================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 465, // SSL
  secure: true, 
  auth: {
    user: process.env.EMAIL_ID,
    pass:process.env.EMAIL_KEY , // Use App Password if 2FA enabled
  },
});

// ================================
// 2. HTML Template Generator
// ================================
const generateHtml = ({ name, trxId, amount, senderName, dateTime, reason, isReceiver = true }) => {
  const title = isReceiver ? "Funds Received Confirmation" : "Funds Sent Confirmation";
  const message = isReceiver
    ? `Funds have been successfully deposited into your account.`
    : `Your transaction was successfully sent to ${name}.`;

  const amountColor = isReceiver ? "#0e2034" : "#c0392b";

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body style="font-family: Inter, Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <center style="width:100%; background:#f4f4f4;">
      <table style="background:#fff; width:100%; max-width:600px; margin:40px auto; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
        <tr>
          <td align="center" style="background:#0e2034; padding:20px; color:#fff;">
            <img src="https://glowniba.vercel.app/_next/image?url=%2Fmazapay.png&w=64&q=75" width="60" height="60" style="border-radius:50%;" alt="MazaPay Logo"/>
            <h1 style="margin:10px 0 0;">Maza Secure Pay</h1>
          </td>
        </tr>

        <tr>
          <td style="padding:25px; color:#333;">
            <p>Dear <strong style="text-transform:capitalize;">${name}</strong>,</p>
            <p>${message}</p>

            <table style="width:100%; border:1px solid #e0e0e0; border-radius:6px; margin:20px 0;">
              <tr style="background:#f9f9f9;">
                <td style="padding:10px 15px; font-weight:bold;">Transaction ID:</td>
                <td style="padding:10px 15px; text-align:right;">${trxId}</td>
              </tr>
              <tr>
                <td style="padding:10px 15px; font-weight:bold;">Amount:</td>
                <td style="padding:10px 15px; color:${amountColor}; text-align:right;">BDT ${amount}</td>
              </tr>
              <tr style="background:#f9f9f9;">
                <td style="padding:10px 15px; font-weight:bold;">${isReceiver ? "Sender" : "Receiver"}:</td>
                <td style="padding:10px 15px; text-align:right;">${senderName}</td>
              </tr>
              <tr>
                <td style="padding:10px 15px; font-weight:bold;">Date & Time:</td>
                <td style="padding:10px 15px; text-align:right;">${dateTime}</td>
              </tr>
              <tr style="background:#f9f9f9;">
                <td style="padding:10px 15px; font-weight:bold;">Transaction Type:</td>
                <td style="padding:10px 15px; text-align:right;">${reason}</td>
              </tr>
            </table>

            <p>Your balance has been updated. Please log in to your account for more details.</p>
            <p style="margin-top:20px;">Thank you for using <strong>MazaPay</strong>.</p>
          </td>
        </tr>

        <tr>
          <td align="center" style="background:#eeeeee; padding:15px; color:#777; font-size:12px;">
            <p style="margin:0;">This is an automated message. Please do not reply.</p>
            <p style="margin:5px 0;">&copy; 2025 MazaPay. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </center>
  </body>
  </html>`;
};

// ================================
// 3. Email Send Function
// ================================
const sendTransactionEmail = async ({
  to,
  amount = 0,
  trxId = "",
  datetime = "",
  senderName = "Unknown",
  receiverName = "User",
  reason = "Send Money",
  isReceiver = true,
}) => {
  const subject = isReceiver
    ? `Funds Received - ${trxId}`
    : `Funds Sent - ${trxId}`;

  const html = generateHtml({
    name: receiverName,
    trxId,
    amount,
    senderName,
    dateTime: datetime,
    reason,
    isReceiver,
  });

  const mailOptions = {
    from: `"MazaPay" <support@pay.mazaharul.site>`,
    to,
    subject,
    html,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log(`📧 ${isReceiver ? "Receiver" : "Sender"} email sent:`, result.response);

    return responceObj({
      message: "Email sent successfully",
      status: 200,
      item: result.response,
    });
  } catch (err) {
    console.error("❌ Email send error:", err.message);
    throw  AppError("Failed to send transaction email");
  }
};

module.exports = {
  sendTransactionEmail
};
