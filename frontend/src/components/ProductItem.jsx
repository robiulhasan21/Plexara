import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

const ProductItem = ({ id, image, name, price, quantity }) => {
  const { currency, products } = useContext(ShopContext);

  const product = products.find(p => p._id === id) || {}
  const origPrice = Number(product.price || price || 0)
  const discountPrice = Number(product.discountPrice ?? product.discountprice ?? 0)
  const percentOff = origPrice > 0 && discountPrice > 0 && origPrice > discountPrice ? Math.round(((origPrice - discountPrice) / origPrice) * 100) : 0

  // Ginagawang number para makasiguro sa comparison
  const stock = Number(quantity); 

  return (
    <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
      <div className='relative overflow-hidden rounded-lg'>
        {/* Discount badge (top-right) */}
        {percentOff > 0 && (
          <div className='absolute top-2 right-2 z-20'>
            <p className='bg-gradient-to-r from-[#732581] via-[#f16c44] to-[#faad3a]
             text-white text-[10px] sm:text-[12px] px-2 py-0.5 font-bold rounded shadow-md'>
              {percentOff}%
            </p>
          </div>
        )}
        
        {/* ✅ SOLD OUT BADGE */}
        {stock === 0 && (
          <div className='absolute top-2 left-2 z-20'>
            <p className=' text-blue-900 text-[10px] sm:text-[12px] px-2 py-0.5 font-bold rounded shadow-md'>
              SOLD OUT
            </p>
          </div>
        )}

        <div className='overflow-hidden bg-gray-100'>
          <img 
            className={`w-full h-auto hover:scale-110 transition ease-in-out duration-300 ${stock === 0 ? 'opacity-60 grayscale-[0.5]' : ''}`} 
            src={(Array.isArray(image) && image[0]) || (Array.isArray(product.image) && product.image[0]) || ''} 
            alt={name || product.name || ''} 
          />
        </div>
      </div>
      <p className='pt-3 pb-1 text-sm'>{name}</p>
      <p className='text-sm font-medium'>
        {discountPrice && Number(discountPrice) > 0 && discountPrice < origPrice ? (
          <span className='flex items-baseline gap-2'>
            <span className='text-sm font-bold text-black'>{currency}{discountPrice}</span>
            <span className='text-xs line-through text-gray-500'>{currency}{origPrice}</span>
          </span>
        ) : (
          <span>{currency}{origPrice}</span>
        )}
      </p>
    </Link>
  )
}

export default ProductItem;