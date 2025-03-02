const TEMPLATE_WELCOME = (userName) => {
    return `
 <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Amritotsavam 2025 Invitation</title>
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
            background: linear-gradient(to right, #7a0218, #a30423);
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
        ul {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }
        @media (max-width: 600px) {
            .header {
                font-size: 28px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Amritotsavam 2025 Invitation</div>
        <div class="content">
            <p>Dear ${userName},</p>
            <p><strong>Dive into Diversity at Amritotsavam 2025!</strong> Immerse yourself in a weekend of culture, creativity, and connection at <strong>Amrita Vishwa Vidyapeetham</strong> from <strong>March 20-22, 2025</strong>. 🎉 Don’t miss out on the celebration of art, music, and talent!</p>
            
            <h3>What is Amritotsavam?</h3>
            <p>Amritotsavam is the grand cultural fest of <strong>Amrita Vishwa Vidyapeetham, Coimbatore</strong>. It is a vibrant platform where students showcase their talents and celebrate excellence in various art forms.</p>
            
            <h3>Categories of Events</h3>
            <ul>
                <li>💃 Dance</li>
                <li>🎵 Music</li>
                <li>🎭 Theatre</li>
                <li>📖 Literary</li>
                <li>🎨 Fine Arts</li>
            </ul>
            
            <p>Join us for an unforgettable experience where creativity meets passion!</p>
        </div>
        <div class="footer">
            <strong>Best Regards,</strong><br>
            Team Amritotsavam 2025<br>
            Amrita Vishwa Vidyapeetham, Coimbatore<br>

        </div>
    </div>
</body>
</html>`;
};

export default TEMPLATE_WELCOME;
