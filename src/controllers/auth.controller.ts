import { NextFunction, Request, Response } from "express";
import userModel from "../models/user.model";
import { generateToken } from "../utils/jwt";
import { AuthRequest } from "../types/AuthRequest";
import ApiError from "../utils/apiError";
import { createAndSendOtp, verifyOtp } from "../utils/otp";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      throw new ApiError(400, "All fields are required.");
    }

    const userExists = await userModel.findOne({ email });
    if (userExists) {
      throw new ApiError(400, "User already exists.");
    }

    const user = await userModel.create({ name, email, password, role });
    console.log("Cretaing user:", user);

    await createAndSendOtp(email);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmailOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body;
    await verifyOtp(email, otp);
    await userModel.findOneAndUpdate({ email }, { isVerified: true });
    return res
      .status(200)
      .json({ success: true, message: "OTP verified successfully." });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(400, "All fields are required.");
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      throw new ApiError(400, "Invalid credentials.");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(400, "Invalid credentials.");
    }

    const token = generateToken(user._id as string);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel.findById(req.user._id).select("-password");
    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    return res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, role } = req.body;
    const user = await userModel
      .findByIdAndUpdate(req.user._id, { name, email, role }, { new: true })
      .select("-password");
    console.log("Updating user:", user);
    if (!user) {
      throw new ApiError(404, "User not found.");
    }
    return res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

export const deleteUserProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel.findById(req.user._id).select("-password");
    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    await user.deleteOne({ _id: req.user._id });
    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userModel.find().select("-password");
    return res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel.findById(req.params.id).select("-password");
    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const updateUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await userModel.findById(req.params.id).select("-password");
    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;
    if (role) user.role = role;

    await user.save();

    return res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const deleteUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel.findById(req.params.id).select("-password");
    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    await user.deleteOne({ _id: req.params.id });

    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    next(error);
  }
};

export const getUserRole = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel.findById(req.user._id).select("role");
    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    return res.status(200).json({ success: true, role: user.role });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role } = req.body;
    const user = await userModel.findById(req.user._id).select("role");
    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    user.role = role;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "User role updated successfully." });
  } catch (error) {
    next(error);
  }
};
