import React from 'react'
import { assets } from '../assets/assets'

const Navbar = ({ setToken }) => {
  return (
    <div className='flex items-center py-4 px-[5%] justify-between bg-white border-b shadow-sm sticky top-0 z-50'>
      
      {/* Left Side: Logo and Branding */}
      <div className='flex flex-col'>
        <img 
          className='w-[120px] md:w-[160px] object-contain' 
          src={assets.logo} 
          alt="Plexara Logo" 
        />
      </div>

      {/* Right Side: Logout Button */}
      <div className='flex items-center gap-4'>
        <button 
          onClick={() => setToken('')} 
          className='bg-gradient-to-r from-[#732581] via-[#c0436f] to-[#f16c44]
            text-white px-6 py-2.5 sm:px-10 sm:py-3 rounded-full
            text-xs sm:text-sm font-bold shadow-md hover:shadow-lg active:scale-95 
            transition-all duration-300'
        >
          Logout
        </button>
      </div>

    </div>
  )
}

export default Navbar