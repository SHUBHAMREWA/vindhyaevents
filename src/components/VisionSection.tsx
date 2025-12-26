import { motion } from "motion/react";
import { Sparkles, Heart, Users, Camera } from "lucide-react";

const visionItems = [
  {
    icon: Sparkles,
    title: "Creativity",
    description:
      "We infuse innovation and artistry into every celebration, making each wedding unique and memorable.",
  },
  {
    icon: Heart,
    title: "Love & Passion",
    description:
      "Our team pours genuine care and dedication into crafting experiences that honor your love story.",
  },
  {
    icon: Users,
    title: "Personal Touch",
    description:
      "We believe in building relationships, understanding your vision, and making it a personalized reality.",
  },
  {
    icon: Camera,
    title: "Memorable Moments",
    description:
      "Creating picture-perfect memories that will be cherished for generations to come.",
  },
];

export default function VisionSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-rose-50/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 bg-rose-100 text-rose-600 mb-4">
            Our Vision
          </div>
          <h2 className="text-rose-900 mb-4">What Drives Us</h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            At Eternal Moments, we're driven by a singular mission: to create
            wedding experiences that are as unique and beautiful as the love they
            celebrate.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {visionItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center mb-6 mx-auto">
                  <Icon className="w-8 h-8 text-rose-500" />
                </div>
                
                <h3 className="text-rose-900 mb-3 text-center">
                  {item.title}
                </h3>
                
                <p className="text-gray-600 text-center text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Vision Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 max-w-3xl mx-auto text-center bg-gradient-to-br from-rose-100/50 to-amber-100/50 p-10 shadow-md"
        >
          <p className="text-gray-700 text-lg leading-relaxed italic">
            "We don't just plan weddings; we curate experiences. Every flower,
            every note of music, every carefully chosen detail is a brushstroke in
            the masterpiece of your love story. Our vision is to make your
            wedding day not just beautiful, but unforgettable."
          </p>
          <div className="mt-6 pt-6 border-t border-rose-200">
            <p className="text-rose-900">— The Eternal Moments Team</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
