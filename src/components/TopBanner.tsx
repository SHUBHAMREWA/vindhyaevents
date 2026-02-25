import { motion } from "motion/react";
import { Phone, Mail, MapPin } from "lucide-react";

export default function TopBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 text-white h-[40px] flex items-center overflow-hidden"
      style={{ background: "linear-gradient(to right, var(--c-banner-from), var(--c-primary), var(--c-banner-to))" }}
    >
      <div className="container mx-auto px-6 h-full flex items-center py-0">
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
          <div className="hidden   lg:flex items-center gap-6 flex-wrap justify-between w-full">

            <div className="hidden lg:flex items-center gap-4">
              <span className="flex items-center gap-2">
                🎉 <span className="font-medium">Welcome to Vindhya Events</span>
              </span>

              <span className="hidden lg:inline-block">|</span>
              <span className="hidden lg:inline-block ">
                ✨ आपना के रीति रिवाज सजावत के साथ✨💛 ✨
              </span> 
            </div>
            
                <div className="flex items-center gap-4 text-xs">  
           <span className=" flex items-center flex-wrap">
            🎊 Professional Event Planning & Management Services 🎊
            </span>

              <a href="tel:9054718053" className="flex items-center  gap-1.5 hover:text-amber-200 transition-colors">
                <Phone className="w-3.5 h-3.5 " />
                +919054718053
              </a>
              <a href="mailto:vindhyaevent@gmail.com" className="flex  items-center gap-1.5 hover:text-amber-200 transition-colors">
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
          <div className="md:hidden flex justify-between w-full items-center gap-1 text-[10px] px-1">
             <a href="tel:9054718053" className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm">
              <Phone className="w-3 h-3" />
              <span>Call Now</span>
            </a>
            
             <a href="mailto:vindhyaevent@gmail.com" className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm">
              <Mail className="w-3 h-3" />
              <span>Email</span>
            </a>

            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Rewa, MP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}