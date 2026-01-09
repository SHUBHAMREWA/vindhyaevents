import { motion } from "motion/react";
import { Calendar, Flower2, Camera, Music, Utensils, Sparkles } from "lucide-react";

const services = [
  {
    icon: Calendar,
    title: "Full Wedding Planning",
    description:
      "Comprehensive planning from start to finish. We handle every detail so you can enjoy your engagement stress-free.",
    image: "https://images.unsplash.com/photo-1682802142549-b72576d31d5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcGxhbm5pbmclMjBjb25zdWx0YXRpb258ZW58MXx8fHwxNzY2NDE0OTU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    icon: Flower2,
    title: "Floral Design",
    description:
      "Custom floral arrangements that bring your vision to life with stunning beauty and elegance.",
    image: "https://images.unsplash.com/photo-1719499809556-070ec0dfda8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwZmxvcmFsJTIwZGVjb3JhdGlvbnxlbnwxfHx8fDE3NjYzMzExNzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    icon: Camera,
    title: "Photography & Videography",
    description:
      "Professional photographers and videographers to capture every precious moment of your special day.",
    image: "https://images.unsplash.com/photo-1628221482312-439eb2f3367d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcGhvdG9ncmFwaHklMjBjYW1lcmF8ZW58MXx8fHwxNzY2NDE0OTU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    icon: Music,
    title: "Entertainment",
    description:
      "Curated music and entertainment options to create the perfect atmosphere for your celebration.",
    image: "https://images.unsplash.com/photo-1766113483422-7c871de23591?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcmVjZXB0aW9uJTIwZW50ZXJ0YWlubWVudHxlbnwxfHx8fDE3NjY0MTQ5NTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    icon: Utensils,
    title: "Catering Services",
    description:
      "Exquisite culinary experiences from renowned chefs, tailored to your taste and dietary needs.",
    image: "https://images.unsplash.com/photo-1732259495388-af40b972c311?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY2F0ZXJpbmclMjBmb29kfGVufDF8fHx8MTc2NjMzODA3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    icon: Sparkles,
    title: "Venue Decoration",
    description:
      "Transform any space into a magical setting with our expert decoration and styling services.",
    image: "https://images.unsplash.com/photo-1763553113332-800519753e40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwd2VkZGluZyUyMHZlbnVlJTIwZGVjb3JhdGlvbnxlbnwxfHx8fDE3NjY0MTQ5NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

export default function Services() {
  return (
    <section className="py-24 bg-gradient-to-b from-white/20 to-rose-50/5 backdrop-blur-sm" id="services">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-6 py-2.5 bg-gradient-to-r from-rose-100 to-amber-100 text-rose-600 mb-6 shadow-sm rounded-full">
            What We Offer
          </div>
          <h2 className="text-rose-900 mb-6">Our Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Comprehensive wedding services designed to make your special day
            absolutely perfect
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -12 }}
                className="bg-white/10 backdrop-blur-md shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group rounded-xl border border-white/10"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Icon on Image */}
                  <div className="absolute top-4 left-4 w-14 h-14 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-rose-500" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-rose-900 mb-3">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  <button className="text-rose-500 hover:text-rose-600 flex items-center gap-2 group-hover:gap-3 transition-all duration-300 font-medium">
                    Learn More
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}