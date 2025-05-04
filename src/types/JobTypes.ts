import mongoose from "mongoose";

export interface IJob {
  title: string;
  description: string;
  category: string;
  workplaceType: "REMOTE" | "HYBRID" | "ONSITE";
  employmentType:
    | "FULL_TIME"
    | "PART_TIME"
    | "CONTRACT"
    | "INTERNSHIP"
    | "FREELANCE";
  skills: string[];
  salary: {
    frequency: "MONTHLY" | "YEARLY";
    amount: number;
  };
  company: {
    name: string;
    logo: string;
    location: string;
  };
  employer: mongoose.Types.ObjectId;
}
