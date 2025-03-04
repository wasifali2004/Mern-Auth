import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../config/emailTemplate.js";

export const register = async (req,res) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password) {
        return res.json({success: false, message: 'Missing Details'})
    }
    try {
        const existingUser = await userModel.findOne({email})
        if(existingUser) {
            return res.json({success: false, message: 'User already exist'})
        }
        const hashedPassword = await bcrypt.hash(password,10); 
        
        const user = new userModel({name, email, password:hashedPassword});
        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV == 'production'? 'none' : 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });

        //sending welcome email
        const  mailOption = {
            from:  "wasifali5245826@gmail.com",
            to: email,
            subject: 'Welcome to Mern Stack Project',
            text: `Welcome to Mern Stack Website. Your account has been created with email id: ${email}`
        }

        await transporter.sendMail(mailOption);

        return res.json({success: true})

    }catch(err) {
        res.json({success: false, message: err.message})
    }

}


export const login = async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.json({success: false, message: 'Email and password are required!'})
    }
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message: 'Invalid Email!'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.json({success: false, message:'Invalid Password!'})
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV == 'production'? 'none' : 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });

        return res.json({success: true})
    }
    catch(err) {
        return res.json({success: false, message: err.message})
    }
}


export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {httpOnly: true,secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV == 'production'? 'none' : 'strict'})

        return res.json({success: true, message: 'Logged Out'})
    }
    catch(err) {
        return res.json({success: true, message: err.message})
    }
}
 
//send verification OTP
export const sendVerifyOtp = async (req, res) => {
    try {
        const {userId} = req.body; 
        const user = await userModel.findById(userId);

        if(user.isAccountVerified) {
            return res.json({success:false, message: "Account already verified"})
        }
        const otp = String(Math.floor(100000+Math.random()* 900000));

       user.verifyOTP = otp;
       user.verifyOTPExpireAt = Date.now() + 24 * 60 *60 *1000;

       await user.save();

       const mailOption = {
            from:  "wasifali5245826@gmail.com",
            to: user.email,
            subject: 'Account Verification OTP',
            // text: `Your OTP is ${otp}. Verify your account using this OTP.`, 
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}",user.email)
       }

       await transporter.sendMail(mailOption);

       return res.json({success:true, message: "Verification OTP sent on Email"})

    }
    catch(err) {
        res.json({success:false, message: err.message});
    }
}

export const verifyEmail = async (req, res) => {
    const {userId, otp} = req.body;
    if(!userId || !otp) {
        return res.json({success:false, message: "Missing Details"})
    }
    try {
        const user = await userModel.findById(userId);
        if(!user) {
            return res.json({success:false, message:"User not Found"})
        }

        if(user.verifyOTP === '' || user.verifyOTP !== otp) {
            return res.json({success: false, message: "Invalid OTP"})
        }

        if(user.verifyOTPExpireAt < Date.now()) {
            return res.json({success:false, message:"OTP Expired"})   
        }
        user.isAccountVerified = true;
        user.verifyOTP = '';
        user.verifyOTPExpireAt = 0;
        await user.save();
        return res.json({success:true, message:"Email Verified Successfully"})
    }
    catch(err) {
        return res.json({success:false, message:"Missing Details"})
    }
}

export const isAuthenticated = async(req, res) => {
    try {
        return res.json({success:true})
    }
    catch(err) {
        return res.json({success: false, message: err.message})
    }
}

//Send Password Reset OTP
export const sendResetOTP = async (req, res) => {
    const {email} = req.body;
    if(!email) {
        return res.json({success:false, message: "Enter a valid Email"});
    }
    try {
        const user = await userModel.findOne({email});
        if(!user) {
            return res.json({success: false, message: "User Not Found"});
        }

        const otp = String(Math.floor(100000+Math.random()*900000));
        user.resetOTP = otp;
        user.resetOTPExpireAt = Date.now() + 15 * 60 *  1000;

        await user.save();

        const mailOption = {
            from: "wasifali5245826@gmail.com",
            to: user.email,
            // subject: "Password Resey OTP",
            // text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password.`,
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        }

        await transporter.sendMail(mailOption)

        return res.json({success: true, message: "OTP sent to your email"})
    }
    catch(err) {
        return res.json({success:false, message: err.message});
    }
}

//Reset User Password
export const resetPassword = async (req, res) => {
    const {otp, email, password} = req.body;
    if(!otp || !email || !password) {
        return res.json({success:false, message:"Enter valid OTP, Email, Password"})
    }
    try{
        const user = await userModel.findOne({email});
        if(!user) {
            return res.json({success:false ,message: "User not Found!"})
        }

        if(user.resetOTP == '' || user.resetOTP != otp) {
            return res.json({success:false, message: "Invalid OTP"})
        }

        if(user.resetOTPExpireAt < Date.now()) {
            return res.json({success:false, message: "OTP Expired!"})
        }
        const hashedPass = await bcrypt.hash(password, 10);

        user.password = hashedPass;
        user.resetOTP = '';
        user.resetOTPExpireAt = 0;

        await user.save();
        return res.json({success:true, message: "Password successfully changed!"})
    }
    catch(err) {
        return res.json({success:false, message: err.message})
    }
}