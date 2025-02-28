import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import User, { IUser } from "../models/userModel"; // Import IUser
import generateToken from "../utils/generateToken";

const authUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user
  const user: IUser | null = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id as string);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

export default authUser;
