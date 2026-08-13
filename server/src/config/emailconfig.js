import { BrevoClient } from "@getbrevo/brevo"
import dotenv from "dotenv"
dotenv.config()

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY
});

export const sendOtpEmail = async (toEmail, otp) => {
    if (!process.env.BREVO_API_KEY || process.env.BREVO_API_KEY === 'YOUR_API_KEY') {
        console.log(`[MOCK EMAIL] OTP for ${toEmail}: ${otp}`);
        return true;
    }

    try {
        const data = await brevo.transactionalEmails.sendTransacEmail({
            subject: "Your Password Reset OTP",
            htmlContent: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Password Reset</h2>
                    <p>You requested a password reset. Here is your One-Time Password (OTP):</p>
                    <h3 style="background: #f4f4f4; padding: 10px; display: inline-block; letter-spacing: 2px;">${otp}</h3>
                    <p>This OTP will expire in 15 minutes.</p>
                    <p>If you did not request this, please ignore this email.</p>
                </div>
            `,
            sender: { name: "Mini ClickUp", email: "sakshi.rautela@appfoster.com" },
            to: [{ email: toEmail }]
        });

        console.log('OTP Email sent successfully:', data);
        return true;
    } catch (error) {
        console.error('Error sending OTP email with Brevo:', error.response ? error.response.text : error.message);
        console.log(`[MOCK EMAIL FALLBACK] OTP for ${toEmail}: ${otp}`);
        return true;
    }
}
