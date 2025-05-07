import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});
export const sendOtpEmail = async (email: string, otp: string) => {
  console.log("SENDING OTP EMAIL TO:", email, "OTP:", otp);

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; background: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h2 style="color: #333;">Verify Your Email</h2>
      <p style="font-size: 15px;">Use the following OTP to verify your email address:</p>
      <p style="font-size: 24px; font-weight: bold; color: #4a90e2; text-align: center;">${otp}</p>
      <p style="font-size: 14px; color: #666;">This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 12px; text-align: center; color: #999;">Thank you for using <strong>NextJob</strong>!</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"NextJob" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email - OTP",
    html,
  });
};
