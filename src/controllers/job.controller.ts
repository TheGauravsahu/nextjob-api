import { Response, NextFunction } from "express";
import jobModel from "../models/job.model";
import { AuthRequest } from "../types/AuthRequest";
import ApiError from "../utils/apiError";

export const getAllJobs = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const jobs = await jobModel
      .find()
      .populate("employer", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const job = await jobModel
      .findById(id)
      .populate("employer", "name email role");

    if (!job) {
      throw new ApiError(404, "Job not found");
    }

    return res.status(200).json({
      success: true,
      message: "Job fetched successfully",
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

export const createJob = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      description,
      skills,
      category,
      employmentType,
      workplaceType,
      salary: { amount, frequency },
      company: { name, logo, location },
    } = req.body;

    const userId = req.user.id;

    const job = await jobModel.create({
      title,
      description,
      skills,
      category,
      employmentType,
      workplaceType,
      salary: { amount, frequency },
      company: { name, logo, location },
      employer: userId,
    });

    console.log("Creating job:", job);

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

export const updateJobById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.user.id;

    const job = await jobModel.findOneAndUpdate(
      { _id: id, employer: userId },
      updateData,
      { new: true }
    );

    console.log("Updating job:", job);

    if (!job) {
      throw new ApiError(
        404,
        "Job not found or you're not authorized to update it"
      );
    }

    return res.status(201).json({
      success: true,
      message: "Job updated successfully",
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJobById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const job = await jobModel.findOne({ _id: id, employer: userId });
    if (!job) {
      throw new ApiError(
        404,
        "Job not found or you're not authorized to delete it"
      );
    }

    await jobModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
      data: job,
    });
  } catch (error) {
    next(error);
  }
};
