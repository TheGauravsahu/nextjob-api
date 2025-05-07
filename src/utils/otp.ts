import otpModel from "../models/otp.model";
import { sendOtpEmail } from "../services/mailer";

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const createAndSendOtp = async (email: string) => {
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  await otpModel.findOneAndDelete({ email }); // clean existing OTPs

  await otpModel.create({
    email,
    otp,
    expiresAt,
  });

  await sendOtpEmail(email, otp);
};

export const verifyOtp = async (email: string, inputOtp: string) => {
  const otp = await otpModel.findOne({ email });

  if (!otp) {
    throw new Error("OTP not found or expired");
  }
  if (otp.otp !== inputOtp) {
    throw new Error("Invalid OTP");
  }
  if (otp.expiresAt < new Date()) {
    throw new Error("OTP expired");
  }

  await otpModel.deleteOne({ email }); // OTP, delete it
};
