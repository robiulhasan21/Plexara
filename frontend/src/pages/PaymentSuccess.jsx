import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'

const PaymentSuccess = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to orders page after 5 seconds
    const timer = setTimeout(() => {
      navigate('/orders')
    }, 5000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center'>
        <div className='flex justify-center mb-6'>
          <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center'>
            <CheckCircle className='w-12 h-12 text-green-600' />
          </div>
        </div>
        
        <h1 className='text-3xl font-bold text-gray-800 mb-3'>Payment Successful!</h1>
        <p className='text-gray-600 mb-6'>
          Your payment has been processed successfully. Your order will be delivered soon.
        </p>
        
        <div className='flex flex-col sm:flex-row gap-3'>
          <button
            onClick={() => navigate('/orders')}
            className='flex-1 bg-gradient-to-r from-[#732581] via-[#f16c44] to-[#faad3a] text-white py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition-opacity'
          >
            View Orders
          </button>
          <button
            onClick={() => navigate('/')}
            className='flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:border-gray-400 transition-colors'
          >
            Continue Shopping
          </button>
        </div>
        
        <p className='text-xs text-gray-400 mt-6'>
          Redirecting to orders page in 5 seconds...
        </p>
      </div>
    </div>
  )
}

export default PaymentSuccess
