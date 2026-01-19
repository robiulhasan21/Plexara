import React from 'react'
import { Routes,Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Watch from './pages/Watch'
import Men from './pages/Men'
import Women from './pages/Women'
import Kids from './pages/Kids'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailed from './pages/PaymentFailed'
import PaymentCancel from './pages/PaymentCancel'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
//import SearchBar from './components/SearchBar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductCategory from './pages/ProductCategory';


const App = () => {
  const location = useLocation();

  return (
    <div className='min-h-screen bg-gray-200 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer />
      <Navbar/>
      {/* <SearchBar/> */}
      <Routes>
        <Route path='/' element={<Home/>} />
        
        <Route path='/watch' element={<Watch/>} />
        <Route path='/men' element={<Men/>} />
        <Route path='/women' element={<Women/>} />
        <Route path='/kids' element={<Kids/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/product/:productId' element={<Product/>} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/place-order' element={<PlaceOrder/>} />
        <Route path='/orders' element={<Orders/>} />
        <Route path='/payment-success' element={<PaymentSuccess/>} />
        <Route path='/payment-failed' element={<PaymentFailed/>} />
        <Route path='/payment-cancel' element={<PaymentCancel/>} />
        <Route path="/men/:subCategory" element={<ProductCategory />} />
        <Route path="/women/:subCategory" element={<ProductCategory />} />
        <Route path="/kids/:subCategory" element={<ProductCategory />} />
        <Route path="/watch/:subCategory" element={<ProductCategory />} />
      </Routes>
      {location.pathname !== '/login' && 
       !location.pathname.startsWith('/payment-') && 
       <Footer/>}
    </div>
  )
}

export default App