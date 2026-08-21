import { BrevoClient } from "@getbrevo/brevo";
import dotenv from "dotenv";
dotenv.config();
export const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});
export const sendSignupOtpEmail = async (otp, email, name) => {
  try {
    if (!name) {
      name = email.split("@")[0];
    }
    const res = await brevo.transactionalEmails.sendTransacEmail({
      subject: "MiniClickUp Signup OTP Verification",
      textContent: `Your MiniClickUp signup verification code is ${otp}. Please do not share this with anyone.`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4A90E2;">Welcome to MiniClickUp!</h2>
          <p>Thank you for signing up. Use the verification code below to complete your registration:</p>
          <div style="background: #F4F5F7; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; border-radius: 4px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 12px; color: #777;">This code is valid for a limited time. If you did not request this email, please ignore it.</p>
        </div>
      `,
      sender: {
        name: "MiniClickUp Team",
        email: "sakshi.rautela@appfoster.com",
      },
      to: [{ email: email, name: name }],
    });
    return { res };
  } catch (error) {
    return { error };
  }
};
export const sendForgetOtpEmail = async (otp, email, name) => {
  try {
    if (!name) {
      name = email.split("@")[0];
    }
    const res = brevo.transactionalEmails.sendTransacEmail({
      subject: "MiniClickUp Password Reset Request",
      textContent: `Your MiniClickUp password reset code is ${otp}. Please do not share this with anyone.`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #D0021B;">Reset Your Password</h2>
          <p>We received a request to reset your MiniClickUp password. Use the verification code below:</p>
          <div style="background: #F4F5F7; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; border-radius: 4px; margin: 20px 0; color: #D0021B;">
            ${otp}
          </div>
          <p style="font-size: 12px; color: #777;">If you did not request a password reset, please secure your account immediately.</p>
        </div>
      `,
      sender: {
        name: "MiniClickUp Security",
        email: "sakshi.rautela@appfoster.com",
      },
      to: [{ email: email, name: name }],
    });
    return { res };
  } catch (error) {
    console.error("sendForgetOtpEmail error:", error);
    return { error };
  }
};
