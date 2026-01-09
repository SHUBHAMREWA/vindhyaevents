import { motion } from "motion/react";
import Slider from "react-slick";
import { Quote } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const testimonials = [
  {
    name: "Sarah & Michael",
    image: "https://images.unsplash.com/photo-1707191585137-4553ae4b762d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHdlZGRpbmclMjBjbGllbnR8ZW58MXx8fHwxNzY2NDE0NDA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    review:
      "Eternal Moments made our wedding day absolutely perfect! From the stunning floral arrangements to the seamless coordination, every detail exceeded our expectations. We couldn't have asked for a better team.",
    rating: 5,
  },
  {
    name: "Emily & James",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
    review:
      "Working with this team was a dream come true. They understood our vision and brought it to life in the most elegant way. Our guests are still talking about how beautiful everything was!",
    rating: 5,
  },
  {
    name: "Amanda & David",
    image: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
    review:
      "Professional, creative, and incredibly attentive. They handled every aspect with grace and made sure our wedding was stress-free and magical. Highly recommended!",
    rating: 5,
  },
  {
    name: "Jessica & Ryan",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
    review:
      "The attention to detail was phenomenal. Every moment was captured beautifully, and the venue looked like something out of a fairy tale. Thank you for making our day so special!",
    rating: 5,
  },
];

export default function Testimonials() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    arrows: false,
    appendDots: (dots: React.ReactNode) => (
      <div className="mt-8">
        <ul className="flex justify-center gap-2"> {dots} </ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-3 h-3 rounded-full bg-rose-300 hover:bg-rose-400 transition-all duration-300" />
    ),
  };

  return (
    <section className="py-20 bg-white/20 backdrop-blur-sm" id="testimonials">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-rose-900 mb-4">What Our Couples Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real stories from real couples who trusted us with their special day
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <Slider {...settings}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="outline-none px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-br from-rose-50 to-amber-50/50 p-10 shadow-lg relative"
                >
                  {/* Quote Icon */}
                  <div className="absolute top-8 left-8 opacity-20">
                    <Quote className="w-16 h-16 text-rose-400" />
                  </div>

                  {/* Review Text */}
                  <div className="relative z-10 text-center">
                    <p className="text-gray-700 text-lg leading-relaxed mb-8 italic">
                      "{testimonial.review}"
                    </p>

                    {/* Client Image */}
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <h4 className="text-rose-900 mb-2">
                        {testimonial.name}
                      </h4>

                      {/* Star Rating */}
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-5 h-5 text-amber-400 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}
