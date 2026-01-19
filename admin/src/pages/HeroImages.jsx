import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'

const HeroImages = ({ token }) => {
  const [newHeroImages, setNewHeroImages] = useState([])
  const [subheroImg1, setSubheroImg1] = useState(null)
  const [subheroImg2, setSubheroImg2] = useState(null)
  const [subheroImg3, setSubheroImg3] = useState(null)
  const [subheroImg4, setSubheroImg4] = useState(null)
  const [latestVideo, setLatestVideo] = useState(null)
  const [bestsellersVideo, setBestsellersVideo] = useState(null)

  const [currentImages, setCurrentImages] = useState({
    hero_images: [],
    subhero_img1: null,
    subhero_img2: null,
    subhero_img3: null,
    subhero_img4: null
  })

  useEffect(() => {
    fetchCurrentImages()
  }, [])

  const fetchCurrentImages = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/hero-images`)
      if (response.data.success) {
        setCurrentImages({
          hero_images: response.data.images.hero_images || [],
          subhero_img1: response.data.images.subhero_img1 || null,
          subhero_img2: response.data.images.subhero_img2 || null,
          subhero_img3: response.data.images.subhero_img3 || null,
          subhero_img4: response.data.images.subhero_img4 || null,
          latestcollection_video: response.data.images.latestcollection_video || null,
          bestsellers_video: response.data.images.bestsellers_video || null,
        })
      }
    } catch (error) {
      console.error("Error fetching hero images:", error)
      toast.error("Failed to load current images")
    }
  }

  const handleImageChange = (e, setter) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0])
    }
  }

  const handleMultipleHeroImages = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setNewHeroImages(files)
    }
  }

  const handleAddHeroImages = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      newHeroImages.forEach((file, index) => {
        formData.append('hero_image_' + index, file)
      })
      if (subheroImg1) formData.append('subhero_img1', subheroImg1)
      if (subheroImg2) formData.append('subhero_img2', subheroImg2)
      if (subheroImg3) formData.append('subhero_img3', subheroImg3)
      if (subheroImg4) formData.append('subhero_img4', subheroImg4)
      if (latestVideo) formData.append('latestcollection_video', latestVideo)
      if (bestsellersVideo) formData.append('bestsellers_video', bestsellersVideo)

      if (newHeroImages.length === 0 && !subheroImg1 && !subheroImg2 && !subheroImg3 && !subheroImg4 && !latestVideo && !bestsellersVideo) {
        toast.error("Please select at least one item")
        return
      }

      const response = await axios.post(`${backendUrl}/api/hero-images/add`, formData, {
        headers: { token, "Content-Type": "multipart/form-data" }
      })

      if (response.data.success) {
        toast.success(`Upload Successful!`)
        setNewHeroImages([]); setSubheroImg1(null); setSubheroImg2(null); setSubheroImg3(null); setSubheroImg4(null); setLatestVideo(null); setBestsellersVideo(null);
        fetchCurrentImages()
        document.querySelectorAll('input[type="file"]').forEach(input => input.value = '')
      }
    } catch (err) {
      toast.error("Upload Failed!")
    }
  }

  const handleDeleteHeroImage = async (index) => {
    if (!window.confirm('Delete this image?')) return
    try {
      const response = await axios.post(`${backendUrl}/api/hero-images/delete`, { index }, { headers: { token } })
      if (response.data.success) { toast.success("Deleted!"); fetchCurrentImages() }
    } catch (err) { toast.error("Delete Failed!") }
  }

  const handleMoveImage = async (currentIndex, direction) => {
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= currentImages.hero_images.length) return
    try {
      const response = await axios.post(`${backendUrl}/api/hero-images/reorder`, { fromIndex: currentIndex, toIndex: targetIndex }, { headers: { token } })
      if (response.data.success) fetchCurrentImages()
    } catch (err) { toast.error("Reorder Failed!") }
  }

  const handleAddSubheroes = async () => {
    try {
      const fd = new FormData()
      if (subheroImg1) fd.append('subhero_img1', subheroImg1)
      if (subheroImg2) fd.append('subhero_img2', subheroImg2)
      if (subheroImg3) fd.append('subhero_img3', subheroImg3)
      if (subheroImg4) fd.append('subhero_img4', subheroImg4)
      const response = await axios.post(`${backendUrl}/api/hero-images/add`, fd, { headers: { token, 'Content-Type': 'multipart/form-data' } })
      if (response.data.success) { toast.success('Subhero images updated'); fetchCurrentImages() }
    } catch (err) { toast.error('Upload Failed!') }
  }

  const handleAddVideos = async () => {
    try {
      const fd = new FormData()
      if (latestVideo) fd.append('latestcollection_video', latestVideo)
      if (bestsellersVideo) fd.append('bestsellers_video', bestsellersVideo)
      const response = await axios.post(`${backendUrl}/api/hero-images/add`, fd, { headers: { token, 'Content-Type': 'multipart/form-data' } })
      if (response.data.success) { toast.success('Videos updated'); fetchCurrentImages() }
    } catch (err) { toast.error('Video Upload Failed!') }
  }

  // --- Styled Components ---

  const ImageUploadSection = ({ title, image, setImage, currentImage, imageKey, recommendedSize }) => (
    <div className='w-full mb-4 p-3 md:p-4 border rounded-xl bg-white shadow-sm'>
      <p className='mb-3 text-md md:text-lg font-bold text-gray-800'>{title}</p>
      
      {currentImage && (
        <div className='mb-4'>
          <p className='text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold'>Active Image</p>
          <img
            src={currentImage}
            alt="Current"
            className='w-full h-32 md:h-48 object-cover border rounded-lg shadow-inner'
          />
        </div>
      )}

      <div>
        <label htmlFor={imageKey} className='cursor-pointer'>
          <div className='border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-orange-400 hover:bg-orange-50 transition-all'>
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="New Preview"
                className='w-full h-32 md:h-48 object-cover mx-auto rounded-lg'
              />
            ) : (
              <div className='py-2'>
                <img src={assets.upload_area} alt="" className='w-12 h-12 mx-auto mb-2 opacity-40' />
                <p className='text-sm font-medium text-gray-600'>Replace Image</p>
                <p className='text-[10px] text-gray-400 mt-1 uppercase font-bold'>{recommendedSize}</p>
              </div>
            )}
          </div>
          <input type="file" id={imageKey} onChange={(e) => handleImageChange(e, setImage)} hidden accept="image/*" />
        </label>
      </div>
    </div>
  )

  const VideoUploadSection = ({ title, video, setVideo, currentVideo, videoKey }) => (
    <div className='w-full mb-4 p-3 md:p-4 border rounded-xl bg-white shadow-sm'>
      <p className='mb-3 text-md md:text-lg font-bold text-gray-800'>{title}</p>
      {currentVideo && (
        <div className='mb-3'>
          <video src={currentVideo} controls className='w-full h-40 md:h-60 object-cover rounded-lg' />
        </div>
      )}
      <label htmlFor={videoKey} className='cursor-pointer'>
        <div className='border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-blue-50 transition-all'>
          {video ? (
            <p className='text-blue-600 text-sm font-bold'>✓ Video Selected</p>
          ) : (
            <p className='text-sm text-gray-500 font-medium italic'>Click to upload video</p>
          )}
        </div>
        <input type="file" id={videoKey} onChange={(e) => handleImageChange(e, setVideo)} hidden accept="video/*" />
      </label>
    </div>
  )

  return (
    <div className='w-full max-w-6xl mx-auto px-2 md:px-6 pb-20'>
      <h1 className='text-xl md:text-3xl font-extrabold my-6 text-gray-800 border-l-4 border-orange-500 pl-4'>
        Hero Settings
      </h1>
      
      {/* Add New Section */}
      <div className='w-full mb-10 p-4 md:p-6 border-none rounded-2xl bg-white shadow-lg'>
        <div className='flex justify-between items-center mb-4'>
            <h2 className='text-lg font-bold flex items-center gap-2'>
              <span className='bg-orange-100 p-2 rounded-lg'>🖼️</span> Slider Images
            </h2>
            
        </div>
        
        <form onSubmit={handleAddHeroImages} className='flex flex-col gap-4'>
          <label htmlFor="hero_images" className='cursor-pointer group'>
            <div className='border-2 border-dashed border-gray-300 rounded-2xl p-6 md:p-10 text-center group-hover:border-orange-400 group-hover:bg-orange-50 transition-all'>
              {newHeroImages.length > 0 ? (
                <div className='grid grid-cols-3 md:grid-cols-6 gap-2'>
                  {newHeroImages.map((file, i) => (
                    <img key={i} src={URL.createObjectURL(file)} className='w-full h-16 md:h-24 object-cover rounded-lg' />
                  ))}
                </div>
              ) : (
                <>
                  <img src={assets.upload_area} className='w-16 h-16 mx-auto mb-3 opacity-30 group-hover:scale-110 transition-transform' />
                  <p className='text-sm md:text-base font-semibold text-gray-600'>Tap to upload Slider Images</p>
                  <p className='text-[10px] text-gray-400 mt-1'>Multiple selection allowed (1920x800)</p>
                </>
              )}
            </div>
            <input type="file" id="hero_images" onChange={handleMultipleHeroImages} hidden accept="image/*" multiple />
          </label>
          <button type="submit" disabled={newHeroImages.length === 0} className="w-full md:w-max px-8 py-3 bg-gradient-to-r from-[#732581] via-[#f16c44] to-[#faad3a]
           text-white rounded-xl font-bold active:scale-95 transition-all disabled:bg-gray-300">
            Upload Slider Images
          </button>
        </form>
      </div>

      {/* Current List */}
      <div className='w-full mb-12'>
        <h2 className='text-lg font-bold mb-4 flex items-center gap-2'>
          <span className='bg-blue-100 p-2 rounded-lg'>✨</span> Live Sliders ({currentImages.hero_images.length})
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {currentImages.hero_images.map((imgUrl, index) => (
            <div key={index} className='group relative border rounded-2xl overflow-hidden bg-white shadow-sm'>
              <img src={imgUrl} className='w-full h-44 object-cover transition-transform group-hover:scale-105' />
              <div className='p-3 flex items-center justify-between bg-white'>
                <div className='flex gap-1'>
                  <button onClick={() => handleMoveImage(index, 'up')} disabled={index === 0} className='p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-30'>↑</button>
                  <button onClick={() => handleMoveImage(index, 'down')} disabled={index === currentImages.hero_images.length - 1} className='p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-30'>↓</button>
                </div>
                <button onClick={() => handleDeleteHeroImage(index)} className='px-4 py-2 text-xs font-bold bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors'>DELETE</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subhero Section */}
      <div className='w-full mt-12'>
        <h2 className='text-lg font-bold mb-6 flex items-center gap-2'>
          <span className='bg-purple-100 p-2 rounded-lg'>📁</span> Category Banners
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
          <ImageUploadSection title="Watch Category" image={subheroImg1} setImage={setSubheroImg1} currentImage={currentImages.subhero_img1} imageKey="subhero_img1" recommendedSize="1200x550" />
          <ImageUploadSection title="Women Category" image={subheroImg2} setImage={setSubheroImg2} currentImage={currentImages.subhero_img2} imageKey="subhero_img2" recommendedSize="800x267" />
          <ImageUploadSection title="Men Category" image={subheroImg3} setImage={setSubheroImg3} currentImage={currentImages.subhero_img3} imageKey="subhero_img3" recommendedSize="1200x550" />
          <ImageUploadSection title="Kids Category" image={subheroImg4} setImage={setSubheroImg4} currentImage={currentImages.subhero_img4} imageKey="subhero_img4" recommendedSize="800x267" />
        </div>
        <button onClick={handleAddSubheroes} disabled={!(subheroImg1 || subheroImg2 || subheroImg3 || subheroImg4)} className='w-full md:w-auto mt-4 px-10 py-4 bg-gradient-to-r from-[#732581] via-[#f16c44] to-[#faad3a]
         text-white rounded-xl font-bold shadow-lg shadow-purple-200 disabled:opacity-50'>
          Update Category Banners
        </button>
      </div>

      {/* Videos Section */}
      <div className='w-full mt-16 bg-gray-50 p-4 md:p-8 rounded-3xl'>
        <h2 className='text-lg font-bold mb-6'>🎥 Marketing Videos</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <VideoUploadSection title="Latest Collection" video={latestVideo} setVideo={setLatestVideo} currentVideo={currentImages.latestcollection_video} videoKey="latestcollection_video" />
          <VideoUploadSection title="Best Sellers" video={bestsellersVideo} setVideo={setBestsellersVideo} currentVideo={currentImages.bestsellers_video} videoKey="bestsellers_video" />
        </div>
        <button onClick={handleAddVideos} disabled={!(latestVideo || bestsellersVideo)} className='w-full md:w-auto mt-6 px-10 py-4 bg-gradient-to-r from-[#732581] via-[#f16c44] to-[#faad3a]
         text-white rounded-xl font-bold shadow-xl shadow-gray-300 disabled:opacity-50'>
          Update Videos
        </button>
      </div>
    </div>
  )
}

export default HeroImages