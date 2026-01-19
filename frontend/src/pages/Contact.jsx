import React, { useState } from 'react'
import axios from 'axios'
import Title from '../components/Title'
import { assets } from '../assets/assets'

const Contact = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState(null)

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: 'loading', text: 'Sending report...' })
    try {
      const res = await axios.post(`${backendUrl}/api/contact`, form, { timeout: 15000 })
      setStatus({ type: 'success', text: res?.data?.message || 'Report submitted' })
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || 'Unable to send report'
      setStatus({ type: 'error', text: String(msg) })
    }
  }
  return (
    <div>

      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img}alt="contact" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Our Store</p>
          <p className='text-gray-500'>Matlab Uttar, Chandpur</p>
          <p className='text-gray-500'>
            Phone: <br/>
            +880 1604-643731 <br/>
            Email: <br/>
            plexara1@gmail.com 
          </p>
          <p className='font-semibold text-xl text-gray-600'>Careers at PleXara </p>
          <p className='text-gray-500'>Learn more about our teams and job openings.</p>
          <button className='border border-[#732581] px-8 py-4 text-sm hover:bg-gradient-to-r from-[#732581] via-[#f16c44] to-[#faad3a]
           hover:text-white transition duration-500'>Explore Jobs</button>
        </div>
        {/* Report form for users to contact admin */}
      </div>

      
      
    </div>
  )
}

export default Contact