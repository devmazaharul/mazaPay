const { Resend } = require('resend');
const { responceObj } = require('../utils/responce');

const resend = new Resend(process.env.EMAIL_KEY);

// ================================
// 2. HTML Template Generator (Premium Gradient Style)
// ================================
const generateHtml = ({
    trxId,
    amount,
    senderName,   
    receiverName, 
    dateTime,
    reason,
    isReceiver,   
}) => {

    // --- Dynamic Data Logic ---
    const statusText = isReceiver ? 'Payment Received' : 'Payment Sent';
    
    // Amount Color: Green for Received, Dark Gray for Sent
    // Note: Users usually prefer Black/Dark for outgoing, not Red (Red looks like error).
    // But if you strictly want Red for sent, I can change it. sticking to Dark for Classy look.
    const amountColor = isReceiver ? '#10b981' : '#1f2937'; 
    const amountSign  = isReceiver ? '+' : '';

    // Counterparty Logic
    const counterpartyLabel = isReceiver ? 'From' : 'To';
    const counterpartyName  = isReceiver ? senderName : receiverName;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${statusText}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

<style>
    /* RESET */
    body {
        margin: 0;
        padding: 0;
        background-color: #f4f5f7;
        font-family: 'Inter', Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        color: #374151;
    }

    .wrapper {
        width: 100%;
        padding: 40px 0;
        background-color: #f4f5f7;
    }

    /* CARD CONTAINER */
    .card {
        max-width: 480px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 24px; /* Modern deep curves */
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        border: 1px solid #ffffff;
    }

    /* HEADER */
    .header {
        padding: 30px 0 10px 0;
        text-align: center;
    }
    .logo {
        font-size: 22px;
        font-weight: 800;
        letter-spacing: -1px;
        color: #111827;
        font-family: monospace;
    }

    /* HERO SECTION (AMOUNT) */
    .hero {
        text-align: center;
        padding: 10px 30px 30px 30px;
    }
    
    .status-pill {
        display: inline-block;
        background: #f3f4f6;
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 15px;
    }

    .amount-display {
        font-size: 40px;
        font-weight: 800;
        color: ${amountColor};
        margin: 0;
        letter-spacing: -1px;
    }

    .currency {
        font-size: 18px;
        font-weight: 600;
        color: #9ca3af;
        vertical-align: top;
        margin-left: 4px;
        position: relative;
        top: 6px;
    }

    /* INFO BOX */
    .info-box {
        margin: 0 30px 30px 30px;
        background: #fafafa;
        border-radius: 16px;
        padding: 20px;
        border: 1px solid #f0f0f0;
    }

    .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 14px;
        font-size: 14px;
    }
    .row:last-child { margin-bottom: 0; }

    .label { color: #888888; font-weight: 500; }
    .value { color: #1f2937; font-weight: 600; text-align: right; }
    
    .trx-id {
        font-family: monospace;
        background: #eeeeee;
        padding: 2px 6px;
        border-radius: 4px;
        color: #555;
        font-size: 12px;
    }

    /* --- CUSTOM GRADIENT BUTTON --- */
    .action-container {
        padding: 0 30px 40px 30px;
    }

    .btn {
        display: block;
        width: 100%;
        text-align: center;
        text-decoration: none;
        color: #ffffff;
        font-weight: 600;
        font-size: 16px;
        padding: 16px 0;
        border-radius: 12px;
        
        /* THE REQUESTED GRADIENT */
        background: linear-gradient(135deg, #e60076 0%, #c0392b 100%);
        
        /* Glow Effect matching the gradient */
        box-shadow: 0 6px 20px rgba(121, 40, 202, 0.25);
        
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 25px rgba(192, 57, 43, 0.35);
    }

    /* FOOTER */
    .footer {
        text-align: center;
        font-size: 12px;
        color: #9ca3af;
        margin-top: 20px;
    }
</style>
</head>
<body>
    <div class="wrapper">
        <div class="card">
            
            <div class="header">
                <div class="logo">mazaPay</div>
            </div>

            <div class="hero">
                <div class="status-pill">${statusText}</div>
                <h1 class="amount-display">
                    ${amountSign}${amount}<span class="currency">BDT</span>
                </h1>
                <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 14px;">
                    ${dateTime}
                </p>
            </div>

            <div class="info-box">
                <div class="row">
                    <span class="label">${counterpartyLabel}: </span>
                    <span class="value" style="font-size: 15px; text-transform: capitalize;">${counterpartyName}</span>
                </div>
                <div class="row">
                    <span class="label">Type: </span>
                    <span class="value" style="text-transform: capitalize;">${reason}</span>
                </div>
                <div class="row">
                    <span class="label">Transaction ID: </span>
                    <span class="value trx-id">${trxId}</span>
                </div>
            </div>

            <div class="action-container">
                <a href="https://pay.mazaharul.site/main" class="btn">View Full Receipt</a>
            </div>

        </div>
        
        <div class="footer">
            <p>&copy; 2025 MazaPay Inc. Secure Payments.</p>
        </div>
    </div>
</body>
</html>
`;
};

// ================================
// 3. Email Send Function
// ================================
const sendTransactionEmail = async ({
    to,
    amount = 0,
    trxId = '',
    datetime = '',
    senderName = 'Unknown',
    receiverName = 'Unknown',
    reason = 'Transaction',
    isReceiver = true,
}) => {
    const subject = isReceiver 
        ? `Received BDT ${amount} from ${senderName}` 
        : `Sent BDT ${amount} to ${receiverName}`;

    const html = generateHtml({
        trxId,
        amount,
        senderName,
        receiverName,
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
console.log(result)
        return responceObj({
            message: 'Email sent successfully',
            status: 200,
            item: result,
        });
    } catch (err) {
        console.error('❌ Email Error:', err.message);
        // Return null or custom error object instead of throwing to avoid crashing logic
        return { success: false, error: err.message };
    }
};

module.exports = {
    sendTransactionEmail,
};