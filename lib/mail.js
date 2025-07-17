const nodemailer = require("nodemailer");
const { responceObj } = require("../utils/responce");
const { AppError } = require("../utils/error");

// 1. Setup the transporter (Gmail SMTP example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'work.mazaharul@gmail.com',
    pass: 'jgsewnfwzcqnyofx', // Use App Password if 2FA enabled
  },
});

const genarateHtml=({name,trxId,amount,senderName,dateTime,reson})=>{
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Funds Received Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #f4f4f4; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
    <center style="width: 100%; background-color: #f4f4f4;">
        <div style="display: none; font-size: 1px; color: #f4f4f4; line-height: 1px; font-family: 'Inter', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
            Funds successfully credited to your account.
        </div>
        <!-- Email Wrapper Table -->
        <table align="center" border="0" cellpadding="0" cellspacing="0" style="background-color: #ffffff; width: 100%; max-width: 600px; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 8px; overflow: hidden; margin: 40px auto; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <!-- Header Section -->
            <tr>
                <td align="center" style="padding: 20px 20px; background-color: #0e2034; color: #ffffff; text-align: center; border-radius: 8px 8px 0 0;">
                    <a href="#" style="text-decoration: none; color: #ffffff;">
                        <img src="https://glowniba.vercel.app/_next/image?url=%2Fmazapay.png&w=64&q=75" alt="Company Logo" width="60" height="60" style="display: inline-block; border-radius: 50%;">
                        <h1 style="font-size: 28px; line-height: 1.2; margin: 10px 0 0; color: #ffffff; font-weight: bold;">Maza secure pay</h1>
                    </a>
                </td>
            </tr>

            <!-- Content Section -->
            <tr>
                <td style="padding: 30px 25px; text-align: left; color: #333333;">
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Dear <strong style="text-transform: capitalize;font-weight: bold;">${name}</strong>,
                    </p>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Funds have been successfully deposited into your account. Find transaction details below:
                    </p>

                    <!-- Transaction Details Table -->
                    <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; margin-bottom: 25px; border: 1px solid #e0e0e0; border-radius: 6px; overflow: hidden;">
                        <tr style="background-color: #f9f9f9;">
                            <td style="padding: 12px 15px; font-size: 14px; color: #555555; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Transaction ID:</td>
                            <td style="padding: 12px 15px; font-size: 14px; color: #333333; border-bottom: 1px solid #e0e0e0; text-align: right;"><strong>${trxId}</strong></td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 15px; font-size: 14px; color: #555555; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Amount Received:</td>
                            <td style="padding: 12px 15px; font-size: 14px; color: #333333; border-bottom: 1px solid #e0e0e0; text-align: right;"><strong style="font-size: 18px; color: #0e2034;">BDT ${amount}</strong></td>
                        </tr>
                        <tr style="background-color: #f9f9f9;">
                            <td style="padding: 12px 15px; font-size: 14px; color: #555555; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Sender's Name:</td>
                            <td style="padding: 12px 15px; font-size: 14px; color: #333333; border-bottom: 1px solid #e0e0e0; text-align: right;">${senderName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 15px; font-size: 14px; color: #555555; font-weight: bold;">Date & Time:</td>
                            <td style="padding: 12px 15px; font-size: 14px; color: #333333; text-align: right;">${dateTime}</td>
                        </tr>
                      
                        <tr>
                            <td style="padding: 12px 15px; font-size: 14px; color: #555555; font-weight: bold;">Trx type:</td>
                            <td style="padding: 12px 15px; font-size: 14px; color: #333333; text-align: right;">${reson}</td>
                        </tr>
                      
                    </table>

                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                        Your balance has been updated. Please log in to view your account status.
                    </p>

               
                            </td>
                        </tr>
                    </table>

                    <p style="font-size: 16px; line-height: 1.6; margin-top: 25px;">
                        Thank you for using our service,<br>
                        <strong style="font-weight: bold;">The MazaPay Team</strong>
                    </p>
                </td>
            </tr>

            <!-- Footer Section -->
            <tr>
                <td align="center" style="padding: 20px 20px; background-color: #eeeeee; color: #777777; font-size: 12px; line-height: 1.5; border-radius: 0 0 8px 8px;">
                    <p style="margin: 0 0 5px;">Maza secure pay</p>
                    <p style="margin: 0 0 5px;">
                        <a href="https://newmazaharul.vercel.app" taeget="_blank" style="color: #28a745; text-decoration: none;">Organization</a>
                         |
                        <a href="mailto:supprort@mazapay.com" style="color: #28a745; text-decoration: none;">support@mazapay.com</a>
                    </p>
                    <p style="margin: 0;">This is an automated message. Please do not reply.</p>
                    <p style="margin: 10px 0 0;">&copy; 2025 MazaPay. All rights reserved.</p>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>
`

}

// 3. Send email function
const sendTransactionEmail = async ({to,amount=0,trxId="",datetime="",senderName="unknown",recivername="user",reson="send money"}) => {
  const mailOptions = {
    from: '"MazaPay" <support@mazapay.com>',
    to:to,
    subject: `Funds Received Confirmation - ${trxId}`,
    html: genarateHtml({
      amount:amount,
      dateTime:datetime,
      name:recivername,
      senderName:senderName,
      trxId:trxId,
      reson
    }),
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", result.response);
    return responceObj({
      message:"Mail send successfull",
      status:200,
      item:result.response

    })
  } catch (err) {
    console.error("❌ Failed to send email:", err);
    throw AppError("Faild to send email")
  }
};

module.exports={
  sendTransactionEmail
}