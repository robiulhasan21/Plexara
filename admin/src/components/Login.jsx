import axios from 'axios'
import React, { useState } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Login = ({ setToken }) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            const response = await axios.post(backendUrl + '/api/user/admin', { email, password })
            if (response.data.success) {
                setToken(response.data.token)
                toast.success("Welcome back!")
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center w-full bg-[#f8f9fa] p-4'>
            {/* Main Container */}
            <div className='flex flex-col md:flex-row bg-white shadow-2xl rounded-3xl overflow-hidden max-w-4xl w-full'>
                
                {/* Left Side: Image Section (Now visible on mobile as top section) */}
                <div className='flex md:w-1/2 bg-gradient-to-br from-[#732581] to-[#E55225] items-center justify-center p-8 md:p-12'>
                    <div className='text-center'>
                        <img 
                            src="https://www.citychain.com.sg/cdn/shop/files/Seiko-5-Sports_M_c3b52d06-b730-4dbc-8429-23a381433201.webp?v=1761580454&width=4000" 
                            alt="Admin Watch" 
                            className='w-42 h-42 md:w-full md:h-auto mx-auto object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500'
                        />
                        <h2 className='text-white text-xl md:text-2xl font-bold mt-4 md:mt-8'>Manage Your Store</h2>
                        <p className='text-white/80 mt-2 text-xs md:text-sm'>Every second counts. Track your progress with precision.</p>
                    </div>
                </div>

                {/* Right Side: Form Section */}
                <div className='w-full md:w-1/2 px-8 py-10 md:py-12 md:px-12'>
                    <div className='mb-8 md:mb-10'>
                        <h1 className='text-2xl md:text-3xl font-extrabold text-gray-800'>Admin Login</h1>
                        <p className='text-gray-500 mt-2 text-sm'>Welcome back! Please login to your account.</p>
                    </div>

                    <form onSubmit={onSubmitHandler} className='space-y-4 md:space-y-5'>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-1.5'>Email Address</label>
                            <input 
                                onChange={(e) => setEmail(e.target.value)} 
                                value={email} 
                                className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#732581] focus:border-transparent outline-none transition-all bg-gray-50'
                                type="email" 
                                placeholder='admin@example.com' 
                                required 
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-1.5'>Password</label>
                            <input 
                                onChange={(e) => setPassword(e.target.value)} 
                                value={password} 
                                className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#732581] focus:border-transparent outline-none transition-all bg-gray-50'
                                type="password" 
                                placeholder='••••••••' 
                                required 
                            />
                        </div>

                        <div className='flex items-center justify-between text-xs text-gray-500 pb-2'>
                            <label className='flex items-center cursor-pointer'>
                                <input type="checkbox" className='mr-1' /> Remember me
                            </label>
                            <span className='hover:text-[#732581] cursor-pointer'>Forgot Password?</span>
                        </div>

                        <button 
                            className='w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 bg-gradient-to-r from-[#732581] to-[#E55225]'
                            type="submit"
                        >
                            Sign In
                        </button>
                    </form>

                    <p className='text-center text-gray-400 text-[10px] md:text-xs mt-8 md:mt-10'>
                        &copy; 2026 PleXara Admin Dashboard. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login