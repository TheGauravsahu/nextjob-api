import mongoose from "mongoose";
import { IJob } from "../types/JobTypes";

const jobSchema = new mongoose.Schema<IJob>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    workplaceType: {
      type: String,
      enum: ["REMOTE", "HYBRID", "ONSITE"],
      required: true,
    },
    employmentType: {
      type: String,
      enum: ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE"],
      required: true,
    },
    skills: { type: [String], required: true },
    salary: {
      frequency: { type: String, enum: ["MONTHLY", "YEARLY"], required: true },
      amount: { type: Number, required: true },
    },
    company: {
      name: { type: String, required: true },
      logo: { type: String, required: true },
      location: { type: String, required: true },
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    appliedCandidates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
  },
  { timestamps: true }
);

const jobModel = mongoose.model<IJob>("jobs", jobSchema);
export default jobModel;
