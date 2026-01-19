import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const OurPolicy = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
  const [form, setForm] = useState({ name: '', email: '', rating: 0, review: '' })
  const [hoveredRating, setHoveredRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleRatingClick = (rating) => {
    setForm(prev => ({ ...prev, rating }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!form.name || !form.email || !form.rating || !form.review) {
      toast.error('Please fill all fields')
      return
    }

    setSubmitting(true)
    try {
      const res = await axios.post(`${backendUrl}/api/review`, form, { timeout: 15000 })
      if (res.data.success) {
        toast.success('Thank you for your review!')
        setForm({ name: '', email: '', rating: 0, review: '' })
        setHoveredRating(0)
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Unable to submit review'
      toast.error(String(msg))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='py-20'>
      <div className='flex flex-col justify-around gap-12 text-xs text-center text-gray-700 
      sm:flex-row sm:gap-2 sm:text-sm md:text-base'>
          
          <div>
              <img src={assets.exchange_icon} className='w-12 m-auto mb-5' alt="" />
              <p className='font-semibold'>Easy Exchange</p>
              <p className='text-gray-400'>We offer hassle free exchange policy</p>
          </div>
          <div>
              <img src={assets.quality_icon} className='w-12 m-auto mb-5' alt="" />
              <p className='font-semibold'>Days Return Policy</p>
              <p className='text-gray-400'>We provide 7 days free return policy</p>
          </div>
          <div>
              <img src={assets.support_img} className='w-12 m-auto mb-5' alt="" />
              <p className='font-semibold'>Best Customer Support</p>
              <p className='text-gray-400'>We provide 24/7 customer support</p>
          </div>

      </div>

      {/* Review Form Section */}
      <div className='max-w-3xl mx-auto mt-20 border-t pt-12'>
        <h3 className='text-2xl font-semibold mb-6 text-center text-gray-800'>Share Your Experience</h3>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 px-4'>
          <div className='flex flex-col sm:flex-row gap-4'>
            <input 
              name='name' 
              value={form.name} 
              onChange={handleChange} 
              placeholder='Your name' 
              className='flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#732581]' 
              required
            />
            <input 
              name='email' 
              type='email'
              value={form.email} 
              onChange={handleChange} 
              placeholder='Your email' 
              className='flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#732581]' 
              required
            />
          </div>
          
          {/* Rating Stars */}
          <div className='flex flex-col items-center gap-2'>
            <label className='text-sm font-medium text-gray-700'>Rate your experience</label>
            <div className='flex gap-2'>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type='button'
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className={`text-3xl transition-all ${
                    star <= (hoveredRating || form.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  } hover:scale-110`}
                >
                  ★
                </button>
              ))}
            </div>
            {form.rating > 0 && (
              <p className='text-xs text-gray-500'>{form.rating} out of 5 stars</p>
            )}
          </div>

          <textarea 
            name='review' 
            value={form.review} 
            onChange={handleChange} 
            placeholder='Write your review here...' 
            className='p-3 border border-gray-300 rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-[#732581] resize-none' 
            required
          />
          
          <button 
            type='submit' 
            disabled={submitting}
            className='px-6 py-3 bg-gradient-to-r from-[#732581] via-[#f16c44] to-[#faad3a]
             text-white rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default OurPolicy