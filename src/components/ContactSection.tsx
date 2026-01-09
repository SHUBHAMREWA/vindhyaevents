import { useState } from "react";
import { motion } from "motion/react";
import { Phone, Mail, MapPin, Calendar } from "lucide-react";

export default function ContactSection() {
  const [showTitle, setShowTitle] = useState(false);

  return (
    <section className="py-20 bg-gradient-to-b from-white/20 to-rose-50/5 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-rose-900 mb-6">
              Contact & Book a Consultation
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Let's bring your dream wedding to life. Our expert team is here to
              guide you through every step of your special day. Book a
              personalized consultation with us today.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <p className="text-gray-600">hello@eternalmoments.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <p className="text-gray-600">
                    123 Wedding Avenue, Suite 400
                    <br />
                    New York, NY 10001
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-rose-400 text-white hover:bg-rose-500 transition-all duration-300 transform hover:scale-105 shadow-md flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Book Now
              </button>
              <button className="px-6 py-3 border-2 border-rose-400 text-rose-400 hover:bg-rose-400 hover:text-white transition-all duration-300 transform hover:scale-105">
                Contact Us
              </button>
            </div>
          </motion.div>

          {/* Right Side - Showcase Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div
              className="relative overflow-hidden shadow-2xl cursor-pointer group"
              onClick={() => setShowTitle(!showTitle)}
              onMouseEnter={() => setShowTitle(true)}
              onMouseLeave={() => setShowTitle(false)}
            >
              <img
                src="https://images.unsplash.com/photo-1613822425851-d4b7756f4f22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwc2hvd2Nhc2UlMjBwb3J0Zm9saW98ZW58MXx8fHwxNzY2NDE0NDA3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Wedding Showcase"
                className="w-full h-[500px] object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              
              {/* Overlay with Title */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showTitle ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex items-end justify-center p-8"
              >
                <div className="text-center text-white">
                  <h3 className="mb-2">
                    Luxury Garden Wedding
                  </h3>
                  <p className="text-white/90">
                    A stunning celebration in the heart of nature
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-rose-200/30 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-amber-200/30 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
