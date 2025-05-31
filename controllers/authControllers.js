import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";

export const signupUser = async (req, res) => {
  try {
    const { fullName, userName, email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const existingUser = await User.findOne({ userName });
    if (existingUser) return res.status(401).json({ message: "userName is already taken" });
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(401).json({ message: "email already exists" });
    if (password.length < 6) {
      return res.status(501).json({ error: "The password must be atleast 6 characters long" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      userName,
      email,
      password: hashedPassword
    })
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        message: "Signup successful"
      })
    } else {
      res.status(400).json({ error: "Invalid user Data" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server Error" });
  }
}
export const loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }
    generateTokenAndSetCookie(user._id, res);
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      userName: user.userName,
      message: "Login successful"
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal sever error" })
  }
}

export const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 })
    res.status(200).json({ message: "logged out successfully" })
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal server error" })
  }
}

export const getUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(200).json(null);
    }
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      userName: user.userName,
      email: user.email
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}