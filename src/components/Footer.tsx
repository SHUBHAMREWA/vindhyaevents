import { Heart, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  const quickLinks = [
    "Home",
    "Services",
    "Gallery",
    "About Us",
    "Contact",
    "Blog",
    "FAQ",
    "Testimonials",
  ];

  return (
    <footer className="bg-gradient-to-b from-rose-900/40 to-rose-950/50 backdrop-blur-sm text-white" id="contact">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Tagline */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-8 h-8 text-rose-400 fill-rose-400" />
              <span className="text-white">Eternal Moments</span>
            </div>
            <p className="text-rose-200 text-sm leading-relaxed">
              Creating timeless memories and celebrating love stories since 2013.
              Your dream wedding starts here.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.slice(0, 4).map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(" ", "-")}`}
                    className="text-rose-200 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-4">More</h4>
            <ul className="space-y-2">
              {quickLinks.slice(4).map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(" ", "-")}`}
                    className="text-rose-200 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white mb-4">Get in Touch</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-rose-400 mt-1 flex-shrink-0" />
                <p className="text-rose-200">+1 (555) 123-4567</p>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-rose-400 mt-1 flex-shrink-0" />
                <p className="text-rose-200">hello@eternalmoments.com</p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-rose-400 mt-1 flex-shrink-0" />
                <p className="text-rose-200">
                  123 Wedding Avenue, Suite 400
                  <br />
                  New York, NY 10001
                </p>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-rose-800 hover:bg-rose-700 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-rose-800 hover:bg-rose-700 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-rose-800 hover:bg-rose-700 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-rose-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-rose-300">
            <p>© 2024 Eternal Moments. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
