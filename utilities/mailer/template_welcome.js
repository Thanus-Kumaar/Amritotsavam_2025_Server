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
            background: linear-gradient(135deg, #f0e6d2, #e6d8c3);
            color: #2c3e50;
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
            border: 2px solid #a78b5c;
            text-align: center;
        }
        .header {
            font-size: 36px;
            font-weight: bold;
            text-transform: uppercase;
            color: #5d4037;
            margin-bottom: 10px;
            background: linear-gradient(to right, #8e6e53, #c2a67d);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: 2px;
        }
        .sub-header {
            font-size: 18px;
            font-style: italic;
            color: #6f5136;
            margin-bottom: 20px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
        .logo-container {
            text-align: center;
            margin-bottom: 20px;
        }
        .logo {
            width: 100px;
        }
        .details {
            font-size: 18px;
            color: #5d4037;
            background: linear-gradient(to right, #f2d7b3, #d1af8a);
            padding: 10px;
            border-radius: 10px;
            display: inline-block;
            margin: 10px 0;
            letter-spacing: 1px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .footer {
            font-size: 14px;
            color: #6f5136;
            margin-top: 20px;
            opacity: 0.8;
        }
        p {
            margin: 10px 0;
            line-height: 1.6;
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
            .details {
                font-size: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo-container">
            <img class="logo" src="https://b4ia3y8s78.ufs.sh/f/1rBJ3VmOgbeLRTo2PP4BcQ9dJivoLyXlq4CzWHZ8eSAR130p" alt="Amritotsavam Logo">
        </div>
        <div class="header">Amritotsavam 2025 Invitation</div>
        <div class="content">
            <p>Dear ${userName},</p>
            <p>We are thrilled to invite you to <strong>Amritotsavam 2025</strong>, an elite platform where innovation, strategy, and skill converge. Get ready to challenge yourself, connect with brilliant minds, and experience an event that celebrates excellence.</p>
            
            <h3>Why Attend?</h3>
            <ul>
                <li>🔥 Compete in high-stakes challenges that test your skills and strategy.</li>
                <li>🚀 Network with industry experts, mentors, and fellow participants.</li>
                <li>🏆 Seize the opportunity to showcase your talent and win prestigious accolades.</li>
            </ul>
            <br />
            <h3>Event Details</h3>
            <p class="details">
                📅 March 3rd & 4th, 2025<br>
                📍 Amrita School of Business, Coimbatore
            </p>
            
            <p>Stay updated with event announcements, exclusive content, and more by following us on our social media platforms.</p>
            
            <p>We look forward to welcoming you to <strong>Amritotsavam'25</strong>—where the best rise to the challenge!</p>
        </div>
        <div class="footer">
            <strong>Best Regards,</strong><br>
            Team Amritotsavam<br>
            Amrita School of Business, Coimbatore<br>
            <a href="https://pragati.amrita.edu/" target="_blank">https://pragati.amrita.edu/</a>
        </div>
    </div>
</body>
</html>

  `;
};

export default TEMPLATE_WELCOME;
