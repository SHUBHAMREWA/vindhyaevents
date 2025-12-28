import { motion } from "motion/react";
import { Phone, Mail, MapPin } from "lucide-react";

export default function TopBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 text-white py-2 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm">
          {/* Scrolling Text for Mobile */}
          {/* <div className="md:hidden w-full overflow-hidden">
            <motion.div
              animate={{ x: [0, -1000] }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="whitespace-nowrap"
            >
              <span className="inline-block">
                🎉 Welcome to Vindhya Events - Your Premier Event Management Partner in Vindhya Region MP 🎉 
                ✨ Creating Unforgettable Moments Since Years ✨ 
                🎊 Professional Event Planning & Management Services 🎊
              </span>
            </motion.div>
          </div> */}

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center gap-6 flex-wrap justify-between w-full">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                🎉 <span className="font-medium">Welcome to Vindhya Events</span>
              </span>
              <span className="hidden lg:inline-block">|</span>
              <span className="hidden lg:inline-block">
                ✨ आपना के रीति रिवाज सजावत के साथ✨💛 ✨
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-xs">
              <a href="tel:9054718053" className="flex items-center gap-1.5 hover:text-amber-200 transition-colors">
                <Phone className="w-3.5 h-3.5" />
                +91 9054718053
              </a>
              <a href="mailto:vindhyaevent@gmail.com" className="flex items-center gap-1.5 hover:text-amber-200 transition-colors">
                <Mail className="w-3.5 h-3.5" />
                vindhyaevent@gmail.com
              </a>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Rewa, Madhya Pradesh
              </span>
            </div>
          </div>

          {/* Mobile Contact Info */}
          <div className="md:hidden flex items-center gap-1 text-xs">
            <a href="">
            आपना के रीति रिवाज सजावत के साथ✨💛
            </a>
            <a href="tel:9054718053" className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              9054718053
            </a>
            <a href="mailto:vindhyaevent@gmail.com" className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
            </a>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              Rewa, MP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}