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
  
  const [showFullForm, setShowFullForm] = useState(false);

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
  
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.captchaToken) {
      alert("Please complete the captcha verification.");
      return;
    }
    // Handle form submission
         

    try { 
        
        let request =    await fetch("/api/bookconsultation" ,{
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(formData)
                  })  ; 
         
                  console.log("response form submit" , request)
                   
    } catch (error) {
         
       console.log("error formsubmit" , error)

    }
  


                  

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

  
    <section className="py-10 md:py-16 bg-gradient-to-br from-rose-50/20 via-white/10 to-amber-50/5 relative overflow-hidden backdrop-blur-sm" id="consultation">
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
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Mobile Improved Layout (Side-by-Side Row) */}
            <div className="flex flex-row md:block gap-2 items-center md:space-y-0 h-full">
              
              {/* Left Column: Header + Benefits */}
              <div className="w-[52%] md:w-full text-left md:text-left shrink-0">
                 <div className="inline-block px-2 py-0.5 md:px-4 md:py-1.5 bg-gradient-to-r from-rose-100 to-amber-100 text-rose-600 mb-1.5 md:mb-4 rounded-full text-[9px] md:text-xs font-medium tracking-wide shadow-sm whitespace-nowrap">
                  ✨ Start Your Journey
                </div>
                
                <h2 className="text-xs md:text-3xl font-serif text-rose-900 mb-2 md:mb-4 leading-tight">
                  Book Your <span className="text-rose-500">Free</span> <br className="md:hidden" /> Consultation
                </h2>
                
                <p className="hidden lg:block text-gray-600 text-lg mb-6 leading-relaxed">
                  Let's discuss your dream wedding and how we can make it a reality. Our expert planners are ready to bring your vision to life.
                </p>

               {/* Benefits (Compact List) */}
                <div className="flex flex-col gap-1 md:block md:space-y-3 mb-0 md:mb-6">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="flex items-start gap-1.5 md:align-center md:gap-3 bg-transparent md:bg-white/10 md:backdrop-blur-sm p-0 md:p-2 rounded-none md:rounded-lg"
                    >
                      <div className="w-3.5 h-3.5 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-rose-400 to-amber-400 flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5 md:mt-0">
                        <CircleCheck className="w-2 h-2 md:w-5 md:h-5 text-white" />
                      </div>
                      <span className="text-[9px] md:text-base text-gray-700 font-medium leading-tight">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right Column: Contact Info Card (Slim Vertical) */}
              <div className="w-[48%] md:w-full flex md:block self-stretch">
                 <div className="w-full bg-white/90 backdrop-blur-md p-2 md:p-5 shadow-sm md:shadow-xl border border-rose-100/50 rounded-lg md:rounded-2xl relative overflow-hidden flex flex-col justify-center h-full gap-2 md:gap-4">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-rose-100/50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 hidden md:block" />
                     
                     {/* Phone */}
                   <a href="tel:9054718053" className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-4 p-1.5 md:p-3 rounded-lg md:rounded-xl hover:bg-rose-50/50 transition-colors border border-transparent hover:border-rose-100">
                      <div className="flex items-center gap-1.5 md:gap-0">
                        <div className="w-5 h-5 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center shrink-0">
                          <Phone  className="w-2.5 h-2.5 md:w-6 md:h-6 text-rose-500" />
                        </div>
                        <p className="md:hidden text-[9px] text-gray-500 uppercase tracking-wider font-semibold">Call us</p>
                      </div>
                      <div>
                        <p className="hidden md:block text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">Call us</p>
                        <span className="text-[10px] md:text-lg font-bold text-gray-900 block md:inline">+91 90547 18053</span>
                      </div>
                   </a>

                    {/* Email */}
                   <a href="mailto:vindhyaevent@gmail.com" className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-4 p-1.5 md:p-3 rounded-lg md:rounded-xl hover:bg-rose-50/50 transition-colors border border-transparent hover:border-rose-100 overflow-hidden">
                      <div className="flex items-center gap-1.5 md:gap-0">
                        <div className="w-5 h-5 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center shrink-0">
                          <Mail className="w-2.5 h-2.5 md:w-6 md:h-6 text-rose-500" />
                        </div>
                        <p className="md:hidden text-[9px] text-gray-500 uppercase tracking-wider font-semibold">Email us</p>
                      </div>
                      <div className="w-full">
                         <p className="hidden md:block text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">Email us</p>
                        <span className="text-[10px] md:text-base font-bold text-gray-900 truncate block">vindhyaevent@gmail.com</span>
                      </div>
                   </a>
                 </div>
              </div>

            </div>
          </motion.div>
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
              <div className="relative bg-white/20 backdrop-blur-xl p-4 md:p-6 lg:p-8 shadow-2xl border border-white/20 rounded-2xl">
                <form onSubmit={handleSubmit} className="space-y-3 md:space-y-5">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-serif text-gray-900 mb-2">Let's Plan Your Day</h3>
                    <p className="text-gray-500 text-sm">Fill in the details below to get started</p>
                  </div>

                  {/* Basic Info (Always Visible) */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-1 ml-1 flex items-center gap-2 group-focus-within:text-rose-500 transition-colors">
                        <User className="w-4 h-4" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200/50 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white text-gray-800 placeholder:text-gray-400 text-sm"
                        placeholder="Your Name"
                        required
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-1 ml-1 flex items-center gap-2 group-focus-within:text-rose-500 transition-colors">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200/50 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white text-gray-800 placeholder:text-gray-400 text-sm"
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                  </div>

                  {/* Toggle Button for Full Form */}
                  {!showFullForm && (
                     <motion.button
                      type="button"
                      onClick={() => setShowFullForm(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 rounded-xl border-2 border-dashed border-rose-300 text-rose-500 font-medium hover:bg-rose-50 transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Book Consultation with Customized Day
                    </motion.button>
                  )}

                  {/* Full Fields (Hidden initially) */}
                  <motion.div
                    initial={false}
                    animate={{ height: showFullForm ? "auto" : 0, opacity: showFullForm ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden space-y-4"
                  >
                     {/* Email */}
                    <div className="group pt-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1 ml-1 flex items-center gap-2 group-focus-within:text-rose-500 transition-colors">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200/50 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white text-gray-800 placeholder:text-gray-400 text-sm"
                        placeholder="hello@example.com"
                        // required={showFullForm} // Only required if form is expanded
                      />
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
                        className="w-full px-4 py-2 md:px-5 md:py-3 border border-gray-200/50 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white text-gray-800 placeholder:text-gray-400 text-sm md:text-base"
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
                          className="w-full px-4 py-2 md:px-5 md:py-3 border border-gray-200/50 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white text-gray-800 appearance-none cursor-pointer text-sm md:text-base"
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
                      className="w-full px-4 py-2 md:px-5 md:py-3 border border-gray-200/50 rounded-xl focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white text-gray-800 placeholder:text-gray-400 min-h-[80px] md:min-h-[100px] resize-none text-sm md:text-base"
                      placeholder="Tell us a little about your dream event..."
                    />
                  </div>  
                    
                
                  {/* Cloudflare Turnstile Captcha */}
                  <div className="flex justify-center my-4">
                    <div ref={captchaRef}></div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={!formData.captchaToken}
                    whileHover={formData.captchaToken ? { scale: 1.02 } : {}}
                    whileTap={formData.captchaToken ? { scale: 0.98 } : {}}
                    className={`w-full py-3 md:py-4 rounded-xl font-medium tracking-wide flex items-center justify-center gap-2 mt-2 md:mt-4 overflow-hidden relative transition-all duration-300 text-sm md:text-base ${
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
                  </motion.button>
                  
                </motion.div> { /* End of Expandable Section */ }

                {/* Show simplified submit button if form is NOT expanded */}
                {!showFullForm && (
                   <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-medium shadow-md flex items-center justify-center gap-2 mt-2"
                  >
                    <Phone className="w-4 h-4" />
                    Request Call Back
                  </motion.button>
                )}

                <p className="text-xs text-gray-400 text-center mt-2">
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