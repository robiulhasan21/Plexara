import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { Package, Truck, User, CreditCard } from 'lucide-react' // npm install lucide-react

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/order/list', {
        headers: { token }
      })
      if (response.data.success) {
        setOrders(response.data.orders)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status: newStatus },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success("Order status updated")
        await fetchOrders()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error("Failed to update order status")
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="p-2 md:p-6 pb-28 md:pb-6 bg-gray-50 min-h-screen">
      <p className='mb-6 text-2xl font-bold text-gray-800 flex items-center gap-2'>
        <Package className="w-6 h-6" /> All Orders
      </p>
      
      {orders.length === 0 ? (
        <div className='text-center py-20 bg-white rounded-xl shadow-sm'>
          <p className="text-gray-400">No orders found</p>
        </div>
      ) : (
        <div className='flex flex-col gap-6'>
          {orders.map((order) => (
            <div key={order._id} className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
              
              {/* Order Header - Mobile Friendly */}
              <div className='bg-gray-50 p-4 border-b flex flex-wrap justify-between items-center gap-3'>
                <div>
                  <p className='text-sm font-bold text-gray-900 uppercase tracking-wider'>
                    #{order._id.slice(-8)}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                   <p className='text-lg font-bold text-blue-600'>{currency}{order.amount.toFixed(2)}</p>
                </div>
              </div>

              <div className='p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6'>
                
                {/* 1. Customer & Shipping Info */}
                <div className='space-y-3'>
                  <p className='text-xs font-bold text-gray-400 uppercase flex items-center gap-2'>
                    <User className="w-3 h-3" /> Shipping To
                  </p>
                  <div className='text-sm text-gray-700 bg-gray-50 p-3 rounded-xl'>
                    <p className="font-semibold">{order.address.firstName} {order.address.lastName}</p>
                    <p className="text-gray-500 mt-1">{order.address.street}, {order.address.city}</p>
                    <p className="text-gray-500">{order.address.phone}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <p className="text-xs text-gray-600 font-medium">
                      {order.paymentMethod} — <span className={order.payment ? "text-green-600" : "text-orange-600"}>
                        {order.payment ? 'Paid' : 'Cash on Delivery'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* 2. Order Items Section */}
                <div className='lg:col-span-2'>
                  <p className='text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2'>
                    <Package className="w-3 h-3" /> Order Items ({order.items.length})
                  </p>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    {order.items.map((item, i) => (
                      <div key={i} className='flex items-center gap-3 p-2 border border-gray-100 rounded-xl'>
                        <img src={item.image} alt="" className='w-12 h-12 object-cover rounded-lg' />
                        <div className="flex-1 min-w-0">
                          <p className='text-sm font-medium text-gray-800 truncate'>{item.name}</p>
                          <p className='text-xs text-gray-500'>Size: {item.size} | Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-bold text-gray-700">{currency}{item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Bottom Action Bar - Always Fixed at Bottom of Card */}
              <div className='p-4 bg-gray-50 border-t flex flex-col sm:flex-row justify-between items-center gap-4'>
                <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-gray-400" />
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                        'bg-blue-100 text-blue-700'
                    }`}>
                        {order.status}
                    </span>
                </div>

                <div className="w-full sm:w-auto flex items-center gap-2">
                  <p className='hidden sm:block text-xs font-medium text-gray-500'>Update Status:</p>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className='w-full sm:w-auto bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none shadow-sm cursor-pointer'
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders