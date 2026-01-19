import React, { useContext, useState, useEffect } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
    const [method, setMethod] = useState('cod')
    const { navigate, token, backendUrl, cartItems, products, getCartAmount, delivery_fee, setCartItems } = useContext(ShopContext);
    const [loading, setLoading] = useState(false)

    const [address, setAddress] = useState({
        firstName: '', lastName: '', email: '', street: '',
        city: '', state: '', zipcode: '', country: '', phone: ''
    })

    useEffect(() => {
        if (!token) {
            toast.error("Please login to place an order")
            navigate('/login')
        }
    }, [token])

    const handlePlaceOrder = async () => {
        if (!address.firstName || !address.lastName || !address.email || !address.phone || !address.street || !address.city) {
            toast.error("Please fill in the required delivery information")
            return
        }

        const orderItems = []
        for (const itemId in cartItems) {
            for (const size in cartItems[itemId]) {
                if (cartItems[itemId][size] > 0) {
                    const product = products.find(p => p._id === itemId)
                    if (product) {
                        orderItems.push({
                            productId: itemId, 
                            name: product.name, 
                            price: product.discountPrice > 0 ? product.discountPrice : product.price,
                            size: size, 
                            quantity: cartItems[itemId][size],
                            image: product.images?.[0] || product.image?.[0] || ''
                        })
                    }
                }
            }
        }

        if (orderItems.length === 0) {
            toast.error("Your cart is empty")
            navigate('/cart')
            return
        }

        const totalAmount = getCartAmount() + delivery_fee
        
        if (totalAmount <= 0) {
            toast.error("Invalid order amount")
            return
        }

        setLoading(true)

        try {
            if (method === 'cod') {
                const response = await axios.post(backendUrl + '/api/order/create', {
                    items: orderItems, 
                    amount: totalAmount, 
                    address: address, 
                    paymentMethod: method.toUpperCase()
                }, { headers: { token } })

                if (response.data.success) {
                    toast.success("Order placed successfully!")
                    setCartItems({})
                    navigate('/orders')
                } else {
                    toast.error(response.data.message || "Failed to place order")
                }
            } else {
                // Handle SSLCOMMERZ, BKash, and Nagad payments
                const paymentMethodUpper = method.toUpperCase()
                const res = await axios.post(backendUrl + '/api/payment/sslcommerz/initiate', {
                    items: orderItems, 
                    amount: totalAmount, 
                    address: address, 
                    paymentMethod: paymentMethodUpper,
                    cus_name: `${address.firstName} ${address.lastName}`,
                    cus_email: address.email, 
                    cus_phone: address.phone
                }, { 
                    headers: { token },
                    timeout: 30000 // 30 second timeout
                })

                if (res.data.success && res.data.url) {
                    // Redirect to payment gateway
                    window.location.href = res.data.url
                } else {
                    const errorMsg = res.data.message || 'Failed to initialize payment gateway'
                    console.error('Payment initiation error:', res.data)
                    toast.error(errorMsg)
                    setLoading(false)
                }
            }
        } catch (error) {
            console.error("Payment error:", error)
            const errorMessage = error.response?.data?.message || 
                                error.message || 
                                "Failed to process payment. Please try again."
            toast.error(errorMessage)
            setLoading(false)
        }
    }

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
            <div className='flex flex-col lg:flex-row justify-between gap-12 pt-5 sm:pt-10'>

                {/* --- LEFT SIDE: Delivery Info --- */}
                <div className='flex-1 flex flex-col gap-6'>
                    <div className='mb-4'>
                        <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                        <p className='text-gray-400 text-sm mt-2'>Please provide a valid shipping address to ensure timely delivery.</p>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <input 
                            value={address.firstName}
                            onChange={(e) => setAddress({...address, firstName: e.target.value})}
                            className='w-full border border-gray-200 focus:border-[#732581] focus:ring-1 focus:ring-[#732581] outline-none rounded-xl py-3 px-4 transition-all' 
                            type="text" placeholder='First Name' 
                        />
                        <input 
                            value={address.lastName}
                            onChange={(e) => setAddress({...address, lastName: e.target.value})}
                            className='w-full border border-gray-200 focus:border-[#732581] focus:ring-1 focus:ring-[#732581] outline-none rounded-xl py-3 px-4 transition-all' 
                            type="text" placeholder='Last Name' 
                        />
                    </div>

                    <input 
                        value={address.email}
                        onChange={(e) => setAddress({...address, email: e.target.value})}
                        className='w-full border border-gray-200 focus:border-[#732581] focus:ring-1 focus:ring-[#732581] outline-none rounded-xl py-3 px-4 transition-all' 
                        type="email" placeholder='Email Address' 
                    />

                    <input 
                        value={address.street}
                        onChange={(e) => setAddress({...address, street: e.target.value})}
                        className='w-full border border-gray-200 focus:border-[#732581] focus:ring-1 focus:ring-[#732581] outline-none rounded-xl py-3 px-4 transition-all' 
                        type="text" placeholder='Street/Apartment' 
                    />

                    <div className='grid grid-cols-2 gap-4'>
                        <input 
                            value={address.city}
                            onChange={(e) => setAddress({...address, city: e.target.value})}
                            className='w-full border border-gray-200 focus:border-[#732581] focus:ring-1 focus:ring-[#732581] outline-none rounded-xl py-3 px-4 transition-all' 
                            type="text" placeholder='City' 
                        />
                        <input 
                            value={address.state}
                            onChange={(e) => setAddress({...address, state: e.target.value})}
                            className='w-full border border-gray-200 focus:border-[#732581] focus:ring-1 focus:ring-[#732581] outline-none rounded-xl py-3 px-4 transition-all' 
                            type="text" placeholder='State' 
                        />
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                        <input 
                            value={address.zipcode}
                            onChange={(e) => setAddress({...address, zipcode: e.target.value})}
                            className='w-full border border-gray-200 focus:border-[#732581] focus:ring-1 focus:ring-[#732581] outline-none rounded-xl py-3 px-4 transition-all' 
                            type="number" placeholder='Zipcode' 
                        />
                        <input 
                            value={address.country}
                            onChange={(e) => setAddress({...address, country: e.target.value})}
                            className='w-full border border-gray-200 focus:border-[#732581] focus:ring-1 focus:ring-[#732581] outline-none rounded-xl py-3 px-4 transition-all' 
                            type="text" placeholder='Country' 
                        />
                    </div>

                    <input 
                        value={address.phone}
                        onChange={(e) => setAddress({...address, phone: e.target.value})}
                        className='w-full border border-gray-200 focus:border-[#732581] focus:ring-1 focus:ring-[#732581] outline-none rounded-xl py-3 px-4 transition-all font-medium' 
                        type="tel" placeholder='Phone Number' 
                    />
                </div>

                {/* --- RIGHT SIDE: Order Summary & Payment --- */}
                <div className='lg:w-[450px] w-full'>
                    <div className='bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm sticky top-20'>
                        
                        <div className='mb-8'>
                            <CartTotal />
                        </div>

                        <div className='mt-10'>
                            <Title text1={'PAYMENT'} text2={'METHOD'} />
                            
                            <div className='grid grid-cols-1 gap-3 mt-6'>
                                {/* bKash */}
                                <div onClick={()=>setMethod('bkash')} 
                                    className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${method === 'bkash' ? 'border-[#732581] bg-white shadow-md' : 'border-transparent bg-white hover:border-gray-200'}`}>
                                    <div className='flex items-center gap-4'>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'bkash' ? 'border-[#732581]' : 'border-gray-300'}`}>
                                            {method === 'bkash' && <div className='w-2.5 h-2.5 rounded-full bg-[#732581]'></div>}
                                        </div>
                                        <img className='h-8' src={assets.bkash_logo} alt="bkash" />
                                    </div>
                                    <span className='text-xs font-bold text-gray-400'>Instant Payment</span>
                                </div>

                                {/* Nagad */}
                                <div onClick={()=>setMethod('nagad')} 
                                    className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${method === 'nagad' ? 'border-[#732581] bg-white shadow-md' : 'border-transparent bg-white hover:border-gray-200'}`}>
                                    <div className='flex items-center gap-4'>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'nagad' ? 'border-[#732581]' : 'border-gray-300'}`}>
                                            {method === 'nagad' && <div className='w-2.5 h-2.5 rounded-full bg-[#732581]'></div>}
                                        </div>
                                        <img className='h-8' src={assets.nagad_logo} alt="nagad" />
                                    </div>
                                    <span className='text-xs font-bold text-gray-400'>Fast Checkout</span>
                                </div>

                                {/* COD */}
                                <div onClick={()=>setMethod('cod')} 
                                    className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${method === 'cod' ? 'border-[#732581] bg-white shadow-md' : 'border-transparent bg-white hover:border-gray-200'}`}>
                                    <div className='flex items-center gap-4'>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'cod' ? 'border-[#732581]' : 'border-gray-300'}`}>
                                            {method === 'cod' && <div className='w-2.5 h-2.5 rounded-full bg-[#732581]'></div>}
                                        </div>
                                        <p className='text-gray-700 text-sm font-bold'>CASH ON DELIVERY</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='mt-10'>
                            <button 
                                onClick={handlePlaceOrder} 
                                disabled={loading}
                                className='w-full bg-gradient-to-r from-[#732581] via-[#c0436f] to-[#f16c44] text-white py-4 rounded-2xl font-black text-sm tracking-widest shadow-xl shadow-purple-100 hover:scale-[1.01] transition-transform active:scale-95 disabled:opacity-50'
                            >
                                {loading ? 'PROCESSING...' : 'COMPLETE ORDER'}
                            </button>
                            <p className='text-[10px] text-center text-gray-400 mt-4 uppercase tracking-widest'>Secure SSL Encrypted Transaction</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default PlaceOrder