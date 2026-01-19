import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import girlImg from '../../public/girlsimg.png';
import decoration1img from "../../public/dercoration1.png"

const slides = [
  {
    
    image:
      girlImg ,
    title: "Creating Timeless Memories",
    subtitle: "Where Love Stories Begin",
  },
    {
    
    image:
      decoration1img ,
    title: "Creating Timeless Memories",
    subtitle: "Where Love Stories Begin",
  },
  {
    
    image:
      "https://images.unsplash.com/photo-1724847664960-5060a1ae8259",
    title: "Creating Timeless Memories",
    subtitle: "Where Love Stories Begin",
  },
  {
    image:
      "https://images.unsplash.com/photo-1732382643619-872165f61891",
    title: "Your Dream Wedding",
    subtitle: "Beautifully Crafted, Perfectly Planned",
  },
  {
    image:
      "https://images.unsplash.com/photo-1719468452346-20bbb785de2e",
    title: "Elegant Celebrations",
    subtitle: "Every Detail, Every Moment",
  },
  {
    image:
      "https://images.unsplash.com/photo-1640745685024-af4663065ce3",
    title: "Bespoke Celebrations",
    subtitle: "Blossoming Beauty for Your Special Day",
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<Slider | null>(null);  
    

   const scrollToSection = (item: string) => {
    const sectionId = item.toLowerCase();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    fade: true,
    pauseOnHover: false,
    cssEase: "linear",
    arrows: false, // 👈 hum khud ke arrows use kar rahe hain
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    appendDots: (dots: React.ReactNode) => (
      <div className="absolute bottom-8 w-full">
        <ul className="flex justify-center gap-3">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-all duration-300" />
    ),
  };

  return (
    <div className="relative h-[80vh] overflow-hidden mt-[88px]" id="home">
      {/* PREVIOUS BUTTON */}
      <button
        onClick={() => sliderRef.current?.slickPrev()}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20
                   w-12 h-12 rounded-full
                   bg-white/20 backdrop-blur-md text-white
                   flex items-center justify-center
                   hover:bg-white/40 transition"
      >
        ‹
      </button>

      {/* NEXT BUTTON */}
      <button
        onClick={() => sliderRef.current?.slickNext()}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20
                   w-12 h-12 rounded-full
                   bg-white/20 backdrop-blur-md text-white
                   flex items-center justify-center
                   hover:bg-white/40 transition"
      >
        ›
      </button>

      <Slider ref={sliderRef} {...settings} className="h-full">
        {slides.map((slide, index) => (
          <div key={index} className="relative h-[80vh] outline-none">
            {/* Background */}
            {/* Background */}
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                className="object-cover"
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 z-10" />
            </div>

            {/* Text */}
            <div className="relative z-30 h-full flex items-center justify-center text-center px-6">
              <AnimatePresence mode="wait">
                {currentSlide === index && (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl"
                  >
                    <motion.h1
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-white text-4xl md:text-6xl mb-4 font-serif drop-shadow-lg"
                    >
                      {slide.title}
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-white/90 text-xl md:text-2xl font-medium drop-shadow-md"
                    >
                      {slide.subtitle}
                    </motion.p>

                    <motion.button 
                     onClick={()=>scrollToSection("consultation")}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="mt-8 px-10 py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-full
                                 hover:from-rose-600 hover:to-rose-700 transition transform hover:scale-105 shadow-xl hover:shadow-2xl cursor-pointer"
                    >
                      Book Consultation
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
