const getEmailTemplate = ({ title, userName, content }) => {
  const baseTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Arial', sans-serif;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #19aaba 0%, #116d77 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 30px;
          color: #333;
          line-height: 1.6;
        }
        .greeting {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
          color: #19aaba;
        }
        .message {
          margin: 20px 0;
          white-space: pre-wrap;
          font-size: 15px;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          font-size: 13px;
          color: #666;
          border-top: 1px solid #e0e0e0;
        }
        .footer p {
          margin: 5px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 Perceptron-13</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px;">Industrial Tour 2025</p>
        </div>
        <div class="content">
          <div class="greeting">Hello ${userName},</div>
          <div class="message">${content}</div>
          <p style="margin-top: 30px; color: #666;">
            Best regards,<br/>
            <strong>The Perceptron-13 Team</strong>
          </p>
        </div>
        <div class="footer">
          <p><strong>Perceptron-13</strong></p>
          <p>Computer Science & Engineering</p>
          <p>Jashore University of Science & Technology</p>
          <p style="margin-top: 10px; font-size: 11px; color: #999;">
            This is an automated email. Please do not reply to this message.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return baseTemplate;
};

module.exports = { getEmailTemplate };
