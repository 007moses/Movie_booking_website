// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcrypt'
// import User from '../models/User.js';

// // @desc    Register a new user
// // @route   POST /api/users
// // @access  Public
// const registerUser = async (req, res) => {
//   const { username, email, password, fullName, phone } = req.body;

//   if (!username || !email || !password) {
//     res.status(400);
//     throw new Error('Please provide username, email, and password');
//   }

//   // Check if user exists
//   const userExists = await User.findOne({ $or: [{ email }, { username }] });
//   if (userExists) {
//     res.status(400);
//     throw new Error('User already exists');
//   }

//   // Hash password
//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(password, salt);

//   // Create user
//   const user = await User.create({
//     username,
//     email,
//     password: hashedPassword,
//     fullName,
//     phone,
//   });

//   if (user) {
//     res.status(201).json({
//       _id: user._id,
//       username: user.username,
//       email: user.email,
//       token: generateToken(user._id),
//     });
//   } else {
//     res.status(400);
//     throw new Error('Invalid user data');
//   }
// };

// // @desc    Login a user
// // @route   POST /api/users/login
// // @access  Public
// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     res.status(400);
//     throw new Error('Please provide email and password');
//   }

//   // Find user
//   const user = await User.findOne({ email });

//   // Check password
//   if (user && (await bcrypt.compare(password, user.password))) {
//     res.status(200).json({
//       _id: user._id,
//       username: user.username,
//       email: user.email,
//       token: generateToken(user._id),
//     });
//   } else {
//     res.status(401);
//     throw new Error('Invalid email or password');
//   }
// };

// // Generate JWT
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: '30d',
//   });
// };

// export { registerUser, loginUser };


import User from "../models/User.js";
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';
import generateToken from '../../utility/generateToken.js'
dotenv.config();


// Email configuration
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER || "moses05112000@gmail.com",
    pass: process.env.EMAIL_PASS || "your-app-password", // Replace with your App Password
  },
});

export const registerUser = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required', register: false });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match', register: false });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists', register: false });
    }

    const user = await User.create({ email, password, fullName: email.split('@')[0] });
    user.password = undefined;

    res.status(201).json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id),
      message: "User registered successfully",
      register: true
    });
  } catch (error) {
    console.error('Error in registerUser:', error); 
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required', login: false });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials', login: false });
    }

    res.json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id),
      message: "User logged in successfully",
      login: true
    });
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request',
      text: `You are receiving this email because you (or someone else) requested a password reset.
             Please click on the following link to reset your password:
             ${resetUrl}
             If you did not request this, please ignore this email.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset email sent',forgotPassword:true });
  } catch (error) {
    console.error('Error in forgotPassword:', error,);
    res.status(500).json({ message: error.message, forgotPassword:false });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ message: error.message });
  }
};