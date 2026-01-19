import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
  return (
    /* Desktop: Left Sidebar | Mobile: Bottom Bar (Short Height) */
    <div
      className='
        w-full
        md:w-[15%]
        md:min-h-screen
        border-t md:border-t-0 md:border-r-2
        bg-white
        fixed bottom-0 md:static
        z-50
        h-[64px] md:h-auto
      '
    >
      <div
        className='
          flex flex-row
          md:flex-col
          justify-around
          md:justify-start
          gap-1 md:gap-4
          py-1 md:pt-6
          text-[10px] md:text-[15px]
        '
      >
        {/* ADD */}
        <NavLink
          to="/add"
          className={({ isActive }) =>
            `flex flex-col md:flex-row items-center
             gap-0.5 md:gap-3
             px-2 py-1 md:px-4 md:py-2
             rounded-xl transition-all
             ${
               isActive
                 ? 'bg-[#732581] text-white'
                 : 'border border-gray-100 md:border-[#732581] text-gray-600'
             }`
          }
        >
          <img
            src={assets.add_icon}
            alt="Add"
            className="w-4 h-4 md:w-5 md:h-5"
          />
          <p className="font-medium">Add</p>
        </NavLink>

        {/* LIST */}
        <NavLink
          to="/list"
          className={({ isActive }) =>
            `flex flex-col md:flex-row items-center
             gap-0.5 md:gap-3
             px-2 py-1 md:px-4 md:py-2
             rounded-xl transition-all
             ${
               isActive
                 ? 'bg-[#732581] text-white'
                 : 'border border-gray-100 md:border-[#732581] text-gray-600'
             }`
          }
        >
          <img
            src={assets.order_icon}
            alt="List"
            className="w-4 h-4 md:w-5 md:h-5"
          />
          <p className="font-medium">List</p>
        </NavLink>

        {/* ORDERS */}
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `flex flex-col md:flex-row items-center
             gap-0.5 md:gap-3
             px-2 py-1 md:px-4 md:py-2
             rounded-xl transition-all
             ${
               isActive
                 ? 'bg-[#732581] text-white'
                 : 'border border-gray-100 md:border-[#732581] text-gray-600'
             }`
          }
        >
          <img
            src={assets.order_icon}
            alt="Orders"
            className="w-4 h-4 md:w-5 md:h-5"
          />
          <p className="font-medium">Orders</p>
        </NavLink>

        {/* HERO */}
        <NavLink
          to="/hero-images"
          className={({ isActive }) =>
            `flex flex-col md:flex-row items-center
             gap-0.5 md:gap-3
             px-2 py-1 md:px-4 md:py-2
             rounded-xl transition-all
             ${
               isActive
                 ? 'bg-[#732581] text-white'
                 : 'border border-gray-100 md:border-[#732581] text-gray-600'
             }`
          }
        >
          <img
            src={assets.add_icon}
            alt="Hero"
            className="w-4 h-4 md:w-5 md:h-5"
          />
          <p className="font-medium">Hero</p>
        </NavLink>

        {/* REVIEWS */}
        <NavLink
          to="/reviews"
          className={({ isActive }) =>
            `flex flex-col md:flex-row items-center
             gap-0.5 md:gap-3
             px-2 py-1 md:px-4 md:py-2
             rounded-xl transition-all
             ${
               isActive
                 ? 'bg-[#732581] text-white'
                 : 'border border-gray-100 md:border-[#732581] text-gray-600'
             }`
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 md:w-5 md:h-5"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <p className="font-medium">Reviews</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
