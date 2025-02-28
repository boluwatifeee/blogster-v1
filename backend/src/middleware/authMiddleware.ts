import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler";
import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";

interface AuthRequest extends Request {
  user?: any;
}

// Protect routes
const protect = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token = req.cookies.jwt;

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId: string;
      };
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
);

// Admin middleware
const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as admin");
  }
};

export { protect, admin };
