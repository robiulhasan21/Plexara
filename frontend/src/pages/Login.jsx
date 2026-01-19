import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Mail, Lock, ArrowRight, User } from 'lucide-react'; 

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { setToken, navigate, backendUrl } = useContext(ShopContext);

  // Form States
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Social Login Handler (Placeholder)
  const handleSocialLogin = (platform) => {
    toast.info(`${platform} login feature requires Backend & Firebase setup. Setting it up now...`);
    // এখানে আপনার Firebase বা Google Auth লজিক আসবে
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success("Registration Successful!");
          navigate('/');
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + '/api/user/login', { email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success("Login Successful!");
          navigate('/');
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf2f2] p-4 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Image Section (Image from your screenshot style) */}
        <div className="md:w-1/2 bg-[#f3f4f6] flex items-center justify-center p-8 relative">
          <img 
            src="https://www.citychain.com.sg/cdn/shop/files/Seiko-5-Sports_M_c3b52d06-b730-4dbc-8429-23a381433201.webp?v=1761580454&width=4000" 
            alt="Product" 
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 hover:scale-105"
          />
          {/* Decorative Elements to match the aesthetic */}
          <div className="absolute bottom-10 left-10 w-20 h-20 bg-white/40 rounded-full blur-2xl"></div>
        </div>

        {/* Right Side: Form Section */}
        <div className="md:w-1/2 p-8 md:p-14 flex flex-col justify-center">
          <div className="mb-8">
            {/* Custom Logo Icon */}
            <div className="flex gap-1 mb-6">
              <div className="w-6 h-6 bg-black rounded-full shadow-lg"></div>
              <div className="w-6 h-6 border-2 border-black rounded-full -ml-3 bg-white"></div>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
              {currentState === 'Login' ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Please enter your details to {currentState === 'Login' ? 'access your account' : 'join our community'}.
            </p>
          </div>

          <form onSubmit={onSubmitHandler} className="space-y-5">
            {currentState === 'Sign Up' && (
              <div className="relative group">
                <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5 group-focus-within:text-black transition-colors" />
                <input 
                  onChange={(e) => setName(e.target.value)} 
                  value={name}
                  type="text" 
                  placeholder="Full Name" 
                  className="w-full border border-gray-200 rounded-xl py-3.5 px-11 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                  required
                />
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5 group-focus-within:text-black transition-colors" />
              <input 
                onChange={(e) => setEmail(e.target.value)} 
                value={email}
                type="email" 
                placeholder="Email Address" 
                className="w-full border border-gray-200 rounded-xl py-3.5 px-11 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5 group-focus-within:text-black transition-colors" />
              <input 
                onChange={(e) => setPassword(e.target.value)} 
                value={password}
                type="password" 
                placeholder="Password" 
                className="w-full border border-gray-200 rounded-xl py-3.5 px-11 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#732581] via-[#f16c44] to-[#faad3a]
               text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 
               hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg shadow-black/10 disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : (currentState === 'Login' ? 'Get Started' : 'Sign Up')}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              {currentState === 'Login' ? "Don't have an account?" : "Already have an account?"} 
              <span 
                onClick={() => {
                   setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login');
                   setName(''); setEmail(''); setPassword('');
                }}
                className="text-[#f16c44] font-bold cursor-pointer ml-1 hover:underline underline-offset-4 transition-all"
              >
                {currentState === 'Login' ? 'Sign Up' : 'Log In'}
              </span>
            </p>
          </div>
          </div>
        </div>
      </div>
  );
};

export default Login;