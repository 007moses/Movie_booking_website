// import express from 'express';
// import { registerUser, loginUser } from '../controllers/user-controller.js';

// const AuthRouter = express.Router();

// // @route   POST /api/users
// // @desc    Register a new user
// // @access  Public
// AuthRouter.post('/register', registerUser);

// // @route   POST /api/users/login
// // @desc    Login a user
// // @access  Public
// AuthRouter.post('/login', loginUser);

// export default AuthRouter;


// routes/auth.js
import { Router } from 'express';
import { forgotPassword, loginUser,registerUser, resetPassword } from '../controllers/user-controller.js';

const authRouter = Router()

// Register
authRouter.post('/register',registerUser );

// Login
authRouter.post('/login',loginUser );

// Forgot Password
authRouter.post('/forgot-password', forgotPassword);

// Reset Password
authRouter.post('/reset-password/:token', resetPassword)

export default authRouter
