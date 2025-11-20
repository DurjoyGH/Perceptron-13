require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');
const { getEmailTemplate } = require('../utils/emailTemplate');
const nodemailer = require('nodemailer');

const sendTestEmail = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find user with studentID 200120
    const user = await User.findOne({ studentID: '200120' });
    
    if (!user) {
      console.log('User with studentID 200120 not found');
      process.exit(1);
    }

    console.log(`Found user: ${user.name} (${user.email})`);

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASSWORD
      }
    });

    // Test email content
    const subject = 'Test Email from Perceptron-13 Admin Dashboard';
    const message = `Dear ${user.name},

This is a test email from the Perceptron-13 Admin Dashboard to verify that the email system is working correctly.

If you're receiving this, it means:
✅ The email system is configured properly
✅ Your email address (${user.email}) is valid
✅ We can successfully send emails to committee members

Best regards,
Perceptron-13 Tour Management Team`;

    // Generate HTML email
    const htmlContent = getEmailTemplate({
      title: subject,
      userName: user.name,
      content: message,
      type: 'test'
    });

    // Send email
    const mailOptions = {
      from: `Perceptron-13 <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: subject,
      html: htmlContent
    };

    console.log('\nSending test email...');
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully!');
    console.log(`Message ID: ${info.messageId}`);
    console.log(`Recipient: ${user.name} <${user.email}>`);
    console.log(`Subject: ${subject}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error sending email:', error);
    process.exit(1);
  }
};

sendTestEmail();
