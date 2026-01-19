import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'
import { useParams, useNavigate } from 'react-router-dom'
import { Upload, Plus, X } from 'lucide-react' // আইকন ব্যবহারের জন্য

const Add = ({ token }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  // State Variables
  const [name, setName] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [fullDescription, setFullDescription] = useState('')
  const [price, setPrice] = useState('')
  const [discountPrice, setDiscountPrice] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [category, setCategory] = useState('')
  const [type, setType] = useState('')
  const [subType, setSubType] = useState('')
  const [bestseller, setBestseller] = useState(false)
  
  const [images, setImages] = useState([null, null, null, null])
  const [existingImages, setExistingImages] = useState([])
  const [selectedSizes, setSelectedSizes] = useState([])

  // Category & Size Data (Your existing structure)
  const categoryStructure = {
    Men: {
      "SHIRT": ["Formal Shirt", "Casual Shirt", "Comfort Shirt"],
      "PANJABI": ["Semi Fitted Panjabi", "Fitted Panjabi", "Premium Panjabi", "Kabli Set", "Waist Coat"],
      "T-SHIRTS & POLOS": ["T-Shirt", "Polo"],
      "BOTTOM WEAR": ["Jeans", "Chinos", "Shorts", "Ethnic Pajamas", "Premium Pant Pajamas", "Pant Pajamas", "Sarong/Lungi"],
      "FOOTWEAR": ["Formal", "Casual", "Sandal"],
      "DAILY LIFE": ["Ethnic Bath Towel", "Water Bottle", "Bags", "Laptop Bag"]
    },
    Women: {
      "ETHNIC WEAR": ["Salwar Kameez", "Kameez", "Saree"],
      "WESTERN & FUSION": ["Tunic", "Tunic With Shrug", "Long Tunic", "Top And Bottom Set", "Koti", "Women's Shirt", "Gown", "Tops & T-Shirts", "Jump Suit", "Shrug", "Maxi"],
      "FOOTWEAR": ["Jutties", "Mules", "Sandals", "Slippers"],
      "BOTTOM WEAR": ["Palazzo", "Harem", "Leggings", "Jeans", "Culottes", "Skirt", "Formal Pant"],
      "DAILY LIFE": ["Ethnic Bath Towel", "Water Bottle"]
    },
    Kids: {
      "BOY'S CLOTHING": ["Polo", "T-Shirt", "Casual Shirt", "Panjabi", "Pajama", "3 Quarter Pants", "Innerwear", "Bottoms"],
      "GIRL'S CLOTHING": ["Frocks", "Tunics", "Salwar Kameez", "Ghagra Choli", "Clothing Sets", "Culottes", "Leggings", "Palazzo", "Innerwear", "Bag", "Accessories"],
      "NEW BORN": ["Boy's Shirt Pant Set", "Boy's Nima Set", "Boy's Panjabi Set", "Girl's Frock", "Girl's Skirt Tops Set", "Girl's Ghagra Choli", "Girl's Nima Set", "Accessories"],
      "MINI-ME": ["Father-Son", "Mother-Daughter", "Matching"],
      "DAILY LIFE": ["Ethnic Bath Towel", "Water Bottle", "Kids Backpack"]
    },
    Watch: {
      "PREMIUM": ["Analog", "Digital", "Smart Watch"],
      "CASUAL": ["Leather Strap", "Steel Strap"]
    }
  }

  const sizeOptions = {
    "SHIRT": ["S", "M", "L", "XL", "XXL"],
    "PANJABI": ["38", "40", "42", "44", "46"],
    "BOTTOM WEAR": ["28", "30", "32", "34", "36", "38", "40"],
    "FOOTWEAR": ["39", "40", "41", "42", "43", "44", "45"],
    "PREMIUM": ["White", "Black", "Naby Blue", "Blue", "Golden", "Silver"],
    "CASUAL":  ["White", "Black", "Naby Blue", "Blue", "Golden", "Silver"],
    "T-SHIRTS & POLOS": ["S", "M", "L", "XL", "XXL"],
    "ETHNIC WEAR": ["34", "36", "38", "40", "42", "44"],
    "WESTERN & FUSION": ["S", "M", "L", "XL", "XXL"],
    "BOY'S CLOTHING": ["2-3", "4-5", "6-7", "8-9", "10-11"],
    "GIRL'S CLOTHING": ["2-3", "4-5", "6-7", "8-9", "10-11"],
    "NEW BORN": ["0-3 Months", "3-6 Months", "6-9 Months", "9-12 Months"],
    "MINI-ME": ["S", "M", "L", "XL", "XXL"]
  }

  // Effect and Handlers (Keep your existing logic)
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return
      try {
        const res = await axios.post(`${backendUrl}/api/product/single`, { productId: id })
        if (res.data.success) {
          const p = res.data.product
          setName(p.name);
          setShortDescription(p.description || '');
          setFullDescription(p.fullDescription || '');
          setPrice(p.price);
          setDiscountPrice(p.discountPrice || ''); setCategory(p.category); setType(p.type);
          setTimeout(() => { setSubType(p.subType || '') }, 100);
          setSelectedSizes(p.sizes || []); setBestseller(p.bestseller); setQuantity(p.quantity || 0);
          setExistingImages(p.images || []);
        }
      } catch (err) { toast.error("Error fetching product") }
    }
    fetchProduct()
  }, [id])

  const handleCategoryChange = (e) => { setCategory(e.target.value); setType(''); setSubType(''); }
  const handleTypeChange = (e) => { setType(e.target.value); setSubType(''); }
  const handleSizeCheck = (size) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])
  }
  const handleImageChange = (e, index) => {
    if (e.target.files[0]) {
      const newImages = [...images]; newImages[index] = e.target.files[0]; setImages(newImages);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("name", name);
      formData.append("shortDescription", shortDescription);
      formData.append("fullDescription", fullDescription);
      formData.append("category", category); formData.append("type", type);
      formData.append("subType", subType); formData.append("price", price);
      formData.append("discountPrice", discountPrice); formData.append("quantity", quantity);
      formData.append("bestseller", bestseller); formData.append("sizes", JSON.stringify(selectedSizes));

      images.forEach((img, index) => { if (img) formData.append(`image${index + 1}`, img) })

      let url = `${backendUrl}/api/product/add`
      if (id) { formData.append("id", id); url = `${backendUrl}/api/product/update`; }

      const res = await axios.post(url, formData, { headers: { token, "Content-Type": "multipart/form-data" } })
      if (res.data.success) {
        toast.success(id ? "Product Updated!" : "Product Added!"); navigate("/list")
      } else { toast.error(res.data.message) }
    } catch (err) { toast.error(err.message) }
  }

  return (
    <div className='p-4 md:p-8 bg-gray-50 min-h-screen'>
      <form className='max-w-4xl mx-auto flex flex-col gap-6 bg-white p-6 md:p-10 rounded-2xl shadow-sm' onSubmit={handleSubmit}>
        
        <div className='flex justify-between items-center border-b pb-4'>
            <p className='text-2xl font-bold text-gray-800'>{id ? "Edit Product" : "Add New Product"}</p>
            <div className='h-2 w-20 bg-gradient-to-r from-[#732581] to-[#f16c44] rounded-full hidden sm:block'></div>
        </div>

        {/* Image Upload Section */}
        <div className='space-y-3'>
          <p className='text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2'>
            <Upload className="w-4 h-4" /> Product Images
          </p>
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
            {[0, 1, 2, 3].map(index => (
              <label key={index} className="relative cursor-pointer group h-32 sm:h-40 bg-gray-50 border-2 border-dashed 
              border-gray-200 rounded-xl overflow-hidden flex items-center justify-center hover:border-[#f16c44] transition-all">
                {images[index] || existingImages[index] ? (
                  <img
                    className='w-full h-full object-cover'
                    src={images[index] ? URL.createObjectURL(images[index]) : existingImages[index]}
                    alt=""
                  />
                ) : (
                  <div className='flex flex-col items-center text-gray-400 group-hover:text-[#f16c44]'>
                    <Plus className='w-6 h-6' />
                    <span className='text-[10px] mt-1'>Upload</span>
                  </div>
                )}
                <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(e, index)} />
              </label>
            ))}
          </div>
        </div>

        {/* Basic Details */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='md:col-span-2'>
                <p className='text-sm font-bold text-gray-500 uppercase mb-2'>Product Title</p>
                <input className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 
                focus:ring-[#f16c44]/20 focus:border-[#f16c44]' type="text" placeholder="Write product name..." value={name} 
                onChange={e => setName(e.target.value)} required />
            </div>
            
            <div className='md:col-span-2'>
                <p className='text-sm font-bold text-gray-500 uppercase mb-2'>Short Description</p>
                <textarea className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 
                focus:ring-[#f16c44]/20 focus:border-[#f16c44]' rows={3} placeholder="Short summary shown near price..." value={shortDescription} 
                onChange={e => setShortDescription(e.target.value)} required />
            </div>

            <div className='md:col-span-2'>
                <p className='text-sm font-bold text-gray-500 uppercase mb-2'>Full Description (Product Page)</p>
                <textarea className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 
                focus:ring-[#f16c44]/20 focus:border-[#f16c44]' rows={6} placeholder="Full details shown in product description tab..." value={fullDescription} 
                onChange={e => setFullDescription(e.target.value)} />
            </div>
        </div>

        {/* Dynamic Category Logic */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          <div>
            <p className='text-sm font-bold text-gray-500 uppercase mb-2'>Category</p>
            <select className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer outline-none focus:border-[#f16c44]' 
            value={category} onChange={handleCategoryChange} required>
              <option value="">Select</option>
              {Object.keys(categoryStructure).map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <p className='text-sm font-bold text-gray-500 uppercase mb-2'>Type</p>
            <select className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer outline-none focus:border-[#f16c44]' 
            value={type} onChange={handleTypeChange} required disabled={!category}>
              <option value="">Select</option>
              {category && categoryStructure[category] && Object.keys(categoryStructure[category]).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <p className='text-sm font-bold text-gray-500 uppercase mb-2'>Sub Type</p>
            <select className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer outline-none focus:border-[#f16c44]' 
            value={subType} onChange={e => setSubType(e.target.value)} required disabled={!type}>
              <option value="">Select</option>
              {category && type && categoryStructure[category][type] && categoryStructure[category][type].map(st => (
                  <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
          <div>
            <p className='text-sm font-bold text-gray-500 uppercase mb-2'>Price</p>
            <input className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#f16c44]' 
            type="number" placeholder="0.00" value={price} onChange={e => setPrice(e.target.value)} required />
          </div>
          <div>
            <p className='text-sm font-bold text-gray-500 uppercase mb-2'>Discount Price</p>
            <input className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#f16c44]' 
            type="number" placeholder="0.00" value={discountPrice} onChange={e => setDiscountPrice(e.target.value)} />
          </div>
          <div className='col-span-2 sm:col-span-1'>
            <p className='text-sm font-bold text-gray-500 uppercase mb-2'>Stock</p>
            <input className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#f16c44]' 
            type="number" placeholder="Qty" value={quantity} onChange={e => setQuantity(e.target.value)} />
          </div>
        </div>

        {/* Sizes */}
        <div className='bg-gray-50 p-4 rounded-xl border border-gray-100'>
          <p className='text-sm font-bold text-gray-500 uppercase mb-3 tracking-wide'>Select Available Sizes</p>
          <div className='flex gap-2 flex-wrap'>
            {type && sizeOptions[type] ? sizeOptions[type].map(size => (
              <div key={size} 
                   onClick={() => handleSizeCheck(size)}
                   className={`min-w-[50px] text-center px-4 py-2 border rounded-lg cursor-pointer transition-all text-sm font-bold 
                   ${selectedSizes.includes(size) ? "bg-[#f16c44] text-white border-[#f16c44] shadow-md shadow-[#f16c44]/30" : 
                   "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}>
                {size}
              </div>
            )) : <p className='text-xs text-gray-400 italic'>Choose 'Type' to unlock sizes</p>}
          </div>
        </div>

        {/* Bestseller Toggle */}
        <div className='flex items-center gap-3 bg-gray-50 p-4 rounded-xl w-fit cursor-pointer border border-gray-100 hover:border-[#f16c44]/30' 
        onClick={() => setBestseller(!bestseller)}>
          <input type="checkbox" className='w-5 h-5 accent-[#f16c44] cursor-pointer' checked={bestseller} readOnly />
          <label className='cursor-pointer text-sm font-bold text-gray-700 select-none'>Mark as Bestseller Product</label>
        </div>

        {/* Action Button */}
        <button type="submit" className="w-full sm:w-auto sm:px-12 py-4 bg-gradient-to-r from-[#732581] via-[#f16c44] to-[#faad3a] text-white 
        font-extrabold rounded-xl shadow-xl shadow-[#f16c44]/20 hover:scale-[1.02] active:scale-95 transition-all text-lg tracking-wide">
          {id ? "UPDATE PRODUCT" : "PUBLISH PRODUCT"}
        </button>

      </form>
    </div>
  )
}

export default Add