import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [NewPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  axios.defaults.withCredentials = true;
  const {backendUrl} = useContext(AppContext);
  const inputRefs = React.useRef([]);
  

  const handleInput = (e, index) => {
    if(e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index+1].focus();
    }
  }

  const handleKeyDown = (e, index) => {
    if(e.key == 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index-1].focus();
    } 
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if(inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  }

  const onSubmitEmail = async(e) => {
    e.preventDefault();
    try {
      const {data} = await axios.post(backendUrl+ "/api/auth/send-reset-otp", {email});
      data.success? toast.success(data.message) : toast.error(data.message);
      data.success && setIsEmailSent(true)
    }
    catch(err) {
      toast.error(err.message);
    }
  }

  const onSubmitOtp = async (e)=> {
    e.preventDefault();
    const otpArray = inputRefs.current.map(e => e.value);
    setOtp(otpArray.join(''));
    setIsOtpSubmitted(true)
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try{ 
      const {data} = await axios.post(backendUrl + '/api/auth/reset-password', {otp, email, NewPassword});
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate('/login')
    }
    catch(err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400 relative">
  <img
    onClick={() => navigate('/')}
    src={assets.logo}
    alt="MainLogo"
    className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
  />

  {!isEmailSent && (
    <form onSubmit={onSubmitEmail} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm flex flex-col">
      <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset Password</h1>
      <p className="text-center mb-6 text-indigo-300">Enter your registered Email address.</p>
      
      <div className="mb-4 flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#333A5C]">
        <img src={assets.mail_icon} alt="" className="w-5 h-5" />
        <input
          type="email"
          placeholder="Email ID"
          className="bg-transparent outline-none text-white flex-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white cursor-pointer rounded-full">
        Submit
      </button>
    </form>
  )}

  {!isOtpSubmitted && isEmailSent && (
    <form onSubmit={onSubmitOtp} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm flex flex-col">
      <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset Password OTP</h1>
      <p className="text-center mb-6 text-indigo-300">Enter the 6-digit code sent to your email.</p>

      <div className="flex justify-between mb-8" onPaste={handlePaste}>
        {Array(6).fill(0).map((_, index) => (
          <input
            type="text"
            maxLength="1"
            key={index}
            required
            className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md outline-none"
            ref={(e) => (inputRefs.current[index] = e)}
            onInput={(e) => handleInput(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        ))}
      </div>

      <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer">
        Submit
      </button>
    </form>
  )}

  {isOtpSubmitted && isEmailSent && (
    <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm flex flex-col">
      <h1 className="text-white text-2xl font-semibold text-center mb-4">New Password</h1>
      <p className="text-center mb-6 text-indigo-300">Enter the new password.</p>

      <div className="mb-4 flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#333A5C]">
        <img src={assets.lock_icon} alt="" className="w-5 h-5" />
        <input
          type="password"
          placeholder="Password"
          className="bg-transparent outline-none text-white flex-1"
          value={NewPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>

      <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white cursor-pointer rounded-full">
        Submit
      </button>
    </form>
  )}
</div>

  )
}

export default ResetPassword