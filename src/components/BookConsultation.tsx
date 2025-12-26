import { motion } from "motion/react";
import { Calendar, Clock, User, Phone, Mail, MessageSquare, CircleCheck } from "lucide-react";
import { useState } from "react";

export default function BookConsultation() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const benefits = [
    "Personalized Wedding Planning",
    "Expert Advice & Guidance",
    "Budget Planning & Management",
    "Vendor Recommendations",
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-rose-50 via-white to-amber-50/30 relative overflow-hidden" id="consultation">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-rose-100 to-amber-100 text-rose-600 mb-6 rounded-full">
              Start Your Journey
            </div>
            
            <h2 className="text-rose-900 mb-6">
              Book Your Free Consultation
            </h2>
            
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Let's discuss your dream wedding and how we can make it a reality. Our expert planners are ready to bring your vision to life.
            </p>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-amber-400 flex items-center justify-center flex-shrink-0">
                    <CircleCheck className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-700">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="bg-white/80 backdrop-blur-sm p-6 shadow-lg border border-rose-100 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Call us</p>
                  <p className="text-gray-900">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email us</p>
                  <p className="text-gray-900">hello@eternalmoments.com</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white p-8 lg:p-10 shadow-2xl border border-rose-100 rounded-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-gray-700 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-rose-500" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all duration-300 bg-gray-50/50"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-rose-500" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all duration-300 bg-gray-50/50"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-rose-500" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all duration-300 bg-gray-50/50"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>

                {/* Preferred Date */}
                <div>
                  <label className="block text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-rose-500" />
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all duration-300 bg-gray-50/50"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-gray-700 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-rose-500" />
                    Message (Optional)
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-all duration-300 bg-gray-50/50 min-h-[100px]"
                    placeholder="Tell us about your dream wedding..."
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-full hover:from-rose-600 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                >
                  <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  Book Free Consultation
                </motion.button>

                <p className="text-sm text-gray-500 text-center">
                  We'll get back to you within 24 hours
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}