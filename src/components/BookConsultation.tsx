import { motion } from "motion/react";
import Script from "next/script";
import { Calendar, Clock, User, Phone, Mail, MessageSquare, CircleCheck, PartyPopper } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// WhatsApp SVG icon (no extra package needed)
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.116 1.535 5.845L.057 23.492a.75.75 0 0 0 .904.964l5.805-1.524A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 0 1-4.962-1.358l-.355-.211-3.683.966.983-3.595-.232-.369A9.718 9.718 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
  </svg>
);

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

  
    <section className="py-10 md:py-16 relative overflow-hidden" id="consultation"
      style={{ background: "linear-gradient(135deg, var(--c-bg-soft) 0%, var(--c-bg) 50%, var(--c-bg-soft) 100%)" }}
    >
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
            {/* Mobile Improved Layout (Vertical Stack on Mobile) */}
            <div className="flex flex-col gap-3 md:block md:space-y-0 h-full">
              
              {/* Left Column: Header + Benefits */}
              <div className="w-full text-left md:text-left shrink-0">
                 <div className="inline-block px-2 py-0.5 md:px-4 md:py-1.5 mb-1.5 md:mb-4 rounded-full text-[9px] md:text-xs font-medium tracking-wide shadow-sm whitespace-nowrap" style={{ background: "var(--c-bg-soft)", color: "var(--c-primary)" }}>
                  ✨ Start Your Journey
                </div>
                
                <h2 className="text-[1.35rem] md:text-3xl font-serif mb-1.5 md:mb-4 leading-tight" style={{ color: "var(--c-footer-from)" }}>
                  Book Your <span style={{ color: "var(--c-primary)" }}>Free</span> Consultation
                </h2>
                
                <p className="block text-[11px] md:text-lg text-gray-600 mb-3 md:mb-6 leading-relaxed font-medium line-clamp-2 md:line-clamp-none">
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
                      <div className="w-3 h-3 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-rose-400 to-amber-400 flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5 md:mt-0">
                        <CircleCheck className="w-1.5 h-1.5 md:w-5 md:h-5 text-white" />
                      </div>
                      <span className="text-[10px] md:text-base text-gray-700 font-medium leading-tight">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Contact Info Card — bigger on mobile, 3 items */}
              <div className="w-full flex md:block self-stretch">
                <div className="w-full bg-white/95 backdrop-blur-md p-3 md:p-5 shadow-sm border border-rose-100/50 rounded-xl md:rounded-2xl relative overflow-hidden flex flex-col gap-2 md:gap-4">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-rose-100/50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 hidden md:block" />

                  {/* Phone */}
                  <a href="tel:9054718053"
                    className="flex items-center gap-3 md:gap-4 p-2.5 md:p-3 rounded-xl hover:bg-rose-50/60 active:bg-rose-100 transition-colors border border-transparent hover:border-rose-100">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 md:w-6 md:h-6 text-rose-500" />
                    </div>
                    <div>
                      <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wide font-bold mb-0.5">Call Us</p>
                      <span className="text-sm md:text-lg font-bold text-gray-900 leading-none">+91 90547 18053</span>
                    </div>
                  </a>

                  {/* WhatsApp */}
                  <a href="https://wa.me/919054718053?text=Hi%20Vindhya%20Events%2C%20I%20want%20to%20book%20a%20consultation!"
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 md:gap-4 p-2.5 md:p-3 rounded-xl hover:bg-green-50/60 active:bg-green-100 transition-colors border border-transparent hover:border-green-200">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                      <span className="text-green-500"><WhatsAppIcon /></span>
                    </div>
                    <div>
                      <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wide font-bold mb-0.5">WhatsApp</p>
                      <span className="text-sm md:text-lg font-bold text-gray-900 leading-none">Chat with Us</span>
                    </div>
                  </a>

                  {/* Email */}
                  <a href="mailto:vindhyaevent@gmail.com"
                    className="flex items-center gap-3 md:gap-4 p-2.5 md:p-3 rounded-xl hover:bg-rose-50/60 active:bg-rose-100 transition-colors border border-transparent hover:border-rose-100">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 md:w-6 md:h-6 text-rose-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wide font-bold mb-0.5">Email Us</p>
                      <span className="text-xs md:text-base font-bold text-gray-900 leading-none break-all">vindhyaevent@gmail.com</span>
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
              <div className="relative bg-white p-4 md:p-6 lg:p-8 shadow-2xl border border-gray-100 rounded-3xl">
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
                    className={`w-full py-3 md:py-4 rounded-full font-medium tracking-wide flex items-center justify-center gap-2 mt-2 md:mt-4 overflow-hidden relative transition-all duration-300 text-sm md:text-base ${
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
                    className="w-full py-3 rounded-full text-white font-medium shadow-md flex items-center justify-center gap-2 mt-2" style={{ background: `linear-gradient(to right, var(--c-primary), var(--c-primary-dark))` }}
                  >
                    <Phone className="w-4 h-4" />
                    Request Call Back
                  </motion.button>
                )}

                <p className="text-xs text-gray-500 text-center mt-2 font-medium">
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