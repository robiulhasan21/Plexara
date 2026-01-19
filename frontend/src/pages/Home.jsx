import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import LatestCollection from '../context/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import ChatWidget from '../components/ChatWidget'
import WhatsAppButton from '../components/WhatsAppButton'
import { assets } from '../assets/assets' 
import axios from 'axios'

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const Home = () => {
  const navigate = useNavigate();

  const [latestVideo, setLatestVideo] = useState(null)
  const [bestsellersVideo, setBestsellersVideo] = useState(null)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/hero-images`)
        console.debug('GET /api/hero-images response (Home):', res?.data)
        if (res.data.success && res.data.images) {
          setLatestVideo(res.data.images.latestcollection_video || null)
          setBestsellersVideo(res.data.images.bestsellers_video || null)
        }
      } catch (err) {
        // Silent fail - fallback to bundled assets
        console.error('Could not fetch hero videos', err)
      }
    }

    fetchVideos()
  }, [])

  const handleShopNow = () => {
    navigate('/men');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div>
        <Hero/>
        
        <div className="relative w-full my-10">
        <video 
          src={latestVideo || assets.latestcollection_video} 
          autoPlay 
          loop 
          muted 
          playsInline
          className="object-cover w-full h-[400px] md:h-[500px]"
        />

        {/* Overlay with SHOP NOW */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <button 
           onClick={handleShopNow}
           className="px-6 py-3 font-semibold text-white
           rounded-md border border-white/40
           bg-transparent
           transition-all duration-300
           hover:shadow-lg hover:shadow-[#f16c44]/30
           hover:scale-110 active:scale-95"

          >
            SHOP NOW
          </button>
        </div>
      </div>

        <LatestCollection/>
        <BestSeller/>


        <div className="relative w-full my-10">
        <video 
          src={bestsellersVideo || assets.bestsellers_video} 
          autoPlay 
          loop 
          muted 
          playsInline
          className="object-cover w-full h-[400px] md:h-[500px]"
        />

        {/* Overlay with SHOP NOW */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">

          <button 
            onClick={handleShopNow}
            className="px-6 py-3 font-semibold text-white
           rounded-md border border-white/40
           bg-transparent
           transition-all duration-300
           hover:shadow-lg hover:shadow-[#f16c44]/30
           hover:scale-110 active:scale-95"
          >
            SHOP NOW
          </button>
        </div>
      </div>


        <OurPolicy/>
        <ChatWidget />
        <WhatsAppButton />
    </div>
  )
}

export default Home
