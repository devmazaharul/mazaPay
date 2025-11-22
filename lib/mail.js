const { Resend } = require('resend');
const { AppError } = require('../utils/error');
const { responceObj } = require('../utils/responce');

const resend = new Resend(process.env.EMAIL_KEY);

// ================================
// 2. HTML Template Generator (Updated UI)
// ================================
const generateHtml = ({
    name,       // The person receiving this email
    trxId,
    amount,
    senderName, // The person who sent the money (if isReceiver=true)
    dateTime,
    reason,
    isReceiver = true,
}) => {
    
    // Dynamic Logic for UI
    const title = isReceiver ? 'Deposit Confirmation' : 'Transfer Confirmation';
    const amountSign = isReceiver ? '+' : '-';
    // Green for incoming, Dark Gray for outgoing
    const amountColor = isReceiver ? '#10b981' : '#1f2937'; 
    const statusText = isReceiver ? 'Payment Received' : 'Money Sent';
    const subStatusText = isReceiver ? 'Added to your wallet' : 'Deducted from wallet';
    
    // If I received money, show "From: Sender". If I sent money, show "To: Receiver(name)"
    // Note: 'name' in arguments is the Email Recipient. 
    // If isReceiver is false, 'name' is actually the person who received the money from us? 
    // *Correction based on typical logic*: 
    // Usually, if isReceiver=false, we are emailing the Sender. 
    // Let's assume 'senderName' is the counterparty if we are the sender.
    // To keep it safe:
    const counterpartyLabel = isReceiver ? 'From' : 'To';
    const counterpartyValue = isReceiver ? senderName : name; 

    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

<style>
    /* 1. RESET & BASICS */
    body {
        margin: 0;
        padding: 0;
        background-color: #ecf0f3;
        font-family: 'Inter', Arial, sans-serif;
        color: #1f2937;
        -webkit-font-smoothing: antialiased;
    }

    /* 2. MAIN WRAPPER */
    .wrapper {
        width: 100%;
        table-layout: fixed;
        padding-bottom: 40px;
    }

    .webkit {
        max-width: 480px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 24px;
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.06);
        overflow: hidden;
    }

    /* 3. LOGO HEADER */
    .logo-header {
        text-align: center;
        padding-top: 35px;
        padding-bottom: 10px;
    }

    .brand-text {
        font-family: monospace;
        font-size: 28px;
        font-weight: 800;
        letter-spacing: -1px;
        background: linear-gradient(135deg, #7928ca, #ff0080);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        color: #7928ca; /* Fallback */
        margin: 0;
    }

    /* 4. HERO SECTION (AMOUNT) */
    .hero-section {
        text-align: center;
        padding: 20px 30px;
    }

    .icon-circle {
        height: 56px;
        width: 56px;
        background-color: #eafbf0;
        border-radius: 50%;
        display: inline-block;
        line-height: 56px;
        margin-bottom: 15px;
        text-align: center;
    }

    .check-mark {
        color: #10b981;
        font-size: 26px;
        font-weight: bold;
    }

    .amount-text {
        font-size: 36px;
        font-weight: 800;
        color: ${amountColor};
        margin: 5px 0;
        letter-spacing: -0.5px;
    }

    .status-title {
        color: #111827;
        font-size: 18px;
        font-weight: 600;
        margin: 0 0 5px 0;
    }

    .status-sub {
        color: #6b7280;
        font-size: 14px;
        margin: 0;
    }

    /* 5. DETAILS CARD */
    .details-card {
        background-color: #f9fafb;
        margin: 25px 30px;
        padding: 20px;
        border-radius: 16px;
        border: 1px solid #f3f4f6;
    }

    .row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 14px;
        font-size: 14px;
        align-items: center;
    }

    .row:last-child {
        margin-bottom: 0;
    }

    .label {
        color: #6b7280;
        font-weight: 500;
    }

    .value {
        color: #1f2937;
        font-weight: 600;
        text-align: right;
    }

    .trx-pill {
        font-family: monospace;
        letter-spacing: -0.5px;
        background: #e5e7eb;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 12px;
        color: #374151;
    }

    /* 6. CTA BUTTON */
    .btn-container {
        padding: 0 30px 40px 30px;
    }

    .btn {
        display: block;
        width: 100%;
        background: linear-gradient(135deg, #7928ca 0%, #9c27b0 100%);
        color: #ffffff !important;
        text-decoration: none;
        padding: 16px 0;
        text-align: center;
        border-radius: 50px;
        font-weight: 600;
        font-size: 16px;
        box-shadow: 0 4px 14px rgba(121, 40, 202, 0.3);
    }

    /* 7. FOOTER */
    .footer {
        text-align: center;
        padding: 0 20px;
        color: #9ca3af;
        font-size: 12px;
        line-height: 1.5;
    }
</style>
</head>

<body>
    <div class="wrapper">
        <div class="webkit">
            <div class="logo-header">
                <p class="brand-text">mazaPay</p>
            </div>

            <div class="hero-section">
                <div class="icon-circle">
                    <span class="check-mark">✓</span>
                </div>
                <p class="status-title">${statusText}</p>
                <h1 class="amount-text">${amountSign} BDT ${amount}</h1>
                <p class="status-sub">${subStatusText}</p>
            </div>

            <div class="details-card">
                <div class="row">
                    <span class="label">${counterpartyLabel}</span>
                    <span class="value" style="text-transform: capitalize;">${senderName}</span>
                </div>
                <div class="row">
                    <span class="label">Type</span>
                    <span class="value" style="text-transform: capitalize;">${reason}</span>
                </div>
                <div class="row">
                    <span class="label">Date</span>
                    <span class="value">${dateTime}</span>
                </div>
                <div class="row">
                    <span class="label">Trx ID</span>
                    <span class="value trx-pill">${trxId}</span>
                </div>
            </div>

            <div class="btn-container">
                <a href="https://your-mazapay-link.com" class="btn">Open MazaPay App</a>
            </div>
        </div>

        <div class="footer">
            <p>
                This is an automated message.<br>
                &copy; 2025 MazaPay. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
`;
};

// ================================
// 3. Email Send Function (RESEND)
// ================================
const sendTransactionEmail = async ({
    to,
    amount = 0,
    trxId = '',
    datetime = '',
    senderName = 'Unknown',
    receiverName = 'User',
    reason = 'Send Money',
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

    try {
        const result = await resend.emails.send({
            from: 'MazaPay <support@mazaharul.site>',
            to,
            subject,
            html,
        });

        return responceObj({
            message: 'Email sent successfully',
            status: 200,
            item: result,
        });
    } catch (err) {
        console.error('❌ Email send error:', err.message);
        throw AppError('Failed to send transaction email');
    }
};

module.exports = {
    sendTransactionEmail,
};