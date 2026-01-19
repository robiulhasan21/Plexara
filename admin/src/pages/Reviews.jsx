import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { Star, User, Mail, Calendar } from 'lucide-react'

const Reviews = ({ token }) => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchReviews = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/review', {
        headers: { token }
      })
      if (response.data.success) {
        setReviews(response.data.reviews)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch reviews")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const renderStars = (rating) => {
    return (
      <div className='flex gap-1'>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="p-2 md:p-6 bg-gray-50 min-h-screen">
      <p className='mb-6 text-2xl font-bold text-gray-800 flex items-center gap-2'>
        <Star className="w-6 h-6" /> Customer Reviews
      </p>
      
      {reviews.length === 0 ? (
        <div className='text-center py-20 bg-white rounded-xl shadow-sm'>
          <p className="text-gray-400">No reviews found</p>
        </div>
      ) : (
        <div className='flex flex-col gap-6'>
          {reviews.map((review) => (
            <div key={review._id} className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
              
              {/* Review Header */}
              <div className='bg-gray-50 p-4 border-b flex flex-wrap justify-between items-center gap-3'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-gradient-to-r from-[#732581] via-[#f16c44] to-[#faad3a] flex items-center justify-center text-white font-bold'>
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className='text-sm font-bold text-gray-900'>
                      {review.name}
                    </p>
                    <div className='flex items-center gap-2 mt-1'>
                      {renderStars(review.rating)}
                      <span className='text-xs text-gray-500'>({review.rating}/5)</span>
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-2 text-xs text-gray-500'>
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(review.createdAt).toLocaleDateString()} at {new Date(review.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>

              {/* Review Content */}
              <div className='p-4 md:p-6'>
                <div className='mb-4'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className='text-sm text-gray-600'>{review.email}</p>
                  </div>
                </div>
                <div className='bg-gray-50 p-4 rounded-xl'>
                  <p className='text-sm text-gray-700 leading-relaxed'>{review.review}</p>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Reviews

