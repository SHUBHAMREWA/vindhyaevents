import { motion } from "motion/react";
import Script from "next/script";
import { Calendar, Clock, User, Phone, Mail, MessageSquare, CircleCheck, PartyPopper } from "lucide-react";
import { useState, useEffect, useRef } from "react"; 

export default function BookConsultation() {  

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const captchaRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    eventType: "",
    message: "",
    captchaToken: "",
  });

  useEffect(() => {
    // Define callback function that will be called when user completes captcha
    (window as any).onTurnstileSuccess = (token: string) => {
      console.log("✅ Captcha verified! Token received:", token);
      setFormData((prev) => ({ ...prev, captchaToken: token }));
    };

    return () => {
      delete (window as any).onTurnstileSuccess;
    };
  }, []);

  const renderCaptcha = () => {
    console.log("renderCaptcha called");
    console.log("captchaRef.current:", captchaRef.current);
    console.log("window.turnstile:", (window as any).turnstile);
    console.log("SITEKEY:", process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
    
    if (captchaRef.current && (window as any).turnstile) {
      // Check if already rendered to prevent duplicates
      if (captchaRef.current.innerHTML === "") {
        try {
            console.log("Rendering Turnstile widget...");
            (window as any).turnstile.render(captchaRef.current, {
            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
            callback: (token: string) => {
              console.log("🎯 Inline callback triggered with token:", token);
              (window as any).onTurnstileSuccess(token);
            },
            theme: "light",
            appearance: "interaction-only",
            });
            console.log("Turnstile widget rendered successfully");
        } catch (error) {
            console.error("Turnstile render error:", error);
        }
      } else {
        console.log("Captcha already rendered");
      }
    } else {
      console.log("Missing: ", !captchaRef.current ? "captchaRef" : "turnstile");
    }
  };

  useEffect(() => {
    console.log("useEffect for Turnstile mounting...");
    // Retry mechanism to ensure Turnstile loads
    const intervalId = setInterval(() => {
        if ((window as any).turnstile) {
            console.log("Turnstile found, rendering...");
            renderCaptcha();
            clearInterval(intervalId);
        } else {
            console.log("Waiting for Turnstile...");
        }
    }, 100);

    // Timeout after 5 seconds to stop checking
    const timeoutId = setTimeout(() => {
        console.log("Turnstile load timeout");
        clearInterval(intervalId);
    }, 5000);

    return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
    };
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.captchaToken) {
      alert("Please complete the captcha verification.");
      return;
    }
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const benefits = [
    "Personalized Event Planning",
    "Expert Advice & Guidance",
    "Budget Planning & Management",
    // "Vendor Recommendations",
  ];

  return (
    <>

          <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
        onLoad={renderCaptcha}
      />

  
    <section className="py-16 bg-gradient-to-br from-rose-50 via-white to-amber-50/30 relative overflow-hidden" id="consultation">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
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
            
            <h2 className="text-rose-900 mb-4">
              Book Your Free Consultation
            </h2>
            
            <p className=" hidden lg:blocktext-gray-600 text-lg mb-6 leading-relaxed">
              Let's discuss your dream wedding and how we can make it a reality. Our expert planners are ready to bring your vision to life.
            </p>


            {/* Benefits */}
            <div className="space-y-3 mb-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-amber-400 flex items-center justify-center flex-shrink-0">
                    <CircleCheck className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="bg-white/80 backdrop-blur-sm p-4 shadow-lg border border-rose-100 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center">
                  <Phone  className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Call us</p>
                  <a href="tel:9054718053" className="text-gray-900">+919054718053</a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email us</p>
                  <a href="mailto:vindhyaevent@gmail.com" className="text-gray-900">vindhyaevent@gmail.com</a>
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
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-rose-400 to-amber-400 rounded-2xl blur opacity-20" />
              <div className="relative bg-white/80 backdrop-blur-xl p-6 lg:p-8 shadow-2xl border border-white/50 rounded-2xl">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-serif text-gray-900 mb-2">Let's Plan Your Day</h3>
                    <p className="text-gray-500 text-sm">Fill in the details below to get started</p>
                  </div>

                  {/* Name */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1 flex items-center gap-2 group-focus-within:text-rose-500 transition-colors">
                      <User className="w-4 h-4" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-5 py-3 border border-gray-200/50 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white text-gray-800 placeholder:text-gray-400"
                      placeholder="Jane Doe"
                      required
                    />
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1 flex items-center gap-2 group-focus-within:text-rose-500 transition-colors">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-5 py-3 border border-gray-200/50 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white text-gray-800 placeholder:text-gray-400"
                        placeholder="hello@example.com"
                        required
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1 flex items-center gap-2 group-focus-within:text-rose-500 transition-colors">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </label>
                      
                      
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-5 py-3 border border-gray-200/50 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white text-gray-800 placeholder:text-gray-400"
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                  </div>

                  {/* Date & Type Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1 flex items-center gap-2 group-focus-within:text-rose-500 transition-colors">
                        <Calendar className="w-4 h-4" />
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-5 py-3 border border-gray-200/50 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white text-gray-800 placeholder:text-gray-400"
                        required
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1 flex items-center gap-2 group-focus-within:text-rose-500 transition-colors">
                        <PartyPopper className="w-4 h-4" />
                        Event Type
                      </label>
                      <div className="relative">
                        <select
                          value={formData.eventType}
                          onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                          className="w-full px-5 py-3 border border-gray-200/50 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white text-gray-800 appearance-none cursor-pointer"
                          required
                        >
                          <option value="" disabled>Select Event Type</option>
                          <option value="Wedding">Wedding</option>
                          <option value="Reception">Reception</option>
                          <option value="Engagement">Engagement</option>
                          <option value="Anniversary">Anniversary</option>
                          <option value="Birthday">Birthday Party</option>
                          <option value="Corporate">Corporate Event</option>
                          <option value="Baby Shower">Baby Shower</option>
                          <option value="Pre Wedding">Pre Wedding</option>
                          <option value="Other">Other</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1 flex items-center gap-2 group-focus-within:text-rose-500 transition-colors">
                      <MessageSquare className="w-4 h-4" />
                       Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-5 py-3 border border-gray-200/50 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white text-gray-800 placeholder:text-gray-400 min-h-[100px] resize-none"
                      placeholder="Tell us a little about your dream event..."
                    />
                  </div>  
                    
                  {/* Cloudflare Turnstile Captcha */}
                  <div className="flex justify-center my-4">
                    <div ref={captchaRef}></div>
                  </div>

                  {/* Submit Button */}
                  {/* <motion.button
                    type="submit"
                    disabled={!formData.captchaToken}
                    whileHover={formData.captchaToken ? { scale: 1.02 } : {}}
                    whileTap={formData.captchaToken ? { scale: 0.98 } : {}}
                    className={`w-full py-4 rounded-xl font-medium tracking-wide flex items-center justify-center gap-2 mt-4 overflow-hidden relative transition-all duration-300 ${
                      formData.captchaToken
                        ? "bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 text-white shadow-lg hover:shadow-2xl hover:shadow-rose-200 cursor-pointer group"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed grayscale"
                    }`}
                  >
                     <span className="relative z-10 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Reserve Consultation
                    </span>
                    {formData.captchaToken && (
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                  </motion.button> */}

                  <p className="text-xs text-gray-400 text-center mt-4">
                    Strictly confidential & • No spam promise
                  </p>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
      </>
  );
}