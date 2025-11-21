const getEventEmailTemplate = ({ eventType, schedule, event, userName }) => {
  const baseStyle = `
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #19aaba 0%, #158c99 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; }
      .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
      .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; }
      .badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin: 5px 0; }
      .event-card { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #19aaba; }
      .info-row { margin: 10px 0; padding: 10px; background: #f9fafb; border-radius: 6px; }
      .btn { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #19aaba 0%, #158c99 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 15px 0; }
      .highlight { color: #19aaba; font-weight: bold; }
      .time-badge { background: #dbeafe; color: #1e40af; padding: 8px 16px; border-radius: 6px; font-weight: bold; display: inline-block; margin: 10px 0; }
    </style>
  `;

  const templates = {
    departure: `
      ${baseStyle}
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">🚌 Departure Reminder</h1>
          <p style="margin: 10px 0 0; opacity: 0.9;">Get Ready to Start Your Journey!</p>
        </div>
        <div class="content">
          <h2 style="color: #19aaba;">Dear ${userName},</h2>
          <p style="font-size: 16px; line-height: 1.6;">Your journey is about to begin! Here are the important details:</p>
          
          <div class="event-card">
            <h3 style="color: #19aaba; margin-top: 0;">📅 Day ${schedule.day} - ${schedule.title}</h3>
            <div class="info-row">
              <strong>📆 Date:</strong> ${schedule.date}
            </div>
            <div class="info-row">
              <strong>🕐 Time:</strong> <span class="highlight">${event.time}</span>
            </div>
            <div class="info-row">
              <strong>📍 Location:</strong> ${schedule.location}
            </div>
            <div class="info-row">
              <strong>📝 Details:</strong> ${event.description || event.title}
            </div>
          </div>

          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
            <strong>⚠️ Important Reminders:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Arrive at least 30 minutes early</li>
              <li>Bring your ID card and necessary documents</li>
              <li>Carry light luggage as per guidelines</li>
              <li>Keep emergency contacts saved</li>
              <li>Ensure you have all medications if needed</li>
            </ul>
          </div>

          <p style="font-size: 16px; line-height: 1.6; margin-top: 20px;">
            We're excited to embark on this journey with you. Safe travels! 🎒✨
          </p>
        </div>
        <div class="footer">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">Perceptron-13 Industrial Tour 2025</p>
          <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0;">JUST CSE Department</p>
        </div>
      </div>
    `,

    arrival: `
      ${baseStyle}
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">🎯 Arrival Information</h1>
          <p style="margin: 10px 0 0; opacity: 0.9;">Welcome to Your Destination!</p>
        </div>
        <div class="content">
          <h2 style="color: #19aaba;">Dear ${userName},</h2>
          <p style="font-size: 16px; line-height: 1.6;">We're arriving at our destination! Here's what you need to know:</p>
          
          <div class="event-card">
            <h3 style="color: #19aaba; margin-top: 0;">📅 Day ${schedule.day} - ${schedule.title}</h3>
            <div class="info-row">
              <strong>🕐 Expected Arrival:</strong> <span class="highlight">${event.time}</span>
            </div>
            <div class="info-row">
              <strong>📍 Destination:</strong> ${schedule.location}
            </div>
            <div class="info-row">
              <strong>📝 Event:</strong> ${event.title}
            </div>
            ${event.description ? `<div class="info-row"><strong>ℹ️ Details:</strong> ${event.description}</div>` : ''}
          </div>

          <div style="background: #dbeafe; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0;">
            <strong>📋 Upon Arrival:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Stay together with your group</li>
              <li>Follow your group leader's instructions</li>
              <li>Keep your belongings secure</li>
              <li>Wait for accommodation check-in details</li>
            </ul>
          </div>
        </div>
        <div class="footer">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">Perceptron-13 Industrial Tour 2025</p>
          <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0;">JUST CSE Department</p>
        </div>
      </div>
    `,

    meal: `
      ${baseStyle}
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">🍽️ Meal Time</h1>
          <p style="margin: 10px 0 0; opacity: 0.9;">Dining Information</p>
        </div>
        <div class="content">
          <h2 style="color: #19aaba;">Dear ${userName},</h2>
          <p style="font-size: 16px; line-height: 1.6;">It's time to enjoy a meal together!</p>
          
          <div class="event-card">
            <h3 style="color: #19aaba; margin-top: 0;">🍽️ ${event.title}</h3>
            <div class="time-badge">🕐 ${event.time}</div>
            <div class="info-row">
              <strong>📍 Location:</strong> ${schedule.location}
            </div>
            ${event.description ? `<div class="info-row"><strong>📝 Details:</strong> ${event.description}</div>` : ''}
          </div>

          <p style="font-size: 16px; line-height: 1.6;">
            Please be punctual and enjoy your meal! 🍴
          </p>
        </div>
        <div class="footer">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">Perceptron-13 Industrial Tour 2025</p>
        </div>
      </div>
    `,

    accommodation: `
      ${baseStyle}
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">🏨 Accommodation Details</h1>
          <p style="margin: 10px 0 0; opacity: 0.9;">Your Stay Information</p>
        </div>
        <div class="content">
          <h2 style="color: #19aaba;">Dear ${userName},</h2>
          <p style="font-size: 16px; line-height: 1.6;">Here are your accommodation details:</p>
          
          <div class="event-card">
            <h3 style="color: #19aaba; margin-top: 0;">🏨 ${event.title}</h3>
            <div class="info-row">
              <strong>🕐 Check-in Time:</strong> <span class="highlight">${event.time}</span>
            </div>
            <div class="info-row">
              <strong>📍 Location:</strong> ${schedule.location}
            </div>
            ${event.description ? `<div class="info-row"><strong>📝 Details:</strong> ${event.description}</div>` : ''}
          </div>

          <div style="background: #e0e7ff; padding: 15px; border-radius: 8px; border-left: 4px solid #6366f1; margin: 20px 0;">
            <strong>🔑 Check-in Guidelines:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Bring your ID for verification</li>
              <li>Keep room keys safe</li>
              <li>Follow hotel rules and regulations</li>
              <li>Report any issues to your group leader</li>
            </ul>
          </div>
        </div>
        <div class="footer">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">Perceptron-13 Industrial Tour 2025</p>
        </div>
      </div>
    `,

    sightseeing: `
      ${baseStyle}
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">🏞️ Sightseeing Adventure</h1>
          <p style="margin: 10px 0 0; opacity: 0.9;">Explore and Enjoy!</p>
        </div>
        <div class="content">
          <h2 style="color: #19aaba;">Dear ${userName},</h2>
          <p style="font-size: 16px; line-height: 1.6;">Get ready for an exciting sightseeing experience!</p>
          
          <div class="event-card">
            <h3 style="color: #19aaba; margin-top: 0;">🏞️ ${event.title}</h3>
            <div class="time-badge">🕐 ${event.time}</div>
            <div class="info-row">
              <strong>📍 Destination:</strong> ${schedule.location}
            </div>
            ${event.description ? `<div class="info-row"><strong>📝 About:</strong> ${event.description}</div>` : ''}
          </div>

          <div style="background: #d1fae5; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
            <strong>📸 Tips for a Great Experience:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Bring your camera or phone for photos</li>
              <li>Wear comfortable shoes</li>
              <li>Stay hydrated</li>
              <li>Stay with your group</li>
              <li>Follow local guidelines and respect the place</li>
            </ul>
          </div>
        </div>
        <div class="footer">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">Perceptron-13 Industrial Tour 2025</p>
        </div>
      </div>
    `,

    industrial: `
      ${baseStyle}
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">🏭 Industrial Visit</h1>
          <p style="margin: 10px 0 0; opacity: 0.9;">Professional Learning Experience</p>
        </div>
        <div class="content">
          <h2 style="color: #19aaba;">Dear ${userName},</h2>
          <p style="font-size: 16px; line-height: 1.6;">Important information about your industrial visit:</p>
          
          <div class="event-card">
            <h3 style="color: #19aaba; margin-top: 0;">🏭 ${event.title}</h3>
            <div class="time-badge">🕐 ${event.time}</div>
            <div class="info-row">
              <strong>📍 Venue:</strong> ${schedule.location}
            </div>
            ${event.description ? `<div class="info-row"><strong>📝 Details:</strong> ${event.description}</div>` : ''}
          </div>

          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
            <strong>⚠️ Professional Guidelines:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Dress formally and professionally</li>
              <li>Bring notebook and pen for notes</li>
              <li>Ask relevant questions during Q&A</li>
              <li>Follow safety protocols strictly</li>
              <li>Be punctual and attentive</li>
              <li>Photography may be restricted - ask first</li>
            </ul>
          </div>

          <p style="font-size: 16px; line-height: 1.6;">
            This is a valuable learning opportunity. Make the most of it! 🎓
          </p>
        </div>
        <div class="footer">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">Perceptron-13 Industrial Tour 2025</p>
        </div>
      </div>
    `,

    activity: `
      ${baseStyle}
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">🎯 Activity Alert</h1>
          <p style="margin: 10px 0 0; opacity: 0.9;">Upcoming Event</p>
        </div>
        <div class="content">
          <h2 style="color: #19aaba;">Dear ${userName},</h2>
          <p style="font-size: 16px; line-height: 1.6;">You have an upcoming activity scheduled:</p>
          
          <div class="event-card">
            <h3 style="color: #19aaba; margin-top: 0;">🎯 ${event.title}</h3>
            <div class="time-badge">🕐 ${event.time}</div>
            <div class="info-row">
              <strong>📍 Location:</strong> ${schedule.location}
            </div>
            ${event.description ? `<div class="info-row"><strong>📝 Details:</strong> ${event.description}</div>` : ''}
          </div>

          <p style="font-size: 16px; line-height: 1.6;">
            Please be present on time. Looking forward to your participation! 🙌
          </p>
        </div>
        <div class="footer">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">Perceptron-13 Industrial Tour 2025</p>
        </div>
      </div>
    `,

    special: `
      ${baseStyle}
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">⭐ Special Event</h1>
          <p style="margin: 10px 0 0; opacity: 0.9;">Don't Miss This!</p>
        </div>
        <div class="content">
          <h2 style="color: #19aaba;">Dear ${userName},</h2>
          <p style="font-size: 16px; line-height: 1.6;">We have a special event planned for you:</p>
          
          <div class="event-card" style="background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); border-left-color: #f59e0b;">
            <h3 style="color: #92400e; margin-top: 0;">⭐ ${event.title}</h3>
            <div class="time-badge" style="background: #fed7aa; color: #92400e;">🕐 ${event.time}</div>
            <div class="info-row" style="background: rgba(255,255,255,0.6);">
              <strong>📍 Venue:</strong> ${schedule.location}
            </div>
            ${event.description ? `<div class="info-row" style="background: rgba(255,255,255,0.6);"><strong>📝 About:</strong> ${event.description}</div>` : ''}
          </div>

          <p style="font-size: 16px; line-height: 1.6; margin-top: 20px;">
            This is going to be an unforgettable experience! See you there! ✨🎉
          </p>
        </div>
        <div class="footer">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">Perceptron-13 Industrial Tour 2025</p>
        </div>
      </div>
    `,

    completion: `
      ${baseStyle}
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">🎊 Journey Complete</h1>
          <p style="margin: 10px 0 0; opacity: 0.9;">Thank You for Being Part of This!</p>
        </div>
        <div class="content">
          <h2 style="color: #19aaba;">Dear ${userName},</h2>
          <p style="font-size: 16px; line-height: 1.6;">Our amazing journey comes to an end:</p>
          
          <div class="event-card" style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-left-color: #10b981;">
            <h3 style="color: #065f46; margin-top: 0;">🎊 ${event.title}</h3>
            <div class="time-badge" style="background: #a7f3d0; color: #065f46;">🕐 ${event.time}</div>
            <div class="info-row" style="background: rgba(255,255,255,0.6);">
              <strong>📍 Location:</strong> ${schedule.location}
            </div>
            ${event.description ? `<div class="info-row" style="background: rgba(255,255,255,0.6);"><strong>📝 Message:</strong> ${event.description}</div>` : ''}
          </div>

          <div style="background: #dbeafe; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <p style="font-size: 18px; font-weight: bold; color: #1e40af; margin: 0;">
              Thank you for being part of Perceptron-13! 🙏
            </p>
            <p style="color: #1e3a8a; margin: 10px 0 0;">
              The memories we created together will last forever! 💙
            </p>
          </div>

          <p style="font-size: 16px; line-height: 1.6;">
            Safe travels home, and see you back at JUST! 🎓✨
          </p>
        </div>
        <div class="footer">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">Perceptron-13 Industrial Tour 2025</p>
          <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0;">JUST CSE Department</p>
        </div>
      </div>
    `,

    default: `
      ${baseStyle}
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">📅 Event Notification</h1>
          <p style="margin: 10px 0 0; opacity: 0.9;">Day ${schedule.day} Update</p>
        </div>
        <div class="content">
          <h2 style="color: #19aaba;">Dear ${userName},</h2>
          <p style="font-size: 16px; line-height: 1.6;">Here's an update about your tour schedule:</p>
          
          <div class="event-card">
            <h3 style="color: #19aaba; margin-top: 0;">${event.title}</h3>
            <div class="info-row">
              <strong>📅 Day:</strong> Day ${schedule.day} - ${schedule.title}
            </div>
            <div class="info-row">
              <strong>🕐 Time:</strong> <span class="highlight">${event.time}</span>
            </div>
            <div class="info-row">
              <strong>📍 Location:</strong> ${schedule.location}
            </div>
            ${event.description ? `<div class="info-row"><strong>📝 Details:</strong> ${event.description}</div>` : ''}
          </div>

          <p style="font-size: 16px; line-height: 1.6;">
            Stay updated and enjoy your tour! 🎉
          </p>
        </div>
        <div class="footer">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">Perceptron-13 Industrial Tour 2025</p>
        </div>
      </div>
    `
  };

  return templates[eventType] || templates.default;
};

module.exports = { getEventEmailTemplate };
