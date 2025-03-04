import React, { useContext } from 'react'
import { useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios';
import "../index.css"

const Login = () => {
  const navigate = useNavigate();

   const {backendUrl,isLoggedin, setIsLoggedin, getUserData, loading} = useContext(AppContext)

  const [state, setState] = useState('Sign Up')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setIsSubmitting(true); 
       axios.defaults.withCredentials = true;
       if(state === 'Sign Up') {
        const {data} = await axios.post(backendUrl + '/api/auth/register', {name, email, password})
       
       if(data.success) {
        setIsLoggedin(true)
        getUserData();
        navigate('/')
        }
       else {
        toast.error(data.message)
        }
      }
      else {
        const {data} = await axios.post(backendUrl + '/api/auth/login', {email, password})
       
       if(data.success) {
        setIsLoggedin(true)
        getUserData();
        navigate('/')
       }
       else {
        toast.error(data.message)
       } 
      }
    }
    catch(err) {
      toast.error(err.message)
      setIsSubmitting(false); 
    }
  }
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className='flex justify-center items-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
       <img onClick={() => {navigate('/')}} src={assets.logo} alt="Main Logo" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
       <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign Up'? 'Create Account': 'Login '}</h2>
        <p className='text-center text-sm mb-6'>{state === 'Sign Up'? 'Create your account': 'Login to your account!'}</p>

        <form onSubmit={onSubmitHandler}>
          {state === 'Sign Up' && ( <div className='flex mb-4 items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.person_icon} />
            <input onChange={e => setName(e.target.value)} value = {name} type="text" placeholder='Full Name'required  className='bg-transparent outline-none'/>
            </div>
            )}
      
          <div className='flex mb-4 items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} />
            <input  onChange={e => setEmail(e.target.value)} value = {email} type="email" placeholder='Email id'required  className='bg-transparent outline-none'/>
          </div>
          <div className='flex mb-4 items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} />
            <input  onChange={e => setPassword(e.target.value)} value = {password} type="password" placeholder='Password'required  className='bg-transparent outline-none'/>
          </div>

          <p onClick={()=> {navigate('/reset-password')}} className='mb-4 text-indigo-500 cursor-pointer'>Forgot Password?</p>

          <button className='rounded-full py-2.5 w-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer'>{isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              Loading...
            </div>
          ) : (
            state
          )}</button>
        </form>

            {state === 'Sign Up'? ( <p className='text-gray-400 text-center text-xs mt-4'>Already have an account? {' '}
          <span onClick={() => {setState('Login')}}  className='text-blue-400 cursor-pointer underline'>Login Here</span>
        </p>): (<p className='text-gray-400 text-center text-xs mt-4'>Dont' have an account? {' '}
          <span  onClick={() => {setState('Sign Up')}}   className='text-blue-400 cursor-pointer underline'>Sign Up</span>
        </p>)}
       

        
       </div>
    </div>
  )
}

export default Login