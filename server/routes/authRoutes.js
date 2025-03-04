import express from 'express'
import { isAuthenticated, register, resetPassword, sendResetOTP, sendVerifyOtp, verifyEmail } from '../controllers/authControllers.js';
import { login, logout } from '../controllers/authControllers.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

authRouter.post('/register', register)
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-account', userAuth, verifyEmail);
authRouter.get('/is-auth', userAuth, isAuthenticated);

authRouter.post('/send-reset-otp', sendResetOTP);
authRouter.post('/reset-password', resetPassword);

export default authRouter;