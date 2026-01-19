import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Icon import kora hoyeche

const Hero = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
  
  const defaultHeroImages = [assets.hero_img, assets.hero_img1];
  const defaultSubheroImages = {
    subhero_img1: assets.subhero_img1 || assets.hero_img,
    subhero_img2: assets.subhero_img2 || assets.hero_img1,
    subhero_img3: assets.subhero_img3 || assets.hero_img,
    subhero_img4: assets.subhero_img4 || assets.hero_img1,
  };

  const [heroImages, setHeroImages] = useState(defaultHeroImages);
  const [subheroImages, setSubheroImages] = useState(defaultSubheroImages);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/hero-images`);
        if (response.data.success && response.data.images) {
          const images = response.data.images;
          if (images.hero_images?.length > 0) setHeroImages(images.hero_images);
          setSubheroImages({
            subhero_img1: images.subhero_img1 || defaultSubheroImages.subhero_img1,
            subhero_img2: images.subhero_img2 || defaultSubheroImages.subhero_img2,
            subhero_img3: images.subhero_img3 || defaultSubheroImages.subhero_img3,
            subhero_img4: images.subhero_img4 || defaultSubheroImages.subhero_img4,
          });
        }
      } catch (error) {
        console.error("Error fetching hero images:", error);
      }
    };
    fetchHeroImages();
  }, [backendUrl]);

  // Arrow functions
  const nextImage = () => setCurrentImage((prev) => (prev + 1) % heroImages.length);
  const prevImage = () => setCurrentImage((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
  
  useEffect(() => {
    if (heroImages.length === 0) return;
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className='w-full'>
      {/* Hero Slider Section */}
      <div className="relative h-[300px] sm:h-[400px] md:h-[600px] overflow-hidden group"> 
        <div className="relative flex w-full h-full transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(-${currentImage * 100}%)` }}>
          {heroImages.map((img, index) => (
            <img key={index} src={img} alt="Hero" className="flex-shrink-0 object-cover w-full h-full" />
          ))}
        </div>

        {/* --- LEFT ARROW --- */}
        <button 
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/80 p-3 rounded-full 
                     text-white hover:text-black transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
        >
          <FaChevronLeft size={20} />
        </button>

        {/* --- RIGHT ARROW --- */}
        <button 
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/80 p-3 rounded-full 
                     text-white hover:text-black transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
        >
          <FaChevronRight size={20} />
        </button>

        <div className="absolute z-10 top-5 left-5"> 
          <Link to="/watch">
            <button className="px-2 py-2 font-semibold text-white
           rounded-md border border-white/40
           bg-transparent
           transition-all duration-300
           hover:shadow-lg hover:shadow-[#f16c44]/30
           hover:scale-110 active:scale-95">
               SHOP NOW
            </button>
          </Link>
        </div>

        {/* --- INDICATOR DOTS --- */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroImages.map((_, index) => (
            <div 
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`h-2 transition-all cursor-pointer rounded-full ${currentImage === index ? "bg-white w-6" : "bg-white/50 w-2"}`}
            />
          ))}
        </div>
      </div>

      {/* --- SUBHERO SECTION --- */}
      <div className="w-full px-0 md:px-2 py-10 bg-white"> 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
          {/* Subhero columns remain same as your code */}
          <div className="relative group overflow-hidden h-[400px] md:h-[550px]">
            <img src={subheroImages.subhero_img1} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Sunglasses" />
            <div className="absolute inset-0 bg-black/10 flex flex-col justify-end p-8">
              
              <h3 className="text-white text-3xl uppercase mb-4 leading-tight">Watch Collection</h3>
              <Link to="/watch">
                <button className="border-2 border-white text-white px-6 py-2 text-xs font-bold hover:bg-white hover:text-black transition uppercase w-fit">
                  Shop Now
                </button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2 md:gap-4">
            <div className="relative group overflow-hidden h-[265px] md:h-[267px] bg-[#f9e15e]">
              <img src={subheroImages.subhero_img2} className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105" alt="Sneaker" />
              <div className="absolute inset-0 flex flex-col justify-center p-8">
                
                <h3 className="text-white text-2xl font-black uppercase mb-4">Women's Collection</h3>
                <Link to="/women">
                  <button className="border-2 border-white text-white px-6 py-2 text-xs font-bold hover:bg-white hover:text-black transition uppercase w-fit">
                    Shop Now
                  </button>
                </Link>
              </div>
            </div>
            <div className="relative group overflow-hidden h-[265px] md:h-[267px] bg-black">
              <img src={subheroImages.subhero_img4} className="w-full h-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105" alt="Shoes" />
              <div className="absolute inset-0 flex flex-col justify-center p-8">
                
                <h3 className="text-white text-3xl uppercase mb-4">Kid's Collection</h3>
                <Link to="/kids">
                  <button className="border-2 border-white text-white px-6 py-2 text-xs font-bold hover:bg-white hover:text-black transition uppercase w-fit">
                    Shop Now
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="relative group overflow-hidden h-[400px] md:h-[550px]">
            <img src={subheroImages.subhero_img3} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="T-Shirt" />
            <div className="absolute inset-0 bg-black/20 flex flex-col justify-start p-8 pt-16 text-white">
              
              <h3 className="text-3xl uppercase mb-4 leading-tight">Men's Collection</h3>
              <Link to="/men">
                <button className="border-2 border-white text-white px-6 py-2 text-xs font-bold hover:bg-white hover:text-black transition uppercase w-fit">
                  Shop Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;