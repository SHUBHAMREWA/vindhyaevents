import { motion } from "motion/react";
import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";

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

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-10 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-rose-100 shadow-sm"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div>
              <span 
               style={{ fontFamily: "cursive" }}
               className="text-rose-900 font-bold text-2xl tracking-wide block ">Vindhya Events </span>
              <span className="text-xs text-rose-400 tracking-widest font-semibold">Event Management</span>
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

          {/* Mobile menu button */}
          <button
            className="md:hidden text-rose-900 p-2 hover:bg-rose-50 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
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
  );
}