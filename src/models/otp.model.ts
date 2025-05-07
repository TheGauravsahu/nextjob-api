import mongoose, { Document } from "mongoose";

interface IOtp extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
}

const otpSchema = new mongoose.Schema<IOtp>({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const otpModel = mongoose.model<IOtp>("otps", otpSchema);
export default otpModel;
