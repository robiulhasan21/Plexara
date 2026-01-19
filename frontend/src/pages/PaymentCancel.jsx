import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'

const PaymentCancel = () => {
  const navigate = useNavigate()

  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center'>
        <div className='flex justify-center mb-6'>
          <div className='w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center'>
            <AlertCircle className='w-12 h-12 text-yellow-600' />
          </div>
        </div>
        
        <h1 className='text-3xl font-bold text-gray-800 mb-3'>Payment Cancelled</h1>
        <p className='text-gray-600 mb-6'>
          You have cancelled the payment process. Your order has not been placed. You can try again when you're ready.
        </p>
        
        <div className='flex flex-col sm:flex-row gap-3'>
          <button
            onClick={() => navigate('/place-order')}
            className='flex-1 bg-gradient-to-r from-[#732581] via-[#f16c44] to-[#faad3a] text-white py-3 px-6 
            rounded-xl font-semibold hover:opacity-90 transition-opacity'
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/cart')}
            className='flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:border-gray-400 transition-colors'
          >
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentCancel
