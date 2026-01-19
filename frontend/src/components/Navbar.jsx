import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { HiOutlineShoppingBag, HiOutlinePhone } from "react-icons/hi";
import { RiUserLine } from "react-icons/ri";

const Navbar = () => {
  const { setShowSearch, getCartCount, token, search, setSearch } = useContext(ShopContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openMobileCategory, setOpenMobileCategory] = useState(null);
  const [openMobileSub, setOpenMobileSub] = useState(null);



  const hideMenuPages = ['/login', '/signup', '/dashboard', '/orders'];
  const shouldHideMenu = hideMenuPages.includes(location.pathname);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  const toggleMobileCategory = (category) => {
  setOpenMobileCategory(prev => (prev === category ? null : category));
  setOpenMobileSub(null);
};
  // SUB CATEGORY (SHIRT / ETHNIC / BOYS etc)
  const toggleMobileSub = (sub) => {
  setOpenMobileSub(prev => (prev === sub ? null : sub));
};
// 🔥 FIX (DO NOT TOUCH REST OF CODE)
const openMenSub = openMobileSub;
const toggleMenSub = (sub) => toggleMobileSub(sub);

  // Helper function to create URL slugs
  const createSlug = (text) => text.toLowerCase().replace(/\s+/g, '-');

  // --- MEGA MENU DATA ---
  const watchCategories = {
    PREMIUM: ["Analog", "Digital", "Smart Watch"],
    CASUAL: ["Leather Strap", "Steel Strap", "Sporty"]
  };

  const menCategories = {
    SHIRT: ["Formal Shirt", "Casual Shirt", "Comfort Shirt"],
    PANJABI: ["Semi Fitted Panjabi", "Fitted Panjabi", "Premium Panjabi", "Kabli Set", "Waist Coat"],
    "T-SHIRTS & POLOS": ["T-Shirt", "Polo"],
    "BOTTOM WEAR": ["Jeans", "Chinos", "Shorts", "Ethnic Pajamas", "Premium Pant Pajamas", "Pant Pajamas", "Sarong/Lungi"],
    FOOTWEAR: ["Formal", "Casual", "Sandal"],
    "DAILY LIFE": ["Ethnic Bath Towel", "Water Bottle", "Bags", "Laptop Bag"]
  };

  const womenCategories = {
    "ETHNIC WEAR": ["Salwar Kameez", "Kameez", "Saree"],
    "WESTERN & FUSION": ["Tunic", "Tunic With Shrug", "Long Tunic", "Top And Bottom Set", "Koti", "Women's Shirt", "Gown", "Tops & T-Shirts", "Jump Suit", "Shrug", "Maxi"],
    FOOTWEAR: ["Jutties", "Mules", "Sandals", "Slippers"],
    "BOTTOM WEAR": ["Palazzo", "Harem", "Leggings", "Jeans", "Culottes", "Skirt", "Formal Pant"],
    "DAILY LIFE": ["Ethnic Bath Towel", "Water Bottle"]
  };

  const kidsCategories = {
    "BOY'S CLOTHING": ["Polo", "T-Shirt", "Casual Shirt", "Panjabi", "Pajama", "3 Quarter Pants", "Innerwear", "Bottoms"],
    "GIRL'S CLOTHING": ["Frocks", "Tunics", "Salwar Kameez", "Ghagra Choli", "Clothing Sets", "Culottes", "Leggings", "Palazzo", "Innerwear", "Bag", "Accessories"],
    "NEW BORN": ["Boy's Shirt Pant Set", "Boy's Nima Set", "Boy's Panjabi Set", "Girl's Frock", "Girl's Skirt Tops Set", "Girl's Ghagra Choli", "Girl's Nima Set", "Accessories"],
    "MINI-ME": ["Father-Son", "Mother-Daughter", "Matching"],
    "DAILY LIFE": ["Ethnic Bath Towel", "Water Bottle", "Kids Backpack"]
  };
  // --- ADVANCED DYNAMIC SEARCH HANDLE ---
  const handleSearch = (e) => {
    e.preventDefault();
    const query = search.toLowerCase().trim();
    if (query === "") return;

    const findPath = () => {
      // 1. Check Watch
      for (const cat in watchCategories) {
        const match = watchCategories[cat].find(item => item.toLowerCase() === query || query.includes(item.toLowerCase()));
        if (match) return `/watch/${createSlug(match)}`;
      }
      // 2. Check Men
      for (const cat in menCategories) {
        const match = menCategories[cat].find(item => item.toLowerCase() === query || query.includes(item.toLowerCase()));
        if (match) return `/men/${createSlug(match)}`;
      }
      // 3. Check Women
      for (const cat in womenCategories) {
        const match = womenCategories[cat].find(item => item.toLowerCase() === query || query.includes(item.toLowerCase()));
        if (match) return `/women/${createSlug(match)}`;
      }
      // 4. Check Kids
      for (const cat in kidsCategories) {
        const match = kidsCategories[cat].find(item => item.toLowerCase() === query || query.includes(item.toLowerCase()));
        if (match) return `/kids/${createSlug(match)}`;
      }

      // Default keywords
      if (query.includes("shirt")) return "/men/casual-shirt";
      if (query.includes("pant")) return "/men/jeans";
      if (query.includes("watch")) return "/watch";
      
      return null;
    };

    const targetPath = findPath();

    if (targetPath) {
      navigate(targetPath);
    } else {
      setShowSearch(true);
      if (location.pathname !== '/collection') {
        navigate('/collection');
      }
    }
  };

  return (
    <header className="w-full bg-white font-sans sticky top-0 z-50 shadow-md">
      
      {/* --- TOP BAR --- */}
      <div className="bg-gradient-to-r from-[#732581] via-[#f16c44] to-[#faad3a] text-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 h-10">
        <div className="flex gap-2">
          {[
            { Icon: FaFacebookF, link: "https://www.facebook.com/Plexara" },
            { Icon: FaTwitter, link: "https://twitter.com/yourprofile" },
            { Icon: FaYoutube, link: "https://youtube.com/@yourchannel" },
            { Icon: FaInstagram, link: "https://instagram.com/yourprofile" },
          ].map(({ Icon, link }, i) => (
            <a
              key={i}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/50 rounded-full p-1.5 cursor-pointer hover:bg-[#f16c44] transition"
              aria-label="Social Link"
            >
              <Icon size={12} />
            </a>
          ))}
        </div>

          <div className="relative group cursor-pointer flex items-center gap-1" onClick={() => { if (!token) navigate('/login'); }}>
            <RiUserLine size={18} />
            <span className="text-[15px] font-medium">My Account</span>
            <span className="text-[10px]">▼</span>
            {token && (
              <div className="absolute right-0 top-full hidden group-hover:block bg-white text-gray-700 shadow-lg mt-0 w-40 z-50 border text-base font-semibold">
                <Link to="/dashboard" className="block px-4 py-3 hover:bg-gray-100">My Profile</Link>
                <Link to="/orders" className="block px-4 py-3 hover:bg-gray-100">Orders</Link>
                <p onClick={handleLogout} className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-t text-red-600">Logout</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- MIDDLE SECTION --- */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:py-4 bg-white">
        
        {/* Left Side: Call Us & Search Bar */}
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-1.5 md:gap-3">
            <HiOutlinePhone className="text-[#E55225] shrink-0" size={20} />
            <div className="flex flex-col">
              <span className="text-[#E55225] text-[7px] md:text-[10px] font-bold tracking-widest uppercase leading-none">Call Us</span>
              <span className="text-gray-800 font-bold text-[11px] md:text-sm leading-tight">+880 1604-643731</span>
            </div>
          </div>
          
          {/* Permanent Search Bar */}
          <form onSubmit={handleSearch} className="relative w-full max-w-[180px] md:max-w-[220px]">
            <input 
              type="text" 
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-1 px-3 pl-8 text-[11px] md:text-[12px] focus:outline-none focus:border-[#E55225] transition-all"
            />
            <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
          </form>
        </div>

        {/* Center: Logo */}
        <Link to="/" className="flex justify-center flex-1">
          <img src={assets.logo} alt="Logo" className="w-44 md:w-56 transition-all" />
        </Link>

        {/* Right Side: Cart & Mobile Menu */}
        <div className="flex items-center justify-end gap-3 md:gap-6 text-gray-600 flex-1">
          <Link to="/cart" className="relative">
            <HiOutlineShoppingBag size={25} className="hover:text-[#E55225]" />
            <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-[#732581] to-[#E55225] text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full border border-white">
              {getCartCount()}
            </span>
          </Link>
          {!shouldHideMenu && (
            <button onClick={() => setMobileMenu(true)} className="sm:hidden text-2xl text-gray-700">
               <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="1.2em" width="1.2em">
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* --- DESKTOP NAVIGATION --- */}
      {!shouldHideMenu && (
        <nav className="border-t border-gray-100 hidden sm:block bg-white relative">
          <ul className="max-w-7xl mx-auto flex justify-center gap-8 py-0">
            <li><NavLink to="/" className="nav-item block py-3 text-[13px] font-bold">HOME</NavLink></li>
            
            {/* --- WATCH MEGA MENU --- */}
            <li className="group static">
              <NavLink to="/watch" className="nav-item block py-3 text-[13px] font-bold group-hover:text-[#E55225]">WATCH</NavLink>
              <div className="absolute left-0 top-full w-full bg-white border-t shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="max-w-7xl mx-auto flex p-10 gap-12">
                  <div className="w-1/4">
                    <img src="https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg" alt="Watches" className="w-full h-full object-cover rounded shadow-sm" />
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-y-10 gap-x-6">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-4 border-l-4 border-[#E55225] pl-2 uppercase">Premium Collection</h4>
                      <div className="flex flex-col gap-2">
                        {watchCategories.PREMIUM.map(item => <Link key={item} to={`/watch/${createSlug(item)}`} className="text-gray-500 hover:text-[#E55225] text-[13px]">{item}</Link>)}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-4 border-l-4 border-[#E55225] pl-2 uppercase">Casual Collection</h4>
                      <div className="flex flex-col gap-2">
                        {watchCategories.CASUAL.map(item => <Link key={item} to={`/watch/${createSlug(item)}`} className="text-gray-500 hover:text-[#E55225] text-[13px]">{item}</Link>)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>

            {/* --- MEN MEGA MENU --- */}
            <li className="group static">
              <NavLink to="/men" className="nav-item block py-3 text-[13px] font-bold group-hover:text-[#E55225]">MEN</NavLink>
              <div className="absolute left-0 top-full w-full bg-white border-t shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="max-w-7xl mx-auto flex p-10 gap-12">
                  <div className="w-1/4">
                    <img src="https://images.pexels.com/photos/157675/fashion-men-s-individuality-black-and-white-157675.jpeg" alt="Men" className="w-full h-full object-cover rounded shadow-sm" />
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-y-10 gap-x-6">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-4 border-l-4 border-[#E55225] pl-2">SHIRT</h4>
                      <div className="flex flex-col gap-2">
                        {menCategories.SHIRT.map(item => <Link key={item} to={`/men/${createSlug(item)}`} className="text-gray-500 hover:text-[#E55225] text-[13px]">{item}</Link>)}
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm mt-8 mb-4 border-l-4 border-[#E55225] pl-2">PANJABI</h4>
                      <div className="flex flex-col gap-2">
                        {menCategories.PANJABI.map(item => <Link key={item} to={`/men/${createSlug(item)}`} className="text-gray-500 hover:text-[#E55225] text-[13px]">{item}</Link>)}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-4 border-l-4 border-[#E55225] pl-2">T-SHIRTS & POLOS</h4>
                      <div className="flex flex-col gap-2">
                        {menCategories["T-SHIRTS & POLOS"].map(item => <Link key={item} to={`/men/${createSlug(item)}`} className="text-gray-500 hover:text-[#E55225] text-[13px]">{item}</Link>)}
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm mt-8 mb-4 border-l-4 border-[#E55225] pl-2">BOTTOM WEAR</h4>
                      <div className="flex flex-col gap-2">
                        {menCategories["BOTTOM WEAR"].map(item => <Link key={item} to={`/men/${createSlug(item)}`} className="text-gray-500 hover:text-[#E55225] text-[13px]">{item}</Link>)}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-4 border-l-4 border-[#E55225] pl-2">FOOTWEAR</h4>
                      <div className="flex flex-col gap-2">
                        {menCategories.FOOTWEAR.map(item => <Link key={item} to={`/men/${createSlug(item)}`} className="text-gray-500 hover:text-[#E55225] text-[13px]">{item}</Link>)}
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm mt-8 mb-4 border-l-4 border-[#E55225] pl-2">DAILY LIFE</h4>
                      <div className="flex flex-col gap-2">
                        {menCategories["DAILY LIFE"].map(item => <Link key={item} to={`/men/${createSlug(item)}`} className="text-gray-500 hover:text-[#E55225] text-[13px]">{item}</Link>)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>

            {/* --- WOMEN MEGA MENU --- */}
            <li className="group static">
              <NavLink to="/women" className="nav-item block py-3 text-[13px] font-bold group-hover:text-[#732581]">WOMEN</NavLink>
              <div className="absolute left-0 top-full w-full bg-white border-t shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="max-w-7xl mx-auto flex p-10 gap-12">
                  <div className="w-1/4">
                    <img src="https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg" alt="Women" className="w-full h-full object-cover rounded shadow-sm" />
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-y-10 gap-x-6">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-4 border-l-4 border-[#732581] pl-2">ETHNIC WEAR</h4>
                      <div className="flex flex-col gap-2">
                        {womenCategories["ETHNIC WEAR"].map(item => <Link key={item} to={`/women/${createSlug(item)}`} className="text-gray-500 hover:text-[#732581] text-[13px]">{item}</Link>)}
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm mt-8 mb-4 border-l-4 border-[#732581] pl-2">FOOTWEAR</h4>
                      <div className="flex flex-col gap-2">
                        {womenCategories.FOOTWEAR.map(item => <Link key={item} to={`/women/${createSlug(item)}`} className="text-gray-500 hover:text-[#732581] text-[13px]">{item}</Link>)}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-4 border-l-4 border-[#732581] pl-2">WESTERN & FUSION</h4>
                      <div className="flex flex-col gap-2">
                        {womenCategories["WESTERN & FUSION"].map(item => <Link key={item} to={`/women/${createSlug(item)}`} className="text-gray-500 hover:text-[#732581] text-[13px]">{item}</Link>)}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-4 border-l-4 border-[#732581] pl-2">BOTTOM WEAR</h4>
                      <div className="flex flex-col gap-2">
                        {womenCategories["BOTTOM WEAR"].map(item => <Link key={item} to={`/women/${createSlug(item)}`} className="text-gray-500 hover:text-[#732581] text-[13px]">{item}</Link>)}
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm mt-8 mb-4 border-l-4 border-[#732581] pl-2">DAILY LIFE</h4>
                      <div className="flex flex-col gap-2">
                        {womenCategories["DAILY LIFE"].map(item => <Link key={item} to={`/women/${createSlug(item)}`} className="text-gray-500 hover:text-[#732581] text-[13px]">{item}</Link>)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>

            {/* --- KIDS MEGA MENU --- */}
            <li className="group static">
              <NavLink to="/kids" className="nav-item block py-3 text-[13px] font-bold group-hover:text-[#faad3a]">KIDS</NavLink>
              <div className="absolute left-0 top-full w-full bg-white border-t shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="max-w-7xl mx-auto flex p-10 gap-12">
                  <div className="w-1/4">
                    <img src="https://images.pexels.com/photos/1619697/pexels-photo-1619697.jpeg" alt="Kids" className="w-full h-full object-cover rounded shadow-sm" />
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-y-10 gap-x-6">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-4 border-l-4 border-[#faad3a] pl-2 uppercase">Boy's Clothing</h4>
                      <div className="flex flex-col gap-2">
                        {kidsCategories["BOY'S CLOTHING"].map(item => <Link key={item} to={`/kids/${createSlug(item)}`} className="text-gray-500 hover:text-[#faad3a] text-[13px]">{item}</Link>)}
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm mt-8 mb-4 border-l-4 border-[#faad3a] pl-2 uppercase">Mini-Me</h4>
                      <div className="flex flex-col gap-2">
                        {kidsCategories["MINI-ME"].map(item => <Link key={item} to={`/kids/${createSlug(item)}`} className="text-gray-500 hover:text-[#faad3a] text-[13px]">{item}</Link>)}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-4 border-l-4 border-[#faad3a] pl-2 uppercase">Girl's Clothing</h4>
                      <div className="flex flex-col gap-2">
                        {kidsCategories["GIRL'S CLOTHING"].map(item => <Link key={item} to={`/kids/${createSlug(item)}`} className="text-gray-500 hover:text-[#faad3a] text-[13px]">{item}</Link>)}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-4 border-l-4 border-[#faad3a] pl-2 uppercase">New Born</h4>
                      <div className="flex flex-col gap-2">
                        {kidsCategories["NEW BORN"].map(item => <Link key={item} to={`/kids/${createSlug(item)}`} className="text-gray-500 hover:text-[#faad3a] text-[13px]">{item}</Link>)}
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm mt-8 mb-4 border-l-4 border-[#faad3a] pl-2 uppercase">Daily Life</h4>
                      <div className="flex flex-col gap-2">
                        {kidsCategories["DAILY LIFE"].map(item => <Link key={item} to={`/kids/${createSlug(item)}`} className="text-gray-500 hover:text-[#faad3a] text-[13px]">{item}</Link>)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>

            <li><NavLink to="/about" className="nav-item block py-3 text-[13px] font-bold">ABOUT US</NavLink></li>
            <li><NavLink to="/contact" className="nav-item block py-3 text-[13px] font-bold">CONTACT US</NavLink></li>
          </ul>
        </nav>
      )}

{/* --- MOBILE SIDEBAR MENU --- */}
<div className={`fixed top-0 right-0 bottom-0 overflow-hidden bg-white transition-all duration-300 z-[100] ${mobileMenu ? 'w-full' : 'w-0'}`}>
  <div className='flex flex-col text-gray-600 h-full'>

    {/* Close */}
    <div onClick={() => setMobileMenu(false)} className='flex items-center gap-4 p-5 cursor-pointer border-b bg-gray-50'>
      <FaTimes className='text-xl text-[#E55225]' />
      <span className='font-bold uppercase text-gray-800'>Close Menu</span>
    </div>

    <div className='flex flex-col overflow-y-auto'>

      <NavLink onClick={() => setMobileMenu(false)} to='/' className='py-4 pl-8 border-b text-[15px] font-bold'>
        HOME
      </NavLink>

{/* WATCH */}
<div className="border-b">
  <button
    onClick={() => toggleMobileCategory("watch")}
    className="w-full flex justify-between items-center py-4 px-8 font-bold text-[15px]"
  >
    WATCH <span>{openMobileCategory === "watch" ? "⬇" : "➞"}</span>
  </button>

  {openMobileCategory === "watch" && (
    <div className="pl-10 pb-4 text-sm space-y-3">

      {/* PREMIUM COLLECTION */}
      <div>
        <button
          onClick={() => toggleMenSub("watch-premium")}
          className="w-full flex justify-between font-semibold text-gray-700"
        >
          PREMIUM COLLECTION <span>{openMenSub === "watch-premium" ? "⬇" : "➞"}</span>
        </button>

        {openMenSub === "watch-premium" && (
          <div className="pl-4 mt-2 space-y-2">
            {watchCategories.PREMIUM.map(item => (
              <Link
                key={item}
                to={`/watch/${createSlug(item)}`}
                onClick={() => setMobileMenu(false)}
                className="block text-gray-500"
              >
                {item}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CASUAL COLLECTION */}
      <div>
        <button
          onClick={() => toggleMenSub("watch-casual")}
          className="w-full flex justify-between font-semibold text-gray-700"
        >
          CASUAL COLLECTION <span>{openMenSub === "watch-casual" ? "⬇" : "➞"}</span>
        </button>

        {openMenSub === "watch-casual" && (
          <div className="pl-4 mt-2 space-y-2">
            {watchCategories.CASUAL.map(item => (
              <Link
                key={item}
                to={`/watch/${createSlug(item)}`}
                onClick={() => setMobileMenu(false)}
                className="block text-gray-500"
              >
                {item}
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  )}
</div>


      {/* MEN */}
<div className="border-b">
  <button
    onClick={() => toggleMobileCategory("men")}
    className="w-full flex justify-between items-center py-4 px-8 font-bold text-[15px]"
  >
    MEN <span>{openMobileCategory === "men" ? "⬇" : "➞"}</span>
  </button>

  {openMobileCategory === "men" && (
    <div className="pl-10 pb-4 text-sm space-y-3">

      {/* SHIRT */}
      <div>
        <button
          onClick={() => toggleMenSub("shirt")}
          className="w-full flex justify-between font-semibold text-gray-700"
        >
          SHIRT <span>{openMenSub === "shirt" ? "⬇" : "➞"}</span>
        </button>
        {openMenSub === "shirt" && (
          <div className="pl-4 mt-2 space-y-2">
            {menCategories.SHIRT.map(item => (
              <Link
                key={item}
                to={`/men/${createSlug(item)}`}
                onClick={() => setMobileMenu(false)}
                className="block text-gray-500"
              >
                {item}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* T-SHIRTS & POLOS */}
      <div>
        <button
          onClick={() => toggleMenSub("tshirt")}
          className="w-full flex justify-between font-semibold text-gray-700"
        >
          T-SHIRTS & POLOS <span>{openMenSub === "tshirt" ? "⬇" : "➞"}</span>
        </button>
        {openMenSub === "tshirt" && (
          <div className="pl-4 mt-2 space-y-2">
            {menCategories["T-SHIRTS & POLOS"].map(item => (
              <Link
                key={item}
                to={`/men/${createSlug(item)}`}
                onClick={() => setMobileMenu(false)}
                className="block text-gray-500"
              >
                {item}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* PANJABI */}
      <div>
        <button
          onClick={() => toggleMenSub("panjabi")}
          className="w-full flex justify-between font-semibold text-gray-700"
        >
          PANJABI <span>{openMenSub === "panjabi" ? "⬇" : "➞"}</span>
        </button>
        {openMenSub === "panjabi" && (
          <div className="pl-4 mt-2 space-y-2">
            {menCategories.PANJABI.map(item => (
              <Link
                key={item}
                to={`/men/${createSlug(item)}`}
                onClick={() => setMobileMenu(false)}
                className="block text-gray-500"
              >
                {item}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* BOTTOM WEAR */}
      <div>
        <button
          onClick={() => toggleMenSub("bottom")}
          className="w-full flex justify-between font-semibold text-gray-700"
        >
          BOTTOM WEAR <span>{openMenSub === "bottom" ? "⬇" : "➞"}</span>
        </button>
        {openMenSub === "bottom" && (
          <div className="pl-4 mt-2 space-y-2">
            {menCategories["BOTTOM WEAR"].map(item => (
              <Link
                key={item}
                to={`/men/${createSlug(item)}`}
                onClick={() => setMobileMenu(false)}
                className="block text-gray-500"
              >
                {item}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* FOOTWEAR */}
      <div>
        <button
          onClick={() => toggleMenSub("footwear")}
          className="w-full flex justify-between font-semibold text-gray-700"
        >
          FOOTWEAR <span>{openMenSub === "footwear" ? "⬇" : "➞"}</span>
        </button>
        {openMenSub === "footwear" && (
          <div className="pl-4 mt-2 space-y-2">
            {menCategories.FOOTWEAR.map(item => (
              <Link
                key={item}
                to={`/men/${createSlug(item)}`}
                onClick={() => setMobileMenu(false)}
                className="block text-gray-500"
              >
                {item}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* DAILY LIFE */}
      <div>
        <button
          onClick={() => toggleMenSub("daily")}
          className="w-full flex justify-between font-semibold text-gray-700"
        >
          DAILY LIFE <span>{openMenSub === "daily" ? "⬇" : "➞"}</span>
        </button>
        {openMenSub === "daily" && (
          <div className="pl-4 mt-2 space-y-2">
            {menCategories["DAILY LIFE"].map(item => (
              <Link
                key={item}
                to={`/men/${createSlug(item)}`}
                onClick={() => setMobileMenu(false)}
                className="block text-gray-500"
              >
                {item}
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  )}
</div>


      {/* WOMEN */}
<div className="border-b">
  <button
    onClick={() => toggleMobileCategory("women")}
    className="w-full flex justify-between items-center py-4 px-8 font-bold text-[15px]"
  >
    WOMEN <span>{openMobileCategory === "women" ? "⬇" : "➞"}</span>
  </button>

  {openMobileCategory === "women" && (
    <div className="pl-10 pb-4 text-sm space-y-3">

      {/* ETHNIC WEAR */}
      <div>
        <button onClick={() => toggleMenSub("women-ethnic")} className="w-full flex justify-between font-semibold text-gray-700">
          ETHNIC WEAR <span>{openMenSub === "women-ethnic" ? "↓" : "→"}</span>
        </button>
        {openMenSub === "women-ethnic" && (
          <div className="pl-4 mt-2 space-y-2">
            {womenCategories["ETHNIC WEAR"].map(item => (
              <Link key={item} to={`/women/${createSlug(item)}`} onClick={() => setMobileMenu(false)} className="block text-gray-500">
                {item}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* WESTERN & FUSION */}
      <div>
        <button onClick={() => toggleMenSub("women-western")} className="w-full flex justify-between font-semibold text-gray-700">
          WESTERN & FUSION <span>{openMenSub === "women-western" ? "⬇" : "➞"}</span>
        </button>
        {openMenSub === "women-western" && (
          <div className="pl-4 mt-2 space-y-2">
            {womenCategories["WESTERN & FUSION"].map(item => (
              <Link key={item} to={`/women/${createSlug(item)}`} onClick={() => setMobileMenu(false)} className="block text-gray-500">
                {item}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* BOTTOM WEAR */}
      <div>
        <button onClick={() => toggleMenSub("women-bottom")} className="w-full flex justify-between font-semibold text-gray-700">
          BOTTOM WEAR <span>{openMenSub === "women-bottom" ? "⬇" : "➞"}</span>
        </button>
        {openMenSub === "women-bottom" && (
          <div className="pl-4 mt-2 space-y-2">
            {womenCategories["BOTTOM WEAR"].map(item => (
              <Link key={item} to={`/women/${createSlug(item)}`} onClick={() => setMobileMenu(false)} className="block text-gray-500">
                {item}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* FOOTWEAR */}
      <div>
        <button onClick={() => toggleMenSub("women-footwear")} className="w-full flex justify-between font-semibold text-gray-700">
          FOOTWEAR <span>{openMenSub === "women-footwear" ? "⬇" : "➞"}</span>
        </button>
        {openMenSub === "women-footwear" && (
          <div className="pl-4 mt-2 space-y-2">
            {womenCategories.FOOTWEAR.map(item => (
              <Link key={item} to={`/women/${createSlug(item)}`} onClick={() => setMobileMenu(false)} className="block text-gray-500">
                {item}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* DAILY LIFE */}
      <div>
        <button onClick={() => toggleMenSub("women-daily")} className="w-full flex justify-between font-semibold text-gray-700">
          DAILY LIFE <span>{openMenSub === "women-daily" ? "⬇" : "➞"}</span>
        </button>
        {openMenSub === "women-daily" && (
          <div className="pl-4 mt-2 space-y-2">
            {womenCategories["DAILY LIFE"].map(item => (
              <Link key={item} to={`/women/${createSlug(item)}`} onClick={() => setMobileMenu(false)} className="block text-gray-500">
                {item}
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  )}
</div>


{/* KIDS */}
<div className="border-b">
  <button
    onClick={() => toggleMobileCategory("kids")}
    className="w-full flex justify-between items-center py-4 px-8 font-bold text-[15px]"
  >
    KIDS <span>{openMobileCategory === "kids" ? "⬇" : "➞"}</span>
  </button>

  {openMobileCategory === "kids" && (
    <div className="pl-10 pb-4 text-sm space-y-3">

      {/* BOYS */}
      <div>
        <button onClick={() => toggleMenSub("kids-boy")} className="w-full flex justify-between font-semibold text-gray-700">
          BOY'S CLOTHING <span>{openMenSub === "kids-boy" ? "⬇" : "➞"}</span>
        </button>
        {openMenSub === "kids-boy" && (
          <div className="pl-4 mt-2 space-y-2">
            {kidsCategories["BOY'S CLOTHING"].map(item => (
              <Link key={item} to={`/kids/${createSlug(item)}`} onClick={() => setMobileMenu(false)} className="block text-gray-500">
                {item}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* GIRLS */}
      <div>
        <button onClick={() => toggleMenSub("kids-girl")} className="w-full flex justify-between font-semibold text-gray-700">
          GIRL'S CLOTHING <span>{openMenSub === "kids-girl" ? "⬇" : "➞"}</span>
        </button>
        {openMenSub === "kids-girl" && (
          <div className="pl-4 mt-2 space-y-2">
            {kidsCategories["GIRL'S CLOTHING"].map(item => (
              <Link key={item} to={`/kids/${createSlug(item)}`} onClick={() => setMobileMenu(false)} className="block text-gray-500">
                {item}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* NEW BORN */}
      <div>
        <button onClick={() => toggleMenSub("kids-newborn")} className="w-full flex justify-between font-semibold text-gray-700">
          NEW BORN <span>{openMenSub === "kids-newborn" ? "⬇" : "➞"}</span>
        </button>
        {openMenSub === "kids-newborn" && (
          <div className="pl-4 mt-2 space-y-2">
            {kidsCategories["NEW BORN"].map(item => (
              <Link key={item} to={`/kids/${createSlug(item)}`} onClick={() => setMobileMenu(false)} className="block text-gray-500">
                {item}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* MINI ME */}
      <div>
        <button onClick={() => toggleMenSub("kids-mini")} className="w-full flex justify-between font-semibold text-gray-700">
          MINI-ME <span>{openMenSub === "kids-mini" ? "⬇" : "➞"}</span>
        </button>
        {openMenSub === "kids-mini" && (
          <div className="pl-4 mt-2 space-y-2">
            {kidsCategories["MINI-ME"].map(item => (
              <Link key={item} to={`/kids/${createSlug(item)}`} onClick={() => setMobileMenu(false)} className="block text-gray-500">
                {item}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* DAILY LIFE */}
      <div>
        <button onClick={() => toggleMenSub("kids-daily")} className="w-full flex justify-between font-semibold text-gray-700">
          DAILY LIFE <span>{openMenSub === "kids-daily" ? "↓" : "→"}</span>
        </button>
        {openMenSub === "kids-daily" && (
          <div className="pl-4 mt-2 space-y-2">
            {kidsCategories["DAILY LIFE"].map(item => (
              <Link key={item} to={`/kids/${createSlug(item)}`} onClick={() => setMobileMenu(false)} className="block text-gray-500">
                {item}
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  )}
</div>


      <NavLink onClick={() => setMobileMenu(false)} to='/about' className='py-4 pl-8 border-b text-[15px] font-bold'>
        ABOUT US
      </NavLink>

      <NavLink onClick={() => setMobileMenu(false)} to='/contact' className='py-4 pl-8 border-b text-[15px] font-bold'>
        CONTACT US
      </NavLink>
    </div>

    {/* Footer */}
    <div className="mt-auto p-8 border-t bg-gray-50">
      <p className="text-xs text-gray-400 text-center uppercase tracking-widest font-bold mb-4">
        Follow Us
      </p>
      <div className="flex justify-center gap-6">
        <FaFacebookF />
        <FaTwitter />
        <FaYoutube />
        <FaInstagram />
      </div>
    </div>

  </div>
</div>


      <style jsx>{`
        .nav-item.active {
          color: #E55225;
          border-bottom: 2px solid #E55225;
        }
        .nav-item {
          color: #1f2937;
          transition: all 0.3s;
        }
        .nav-item:hover {
          color: #E55225;
        }
      `}</style>
    </header>
  );
};

export default Navbar;