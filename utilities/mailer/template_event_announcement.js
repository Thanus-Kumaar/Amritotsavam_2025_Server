const TEMPLATE_EVENT_ANNOUNCEMENT = (eventName, announcement) => {
    return `
    
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Amritotsavam 2025 | Event Announcement</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
        }
        body {
            background: linear-gradient(135deg, #f9f0e3, #f2d8c7);
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
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
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
            color: #6d071a;
            margin-bottom: 20px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.15);
        }
        strong {
            font-size: 1.1em;
            font-weight: bold;
            color: #6d071a;
        }
        .details {
            font-size: 18px;
            color: #4d0112;
            background: linear-gradient(to right, #f9dbd8, #f5b5a9);
            padding: 10px;
            border-radius: 10px;
            display: inline-block;
            margin: 10px 0;
            letter-spacing: 1px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        }
        .footer {
            font-size: 14px;
            color: #6d071a;
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
        <div class="header">Amritotsavam</div>
        <div class="sub-header">${eventName} - Announcement</div>
        <div class="content">
            <p>${announcement}</p>
        </div>
        <div class="footer">
            &copy; 2025 Amritotsavam. All Rights Reserved.
        </div>
    </div>
</body>

</html>`;
};

export default TEMPLATE_EVENT_ANNOUNCEMENT;
