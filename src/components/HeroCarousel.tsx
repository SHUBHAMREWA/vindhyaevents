import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1724847664960-5060a1ae8259?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3ZWRkaW5nJTIwY2VyZW1vbnklMjBicmlkZSUyMGdyb29tfGVufDF8fHx8MTc2NjQxNDk1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Creating Timeless Memories",
    subtitle: "Where Love Stories Begin",
  },
  {
    image: "https://images.unsplash.com/photo-1732382643619-872165f61891?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3ZWRkaW5nJTIwbWFuZGFwJTIwZGVjb3JhdGlvbnxlbnwxfHx8fDE3NjY0MTQ5NTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Your Dream Wedding",
    subtitle: "Beautifully Crafted, Perfectly Planned",
  },
  {
    image: "https://images.unsplash.com/photo-1719468452346-20bbb785de2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3ZWRkaW5nJTIwbWVoZW5kaSUyMGNlbGVicmF0aW9ufGVufDF8fHx8MTc2NjQxNDk1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Elegant Celebrations",
    subtitle: "Every Detail, Every Moment",
  },
  {
    image: "https://images.unsplash.com/photo-1640745685024-af4663065ce3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3ZWRkaW5nJTIwc2FuZ2VldCUyMGRhbmNlfGVufDF8fHx8MTc2NjQxNDk1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Bespoke Celebrations",
    subtitle: "Blossoming Beauty for Your Special Day",
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    pauseOnHover: false,
    beforeChange: (_current: number, next: number) => setCurrentSlide(next),
    appendDots: (dots: React.ReactNode) => (
      <div className="absolute bottom-8 w-full">
        <ul className="flex justify-center gap-3"> {dots} </ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-all duration-300" />
    ),
  };

  return (
    <div className="relative h-[80vh] overflow-hidden mt-[88px]" id="home">
      <Slider {...settings} className="h-full">
        {slides.map((slide, index) => (
          <div key={index} className="relative h-[80vh] outline-none">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
            </div>

            {/* Text Overlay */}
            <div className="relative h-full flex items-center justify-center text-center px-6">
              <AnimatePresence mode="wait">
                {currentSlide === index && (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-4xl"
                  >
                    <motion.h1
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="text-white mb-4"
                    >
                      {slide.title}
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className="text-white/90 text-xl md:text-2xl"
                    >
                      {slide.subtitle}
                    </motion.p>
                    <motion.button
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                      className="mt-8 px-10 py-4 bg-rose-400 text-white rounded-full hover:bg-rose-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
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