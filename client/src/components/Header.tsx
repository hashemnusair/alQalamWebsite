import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import logoImage from "@assets/image_1763156274600.png";

export default function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/inventory", label: "Inventory" },
    { href: "/about", label: "About" },
  ];

  const whatsappNumber = "+962791234567";
  const whatsappMessage = "Hello! I'm interested in learning more about your vehicles.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const isHomePage = location === "/";
  
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHomePage 
          ? "bg-background border-b shadow-sm" 
          : "bg-background/80 backdrop-blur-md border-b border-white/10"
      }`}
    >
      <div className="container mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a 
            href="/" 
            className="flex items-center gap-2 cursor-pointer" 
            data-testid="link-home"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/";
            }}
          >
            <img 
              src={logoImage} 
              alt="Al Qalam Motors" 
              className="h-12 w-12 object-contain"
            />
            <div className="text-xl font-bold tracking-tight">
              <span className={isScrolled || !isHomePage ? "text-foreground" : "text-white"}>
                Al Qalam Motors
              </span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = link.href;
                }}
                className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${
                  location === link.href
                    ? "text-primary"
                    : isScrolled || !isHomePage
                    ? "text-foreground"
                    : "text-white"
                }`}
                data-testid={`link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button
              asChild
              variant="default"
              data-testid="button-whatsapp-contact"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <SiWhatsapp className="w-4 h-4 mr-2" />
                Contact Us
              </a>
            </Button>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMobileMenuOpen ? (
              <X className={`w-6 h-6 ${isScrolled || !isHomePage ? "text-foreground" : "text-white"}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled || !isHomePage ? "text-foreground" : "text-white"}`} />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b">
          <nav className="container mx-auto px-6 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  window.location.href = link.href;
                }}
                className={`text-base font-medium transition-colors hover:text-primary cursor-pointer ${
                  location === link.href ? "text-primary" : "text-foreground"
                }`}
                data-testid={`link-mobile-${link.label.toLowerCase()}`}
              >
                {link.label}
              </a>
            ))}
            <Button
              asChild
              variant="default"
              className="w-full"
              data-testid="button-mobile-whatsapp"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <SiWhatsapp className="w-4 h-4 mr-2" />
                Contact Us
              </a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
