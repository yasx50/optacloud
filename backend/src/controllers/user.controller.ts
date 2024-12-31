import User from '../models/user.model';
import { Request, Response, NextFunction } from 'express';

const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if ([name, email, password].some((field) => field?.trim() === "")) {
      res.status(400).json({ message: "All fields are required!" });
      return;
    }

    // Check if the user already exists
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      res.status(400).json({ message: "User with this email already exists!" });
      return;
    }

    // Create a new user
    const newUser = await User.create({
      name,
      email,
      password,
    });

    const accessToken = newUser.genrateAccessToken();
    console.log(accessToken)
        const options = {
      sameSite: process.env.NODE_ENV === "production" ? "none" as const : "lax" as const,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    // Respond with success
    res.status(201)
      .cookie("accessToken", accessToken, options)
      .json({
        message: "User created successfully!",
        user: newUser,
      });
  } catch (error) {
    console.error(error);
    next(error); // Pass the error to Express's error handler
  }
};

const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  console.log('req body', req.body);

  if (!email) {
    res.status(400).json({ message: "Username or email is required!!" });
    return;
  }

  const user = await User.findOne({ email });

  // Check if the user exists
  if (!user) {
     res.status(400).json({ message: "Username or email is not found!" });
  }

  // Type guard to assert that `user` is not `null`
  if (!user) return;

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
     res.status(400).json({ message: "Wrong password" });
  }

  console.log('the user id', user._id);
  const accessToken = user.genrateAccessToken();
  console.log(accessToken)


  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    sameSite: process.env.NODE_ENV === "production" ? "none" as const : "lax" as const,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res.status(200)
    .cookie("accessToken", accessToken, options)
    .json({
      message: "User logged in successfully!",
      user: loggedInUser,
    });
};

export { registerUser, loginUser };
