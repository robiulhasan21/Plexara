import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const List = ({ token }) => {
  const [list, setList] = useState([])
  const navigate = useNavigate()

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    if (window.confirm("Are you sure you want to remove this product?")) {
      try {
        const response = await axios.post(
          backendUrl + '/api/product/remove',
          { id },
          { headers: { token } }
        )

        if (response.data.success) {
          toast.success(response.data.message)
          await fetchList()
        } else {
          toast.error(response.data.message)
        }
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  const editProduct = (id) => {
    navigate(`/edit/${id}`)
  }

  return (
    <div className='p-2 md:p-5'>
      <p className='mb-4 text-xl font-semibold text-gray-700'>All Products List</p>
      
      <div className='flex flex-col gap-3'>

        {/* --- Table Header (Only for Desktop) --- */}
        <div className='hidden md:grid grid-cols-[1fr_2.5fr_1fr_1.5fr_1fr_1fr_1fr_1fr] items-center py-2 px-4 border bg-gray-100 text-sm font-bold text-gray-600 rounded-t-lg'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Sub Type</b>
          <b>Price</b>
          <b>Discount</b>
          <b>Stock</b>
          <b className='text-center'>Action</b>
        </div>

        {/* --- Product List --- */}
        {list.map((item, index) => (
          <div
            key={index}
            className='flex flex-col md:grid md:grid-cols-[1fr_2.5fr_1fr_1.5fr_1fr_1fr_1fr_1fr] items-center gap-3 md:gap-2 py-3 px-4 border rounded-lg md:rounded-none bg-white hover:shadow-md transition-all'
          >
            {/* Image & Main Info for Mobile */}
            <div className='flex items-center w-full md:w-auto gap-4'>
              <img
                className='w-16 h-16 md:w-12 md:h-12 object-cover rounded shadow-sm'
                src={item.images && item.images[0] ? item.images[0] : ''}
                alt={item.name}
              />
              <div className='md:hidden flex flex-col'>
                <p className='text-base font-bold text-gray-800 leading-tight'>{item.name}</p>
                <p className='text-xs text-gray-500'>{item.category} • {item.subType || 'N/A'}</p>
                <p className='text-sm font-semibold text-blue-600 mt-1'>{currency}{item.price}</p>
              </div>
            </div>

            {/* Hidden Name/Cat on Mobile, Visible on Desktop */}
            <p className='hidden md:block font-medium'>{item.name}</p>
            <p className='hidden md:block'>{item.category}</p>
            <p className='hidden md:block text-gray-500 italic'>{item.subType || '-'}</p>
            
            {/* Pricing Info for Mobile Layout */}
            <div className='flex justify-between w-full md:hidden border-t pt-2 text-xs text-gray-600'>
              <p>Stock: <span className='font-bold'>{item.quantity}</span></p>
              <p>Discount: <span className='font-bold text-red-500'>{item.discountPrice ? `${currency}${item.discountPrice}` : 'None'}</span></p>
            </div>

            {/* Desktop only columns */}
            <p className='hidden md:block'>{currency}{item.price}</p>
            <p className='hidden md:block'>{item.discountPrice ? `${currency}${item.discountPrice}` : '-'}</p>
            <p className='hidden md:block'>{item.quantity}</p>
            
            {/* Actions Area */}
            <div className='flex items-center justify-between w-full md:w-auto md:justify-center gap-4 mt-2 md:mt-0 border-t md:border-none pt-2 md:pt-0'>
              <p className='md:hidden text-xs text-gray-400 font-medium italic'>ID: {item._id.slice(-6)}</p>
              <div className='flex gap-3'>
                <button
                  onClick={() => editProduct(item._id)}
                  className='px-4 py-1.5 bg-gradient-to-r from-[#732581] via-[#f16c44] to-[#faad3a]
                   text-white text-xs font-bold rounded-full hover:bg-blue-700 transition-all'
                >
                  Edit
                </button>
                <button
                  onClick={() => removeProduct(item._id)}
                  className='w-8 h-8 flex items-center justify-center border-2 border-red-500 text-red-500 font-bold rounded-full hover:bg-red-500 hover:text-white transition-all'
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}

        {list.length === 0 && (
          <p className='text-center py-10 text-gray-400'>No products found.</p>
        )}
      </div>
    </div>
  )
}

export default List