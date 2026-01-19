import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import HeroImages from './pages/HeroImages'
import Reviews from './pages/Reviews'
import EditProduct from './pages/EditProduct'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = " ৳ "

const App = () => {

  const [token, setToken] = useState(
    localStorage.getItem('token') ? localStorage.getItem('token') : ''
  );

  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer/>
      {token === ""
        ? <Login setToken={setToken}/>
        : <>
          <Navbar setToken={setToken}/>
          {/* Add top padding so fixed navbar doesn't cover content */}
          <div className='pt-20 pb-20 md:pb-0'>
            <div className='flex flex-col md:flex-row w-full'>
              <Sidebar />
              <div className='w-full md:w-[70%] mx-auto md:ml-[max(5vw,25px)] my-4 md:my-8 px-3 sm:px-4 md:px-0 text-gray-600 text-base'>
                <Routes>
                  <Route path='/add' element={<Add token={token}/>} />
                  <Route path='/list' element={<List token={token}/>} />
                  <Route path='/orders' element={<Orders token={token}/>} />
                  <Route path='/hero-images' element={<HeroImages token={token}/>} />
                  <Route path='/reviews' element={<Reviews token={token}/>} />
                  <Route path='/edit/:id' element={<EditProduct token={token}/>} /> {/* Edit route */}
                </Routes>
              </div>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default App
