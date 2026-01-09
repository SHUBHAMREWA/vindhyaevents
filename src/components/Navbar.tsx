import { motion } from "motion/react";
import { Heart, Menu, X, Home, Sparkles, Images, CalendarHeart } from "lucide-react";
import { useState } from "react";
import "./cssFile/Navbar.css"  ;

export default function Navbar() {
  const menuItems = ["Home", "Services", "Gallery", "About", "Blog", "Contact"];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (item: string) => {
    const sectionId = item.toLowerCase();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };  

  const TopScroll = ()=>{
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
      setMobileMenuOpen(false);
  }

  return (
    <>
      {/* Top Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-10 left-0 right-0 z-50 border-b border-rose-100 shadow-sm bg-white/60 backdrop-blur-md"
      >
        <div className="container mx-auto px-6 py-1">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div>
                <span  
                 onClick={TopScroll}
                 style={{ fontFamily: "cursive" }}
                 className="text-rose-900 font-bold text-xl md:text-2xl tracking-wide block ">Vindhya Events </span>
                <span className="text-[10px] md:text-xs text-rose-400 tracking-widest font-semibold block -mt-1 md:mt-0">Event Management</span>
              </div>
            </motion.div>

            {/* Desktop Menu Items */}
            <div className="hidden md:flex items-center gap-1">
              {menuItems.map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="relative px-4 py-2 text-gray-700 hover:text-rose-500 transition-all duration-300 group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-400 to-amber-400 group-hover:w-full transition-all duration-300" />
                </button>
              ))}
              <button
                onClick={() => scrollToSection("consultation")}
                className="ml-4 px-6 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-full hover:from-rose-600 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Book Now
              </button>
            </div>
            
            {/* Hidden Mobile Menu Button (Moved to footer) */}
            <div className="md:hidden"></div>
          </div>

          {/* Mobile Menu Dropdown (Appears from top when toggled) */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4 border-t border-rose-100 pt-4"
            >
              {menuItems.map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-rose-50 hover:text-rose-500 transition-all duration-200 rounded-lg mb-1"
                >
                  {item}
                </button>
              ))}
              <button
                onClick={() => scrollToSection("consultation")}
                className="w-full mt-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white hover:from-rose-600 hover:to-rose-700 transition-all duration-300 shadow-lg"
              >
                Book Now
              </button>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-5px_10px_rgba(0,0,0,0.05)] pb-1">
        <div className="relative flex justify-between items-end px-4 h-16 w-full">
          
          {/* Left Side */}
          <button 
            onClick={TopScroll}
            className="flex flex-col items-center justify-center w-16 h-full pb-1 text-gray-600 hover:text-rose-500 active:text-rose-600 space-y-1"
          >
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-medium">Home</span>
          </button>
          
          <button 
            onClick={() => scrollToSection("Services")}
            className="flex flex-col items-center justify-center w-16 h-full pb-1 text-gray-600 hover:text-rose-500 active:text-rose-600 space-y-1"
          >
            <Sparkles className="w-6 h-6" />
            <span className="text-[10px] font-medium">Services</span>
          </button>

          {/* Center Floating Button */}
          <div className="relative -top-6 flex flex-col items-center justify-center w-16">
            <button 
              onClick={() => scrollToSection("consultation")}
              className="flex flex-col items-center justify-center w-14 h-14 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-full shadow-lg shadow-rose-200 border-4 border-white transform transition-transform active:scale-95"
            >
              <CalendarHeart className="w-6 h-6" />
            </button>
            <span className="text-[10px] font-medium text-rose-600 mt-1 font-bold">Book</span>
          </div>

          {/* Right Side */}
          <button 
            onClick={() => scrollToSection("Gallery")}
            className="flex flex-col items-center justify-center w-16 h-full pb-1 text-gray-600 hover:text-rose-500 active:text-rose-600 space-y-1"
          >
            <Images className="w-6 h-6" />
            <span className="text-[10px] font-medium">Gallery</span>
          </button>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`flex flex-col items-center justify-center w-16 h-full pb-1 space-y-1 transition-colors ${mobileMenuOpen ? 'text-rose-600' : 'text-gray-600 hover:text-rose-500'}`}
          >
            {mobileMenuOpen ? (
               <X className="w-6 h-6" />
            ) : (
               <Menu className="w-6 h-6" />
            )}
            <span className="text-[10px] font-medium">Menu</span>
          </button>
        </div>
      </div>
    </>
  );
}