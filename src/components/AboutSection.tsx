import { motion } from "motion/react";
import { Heart } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-rose-50/5 to-white/20 backdrop-blur-sm" id="about">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80"
                  alt="About Us"
                  className="w-full h-[400px] object-cover"
                />
              </div>

              {/* Decorative heart */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-rose-200 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="w-12 h-12 text-white fill-white" />
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-200/40 rounded-full blur-2xl" />
            </motion.div>

            {/* Right Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block px-4 py-2 bg-rose-100 text-rose-600 mb-4">
                Our Story
              </div>
              
              <h2 className="text-rose-900 mb-6">About Eternal Moments</h2>
              
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  For over a decade, Eternal Moments has been crafting
                  unforgettable wedding experiences that celebrate love in its
                  purest form. What started as a passion project has blossomed
                  into one of the most trusted names in luxury wedding planning.
                </p>
                
                <p>
                  We believe every couple deserves a wedding that reflects their
                  unique story. Our dedicated team of creative professionals works
                  tirelessly to transform dreams into reality, ensuring every
                  detail is meticulously planned and beautifully executed.
                </p>
                
                <p>
                  From intimate garden ceremonies to grand ballroom celebrations,
                  we specialize in creating magical moments that you and your
                  guests will treasure forever. Our approach combines timeless
                  elegance with modern sophistication, always staying true to your
                  vision.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-rose-500 mb-2">500+</div>
                  <p className="text-gray-600 text-sm">Weddings Planned</p>
                </div>
                <div className="text-center">
                  <div className="text-rose-500 mb-2">10+</div>
                  <p className="text-gray-600 text-sm">Years Experience</p>
                </div>
                <div className="text-center">
                  <div className="text-rose-500 mb-2">98%</div>
                  <p className="text-gray-600 text-sm">Happy Couples</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
