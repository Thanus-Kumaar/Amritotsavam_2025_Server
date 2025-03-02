const TEMPLATE_EVENT_REGISTRATION_OTP = (
    userName,
    eventName,
    transactionId,
    totalMembers,
) => {
    return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Amritotsavam 2025 | Event Registration Confirmation</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
        }
        body {
            background: linear-gradient(135deg, #f7e1e5, #e6c3c9);
            color: #4d0112;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .container {
            max-width: 600px;
            padding: 35px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 15px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            border: 2px solid #4d0112;
            text-align: center;
        }
        .header {
            font-size: 36px;
            font-weight: bold;
            text-transform: uppercase;
            color: #4d0112;
            margin-bottom: 10px;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: 2px;
        }
        .sub-header {
            font-size: 18px;
            font-style: italic;
            color: #7a0218;
            margin-bottom: 20px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
        strong {
            font-size: 1.1em;
            font-weight: bold;
            color: #7a0218;
        }
        .details {
            font-size: 18px;
            color: #4d0112;
            background: linear-gradient(to right, #f8c4cc, #e08a94);
            padding: 10px;
            border-radius: 10px;
            display: inline-block;
            margin: 10px 0;
            letter-spacing: 1px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .footer {
            font-size: 14px;
            color: #7a0218;
            margin-top: 20px;
            opacity: 0.8;
        }
        p {
            margin: 10px 0;
            line-height: 1.5;
        }
        @media (max-width: 600px) {
            .header {
                font-size: 28px;
            }
            .details {
                font-size: 16px;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">Amritotsavam 2025</div>
        <div class="sub-header">Event Registration Confirmation</div>

        <p>Dear <strong>${userName}</strong>,</p>

        <p>You have successfully registered for the event:</p>

        <div class="details">
            <p><strong>Event Name:</strong> ${eventName}</p>
            <p><strong>Total Members:</strong> ${totalMembers}</p>
            <p><strong>Transaction ID:</strong> ${transactionId}</p>
        </div>

        <p>We look forward to seeing you at the event!</p>

        <p class="footer">Best regards, <br>Team Amritotsavam 2025</p>
    </div>
</body>

</html>
`;
};

export default TEMPLATE_EVENT_REGISTRATION_OTP;
