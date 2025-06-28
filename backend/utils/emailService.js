const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send email verification
const sendEmailVerification = async (email, token, name) => {
  const transporter = createTransporter();
  
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Vidhyarthi Seva - Email Verification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white;">
          <h1>Vidhyarthi Seva</h1>
          <h2>Email Verification</h2>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p>Hello ${name},</p>
          <p>Thank you for registering with Vidhyarthi Seva! Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
          </div>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <p>Best regards,<br>Vidhyarthi Seva Team</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

// Send password reset email
const sendPasswordReset = async (email, token, name) => {
  const transporter = createTransporter();
  
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Vidhyarthi Seva - Password Reset',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white;">
          <h1>Vidhyarthi Seva</h1>
          <h2>Password Reset Request</h2>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p>Hello ${name},</p>
          <p>You requested a password reset for your Vidhyarthi Seva account. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p>If you didn't request this, please ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
          <p>Best regards,<br>Vidhyarthi Seva Team</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, name) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Welcome to Vidhyarthi Seva!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white;">
          <h1>Vidhyarthi Seva</h1>
          <h2>Welcome Aboard!</h2>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p>Hello ${name},</p>
          <p>Welcome to Vidhyarthi Seva! We're excited to have you as part of our community.</p>
          <p>With Vidhyarthi Seva, you have access to:</p>
          <ul>
            <li>📚 Comprehensive Courses</li>
            <li>🍽️ Nutritious Meals</li>
            <li>🏠 Comfortable Accommodations</li>
            <li>👨‍🏫 Expert Mentorship</li>
            <li>📝 Test Series</li>
            <li>💪 Gym Facilities</li>
            <li>📖 Library Resources</li>
          </ul>
          <p>Start exploring our services and make the most of your educational journey!</p>
          <p>Best regards,<br>Vidhyarthi Seva Team</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

module.exports = {
  sendEmailVerification,
  sendPasswordReset,
  sendWelcomeEmail
}; 