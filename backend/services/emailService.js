const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: {
        name: 'Perceptron-13',
        address: process.env.EMAIL_USER
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