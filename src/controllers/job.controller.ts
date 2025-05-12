import { Response, NextFunction } from "express";
import jobModel from "../models/job.model";
import { AuthRequest } from "../types/AuthRequest";
import ApiError from "../utils/apiError";
import userModel from "../models/user.model";

export const getAllJobs = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const jobs = await jobModel
      .find()
      .select(
        "title skills salary company employmentType workplaceType createdAt"
      )
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

    const hasApplied = job.appliedCandidates.includes(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Job fetched successfully",
      data: { job, hasApplied },
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
    });
  } catch (error) {
    next(error);
  }
};

export const applyToJob = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;
    const job = await jobModel.findById(jobId);
    if (!job) {
      throw new ApiError(404, "Job not found");
    }

    if (job.employer.toString() === userId) {
      throw new ApiError(400, "You cannot apply to your own job");
    }

    // Prevent duplicate applications
    const alreadyApplied = job.appliedCandidates.includes(userId);
    if (alreadyApplied) throw new ApiError(400, "Already applied to this job");

    job.appliedCandidates.push(userId);
    console.log("Applying to job:", job);

    await job.save();
    return res.status(200).json({
      success: true,
      message: "Applied to job successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllEmployerJobs = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const jobs = await jobModel.find({ employer: userId });

    return res.status(200).json({
      success: true,
      message: "Successfully fetched employer jobs.",
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUserAppliedJobs = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;

    const jobs = await jobModel.find({ appliedCandidates: userId });

    return res.status(200).json({
      success: true,
      message: "Successfully fetched applied jobs.",
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

//  (Employers)
export const getApplicantsForJob = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const jobId = req.params.id;
    const employerId = req.user.id;

    const job = await jobModel
      .findOne({
        _id: jobId,
        employer: employerId,
      })
      .populate("appliedCandidates", "name email role");

    if (!job) throw new ApiError(404, "Job not found or not owned by you");

    return res.status(200).json({
      success: true,
      message: "Applicants fetched successfully",
      data: job.appliedCandidates,
    });
  } catch (error) {
    next(error);
  }
};
