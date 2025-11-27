const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text, html, senderConfig }) => {
  try {
    // Use provided sender config or fall back to environment variables
    const emailUser = senderConfig ? senderConfig.email : process.env.EMAIL_USER;
    const emailPassword = senderConfig ? senderConfig.password : process.env.APP_PASSWORD;
    const smtpHost = senderConfig ? senderConfig.smtpHost : process.env.EMAIL_SMTP_HOST;
    const smtpPort = senderConfig ? senderConfig.smtpPort : 465;
    const displayName = senderConfig ? senderConfig.displayName : 'Perceptron-13';

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPassword
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: {
        name: displayName,
        address: emailUser
      },
      to,
      subject,
      text,
      html,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    console.log('Email sent to:', to);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Failed to send email to:', to);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = sendEmail;