import { Link } from "wouter";
import { SiWhatsapp, SiFacebook, SiInstagram } from "react-icons/si";
import { Mail, Phone, MapPin } from "lucide-react";
import logoImage from "@assets/image_1763156274600.png";

export default function Footer() {
  const whatsappNumber = "+962791234567";

  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src={logoImage} 
                alt="Al Qalam Motors" 
                className="h-12 w-12 object-contain"
              />
              <div className="text-xl font-bold">Al Qalam Motors</div>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Your trusted destination for premium vehicles in Amman, Jordan. Quality cars, exceptional service, competitive prices.
            </p>
            <div className="flex gap-4">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-md bg-gradient-to-br from-[#00a884] to-[#25D366] hover:from-[#008c6f] hover:to-[#20BD5A] flex items-center justify-center transition-all shadow-md"
                data-testid="link-footer-whatsapp"
              >
                <SiWhatsapp className="w-4 h-4 text-white" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-md bg-primary hover:bg-primary/90 flex items-center justify-center transition-colors"
                data-testid="link-footer-facebook"
              >
                <SiFacebook className="w-4 h-4 text-white" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-md bg-primary hover:bg-primary/90 flex items-center justify-center transition-colors"
                data-testid="link-footer-instagram"
              >
                <SiInstagram className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <nav className="flex flex-col gap-3">
              <a 
                href="/"
                className="text-muted-foreground hover:text-primary transition-colors cursor-pointer" 
                data-testid="link-footer-home"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  window.location.href = "/";
                }}
              >
                Home
              </a>
              <a 
                href="/inventory"
                className="text-muted-foreground hover:text-primary transition-colors cursor-pointer" 
                data-testid="link-footer-inventory"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  window.location.href = "/inventory";
                }}
              >
                Inventory
              </a>
              <a 
                href="/about"
                className="text-muted-foreground hover:text-primary transition-colors cursor-pointer" 
                data-testid="link-footer-about"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  window.location.href = "/about";
                }}
              >
                About & Contact
              </a>
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="flex flex-col gap-3 text-muted-foreground">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="text-sm">Mecca Street, Amman, Jordan</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 shrink-0" />
                <a href="tel:+962791234567" className="text-sm hover:text-primary transition-colors">
                  +962 79 123 4567
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 shrink-0" />
                <a
                  href="mailto:info@alqalammotors.jo"
                  className="text-sm hover:text-primary transition-colors"
                >
                  info@alqalammotors.jo
                </a>
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Sunday - Thursday: 9:00 AM - 8:00 PM</p>
              <p>Friday - Saturday: 10:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Al Qalam Motors. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
