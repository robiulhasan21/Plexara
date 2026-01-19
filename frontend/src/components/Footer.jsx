import React from "react";
import { useLocation } from "react-router-dom"; 
import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaChevronRight,
} from "react-icons/fa";

const Footer = () => {
  const location = useLocation();

  // (Profile, Orders, Login, Signup)
  const hideFooterPages = ["/dashboard", "/orders", "/login", "/signup"];


  if (hideFooterPages.includes(location.pathname)) {
    return null;
  }

  return (
    <footer className="mt-20 w-full">
      {/* --- Main Golden Footer --- */}
      <div className="bg-gradient-to-r from-[#732581] via-[#f16c44] to-[#faad3a]
       text-white py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Section 1: Contact Details */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-white/30 pb-2 uppercase tracking-wider">
              Contact Details
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 shrink-0" />
                <span>Matlab Uttar, Chandpur</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="shrink-0" />
                <span>+880 1604-643731</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="shrink-0" />
                <span>plexara1@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Section 2: Products */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-white/30 pb-2 uppercase tracking-wider">
              Products
            </h3>
            <ul className="space-y-3 text-sm">
              {["WATCH", "MEN", "WOMEN", "KIDS"].map((item) => (
                <li key={item} className="flex items-center gap-2 hover:translate-x-1 transition-transform cursor-pointer">
                  <FaChevronRight size={10} /> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: Our Company */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-white/30 pb-2 uppercase tracking-wider">
              Our Company
            </h3>
            <ul className="space-y-3 text-sm">
              {["Delivery", "About Us", "Contact Us", "Sitemap", "Stores"].map((item) => (
                <li key={item} className="flex items-center gap-2 hover:translate-x-1 transition-transform cursor-pointer">
                  <FaChevronRight size={10} /> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-white/30 pb-2 uppercase tracking-wider">
              Join Our Newsletter Now
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-2 bg-transparent border border-white/50 focus:outline-none placeholder:text-white/70 text-sm"
                />
                <button className="bg-[#732581] text-white px-4 py-2 text-sm font-bold hover:bg-[#f16c44] transition">
                  GO
                </button>
              </div>
              <p className="text-xs text-white/80">Get E-mail updates about our latest offers.</p>
              
             {/* Social Icons */}
              <div className="flex gap-3 mt-2">
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
                    className="border border-white/50 rounded-full p-2 cursor-pointer
                              hover:bg-[#732581] hover:text-white transition"
                    aria-label="Social Link"
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* --- Bottom Black Bar --- */}
      <div className="bg-gradient-to-r from-[#faad3a] via-[#732581] to-[#f16c44] text-white py-4 px-4">
        <p className="text-center text-xs md:text-sm tracking-wide">
          Copyright 2026 © PleXara.com [Develope by <a href="https://robiul-hasan.vercel.app" 
          target="_blank" rel="noopener noreferrer" className="text-white hover:text-black">Robiul Hasan]</a>.
        </p>
      </div>
    </footer>
  );
};

export default Footer;