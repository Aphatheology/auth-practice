import nodemailer from 'nodemailer';
import config from "../config/config";

export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: config.email.service,
    auth: {
      user: config.email.username,
      pass: config.email.password,
    },
  });

  const mailOptions = {
    from: `Auth System <${config.email.from}>`,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};

export const buildVerificationEmail = (otp: string) => {
  return `
    <h3>Email Verification</h3>
    <p>Please use the OTP below to verify your email address:</p>
    <div style="font-size: 24px; font-weight: bold; margin: 16px 0; color: #4CAF50;">
      ${otp}
    </div>
    <p>This OTP will expire in 10 minutes. If you didn’t request this, please ignore this email.</p>
  `;
};

export const buildResetPasswordEmail = (otp: string) => {
  return `
    <h3>Password Reset</h3>
    <p>Please use the OTP below to reset your password:</p>
    <div style="font-size: 24px; font-weight: bold; margin: 16px 0; color: #f44336;">
      ${otp}
    </div>
    <p>This OTP will expire in 10 minutes. If you didn’t request a password reset, please ignore this email.</p>
  `;
};

// export const buildVerificationEmail = (token: string, otp: string) => {
//   const url = `${config.client.url}/verify-email?token=${token}`;
//   return `
//     <h3>Email Verification</h3>
    
//     <p>You can verify your email by:</p>

//     <ul>
//       <li>🔗 Clicking the link: <a href="${url}" style="padding: 10px 20px; background: #4CAF50; color: white; text-decoration: none;">Verify Email</a></li>
//       <li>🔢 Or entering this OTP: <strong>${otp}</strong></li>
//     </ul>
//   `;
// };

// export const buildResetPasswordEmail = (token: string) => {
//   const url = `${config.client.url}/reset-password?token=${token}`;
//   return `
//     <h3>Password Reset</h3>
//     <p>Click the button below to reset your password:</p>
//     <a href="${url}" style="padding: 10px 20px; background: #f44336; color: white; text-decoration: none;">Reset Password</a>
//   `;
// };