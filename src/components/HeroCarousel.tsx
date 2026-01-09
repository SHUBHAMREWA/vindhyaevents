import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const slides = [
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
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
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
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
            </div>

            {/* Text */}
            <div className="relative h-full flex items-center justify-center text-center px-6">
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
                      className="text-white text-4xl md:text-6xl mb-4"
                    >
                      {slide.title}
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-white/90 text-xl md:text-2xl"
                    >
                      {slide.subtitle}
                    </motion.p>

                    <motion.button 
                     onClick={()=>scrollToSection("consultation")}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="mt-8 px-10 py-4 bg-rose-400 text-white rounded-full
                                 hover:bg-rose-500 transition transform hover:scale-105"
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
