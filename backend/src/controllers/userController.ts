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

  console.log("User found:", user);
  console.log("Entered Password:", password);
  console.log("Hashed Password:", user?.password);
});

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password, // Make sure your model hashes it before saving
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

export { authUser, registerUser };
