import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';


const Cart = () => {

  const { products,currency,cartItems,updateQuantity,navigate,deliveryLocation,setDeliveryLocation,delivery_fee } = useContext(ShopContext);
  
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    
    const tempData = [];
    for(const items in cartItems){
      for(const tiem in cartItems[items]){
        if (cartItems[items][tiem] > 0) {
          tempData.push({
            _id: items,
            size: tiem,
            quantity: cartItems[items][tiem]
          })
        }
      }
    }
    setCartData(tempData);

  }, [cartItems])
   
  return (
    <div className='border-t pt-14'>

      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      <div>
        {cartData.map((item,index)=>{

          const productData = products.find((product) => product._id === item._id);

          if (!productData) return null;

          return (
            <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr]
            sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
              <div className='flex items-start gap-6'>
                <img className='w-16 sm:w-20' src={productData.image && productData.image[0] ? productData.image[0] : ''} alt="" />
                <div>
                  <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                  <div className='flex items-center gap-5 mt-2'>
                    {productData.discountPrice && Number(productData.discountPrice) > 0 ? (
                      <div className='flex items-center gap-2'>
                        <p className='text-sm sm:text-base font-bold text-black'>{currency}{productData.discountPrice}</p>
                        <p className='text-xs sm:text-sm line-through text-gray-500'>{currency}{productData.price}</p>
                      </div>
                    ) : (
                      <p className='text-sm sm:text-base'>{currency}{productData.price}</p>
                    )}
                    <p className='px-2 sm:px-3 sm:py-1 border bg-blue-100'>{item.size}</p>
                  </div>
                </div>
              </div>
              <input onChange={(e)=> e.target.value === '' || e.target.value === '0' ? null : 
              updateQuantity(item._id,item.size,Number(e.target.value))} className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1' type="number" 
              min={1} defaultValue={item.quantity} />
              <img onClick={()=>updateQuantity(item._id,item.size,0)} className='w-4 mr-4 cursor-pointer' src={assets.bin_icon} alt="" />
            </div> 
          )
        })
      }
      </div>
      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          {/* Delivery Fee Selection */}
          <div className='mb-6'>
            <h3 className='text-lg font-semibold mb-3 text-gray-700'>Delivery Location</h3>
            <div className='flex flex-col gap-3'>
              <div 
                onClick={() => setDeliveryLocation('inside')}
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  deliveryLocation === 'inside' 
                    ? 'border-[#732581] bg-purple-50' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className='flex items-center gap-3'>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    deliveryLocation === 'inside' ? 'border-[#732581]' : 'border-gray-300'
                  }`}>
                    {deliveryLocation === 'inside' && <div className='w-2.5 h-2.5 rounded-full bg-[#732581]'></div>}
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-700'>Inside Dhaka</p>
                   
                  </div>
                </div>
                <span className='text-sm font-semibold text-gray-700'>{currency}80.00</span>
              </div>
              
              <div 
                onClick={() => setDeliveryLocation('outside')}
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  deliveryLocation === 'outside' 
                    ? 'border-[#732581] bg-purple-50' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className='flex items-center gap-3'>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    deliveryLocation === 'outside' ? 'border-[#732581]' : 'border-gray-300'
                  }`}>
                    {deliveryLocation === 'outside' && <div className='w-2.5 h-2.5 rounded-full bg-[#732581]'></div>}
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-700'>Outside Dhaka</p>
                    
                  </div>
                </div>
                <span className='text-sm font-semibold text-gray-700'>{currency}130.00</span>
              </div>
            </div>
          </div>
          
          <CartTotal />
          <div className='w-full text-end'>
            <button onClick={()=>navigate('/place-order')} className='bg-gradient-to-r from-[#732581] via-[#f16c44] to-[#faad3a]
            text-white text-sm my-8 px-8 py-3'>PROCEED TO CHECKOUT</button>
          </div>
        </div>
      </div>
        
    </div>
  )
}

export default Cart