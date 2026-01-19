import  { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    const currency = ' ৳ ';
    const [deliveryLocation, setDeliveryLocation] = useState(localStorage.getItem('deliveryLocation') || 'inside');
    const delivery_fee = deliveryLocation === 'inside' ? 80 : 130;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false)
    const [cartItems, setCartItems] = useState({});
    const [token,setToken] = useState(localStorage.getItem('token') || '')
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    // Fetch products from API
    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/product/list`);
            if (response.data.success) {
                // Transform products: add 'image' field from 'images' array for compatibility
                const transformedProducts = response.data.products.map(product => ({
                    ...product,
                    image: product.images || [] // Add 'image' field for frontend compatibility
                }));
                setProducts(transformedProducts);
            } else {
                toast.error("Failed to load products");
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to load products");
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Sync token with localStorage
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    // Sync delivery location with localStorage
    useEffect(() => {
        localStorage.setItem('deliveryLocation', deliveryLocation);
    }, [deliveryLocation]);

    const addToCart = async (itemId,size) => {

      if(!size){
        toast.error('Select Product Size');
        return;
      }

      let cartData = structuredClone(cartItems);

      if(cartData[itemId]){
        if(cartData[itemId][size] ){
          cartData[itemId][size] += 1;
        }else{
          cartData[itemId][size] = 1;
        }
      }
      else{
        cartData[itemId] = {};
        cartData[itemId][size] = 1;
      }
      setCartItems(cartData);
    }

      const getCartCount = () => {
        let totalCount = 0;
        for(const items in cartItems){
          for(const item in cartItems[items]){
            try {
              if (cartItems[items][item] > 0) {
                totalCount += cartItems[items][item];
              }
            } catch(error){

            }
          }
        }
        return totalCount;

      }
      const updateQuantity = async (itemId,size,quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);
      }

     const getCartAmount =  () => {
      let totalAmount = 0;
      for(const items in cartItems){
        let itemInfo = products.find(product => product._id === items);
        if (itemInfo) {
          // Use discount price if available and greater than 0, otherwise use regular price
          const itemPrice = (itemInfo.discountPrice && Number(itemInfo.discountPrice) > 0) 
            ? Number(itemInfo.discountPrice) 
            : Number(itemInfo.price);
          
          for(const item in cartItems[items]){
            try {
              if (cartItems[items][item] > 0) {
                totalAmount += itemPrice * cartItems[items][item];
              }
            } catch(error){
              
            }
          }
        }
      }
      return totalAmount;
     }
      
    const value = {
        products, currency, delivery_fee, backendUrl,
        search,setSearch,showSearch,setShowSearch,
        cartItems, setCartItems, addToCart, getCartCount,
        updateQuantity,getCartAmount,navigate,setToken,token,
        deliveryLocation, setDeliveryLocation

    }
  return (
    <ShopContext.Provider value={value}>
        {props.children}
    </ShopContext.Provider>
  )
}

export default ShopContextProvider;