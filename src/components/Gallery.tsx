import { motion } from "motion/react";
import { useState } from "react";

const galleryImages = [
  {
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    title: "Romantic Ceremony",
  },
  {
    url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
    title: "Garden Wedding",
  },
  {
    url: "https://images.unsplash.com/photo-1522673607211-8389f446f1e8?w=800&q=80",
    title: "Elegant Reception",
  },
  {
    url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
    title: "Floral Arrangements",
  },
  {
    url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
    title: "Wedding Details",
  },
  {
    url: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80",
    title: "Bridal Moments",
  },
];

export default function Gallery() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-white/20 backdrop-blur-sm" id="gallery">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 bg-rose-100 text-rose-600 mb-4">
            Portfolio
          </div>
          <h2 className="text-rose-900 mb-4">Our Wedding Gallery</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A glimpse into the beautiful weddings we've had the privilege to create
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative overflow-hidden aspect-[4/3] group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center p-6"
              >
                <h3 className="text-white text-center">
                  {image.title}
                </h3>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <button className="px-8 py-3 border-2 border-rose-400 text-rose-400 hover:bg-rose-400 hover:text-white transition-all duration-300 transform hover:scale-105">
            View Full Portfolio
          </button>
        </motion.div>
      </div>
    </section>
  );
}
