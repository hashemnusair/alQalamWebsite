import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import logoImage from "@assets/image_1763156274600.png";
import { useTranslation } from "react-i18next";
import LanguageToggle from "@/components/LanguageToggle";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", key: "home", testId: "home" },
  { href: "/inventory", key: "inventory", testId: "inventory" },
  { href: "/about", key: "about", testId: "about" },
];

export default function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = useMemo(
    () =>
      NAV_LINKS.map((link) => ({
        ...link,
        label: t(`nav.${link.key}`),
      })),
    [t],
  );

  const isActiveLink = (href: string) => {
    if (!location) return false;
    if (href === "/inventory") {
      return location.startsWith("/inventory") || location.startsWith("/car/");
    }
    return location === href;
  };

  const whatsappNumber = "+962791234567";
  const whatsappMessage = t("whatsapp.generalInquiry");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  const direction = i18n.dir();
  const contactAlignment = direction === "rtl" ? "mr-auto" : "ml-auto";
  
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b border-white/15 bg-gradient-to-b from-[#050607]/95 via-[#050608]/92 to-[#040406]/95 backdrop-blur-2xl transition-all duration-500 ${
        isScrolled ? "shadow-[0_20px_45px_rgba(0,0,0,0.65)]" : "shadow-[0_12px_30px_rgba(0,0,0,0.45)]"
      }`}
    >
      <div className="container mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative flex items-center h-20 pr-32 md:pr-40" dir={direction}>
          <a 
            href="/" 
            className="flex items-center gap-2 cursor-pointer flex-shrink-0" 
            data-testid="link-home"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/";
            }}
          >
            <img 
              src={logoImage} 
              alt={t("brand.name")} 
              className="h-12 w-12 object-contain"
            />
            <div className="text-xl font-bold tracking-tight" dir="auto">
              <span className="text-white">
                {t("brand.name")}
              </span>
            </div>
          </a>

          <nav className="hidden md:flex flex-1 items-center justify-center gap-6 px-6" dir={direction}>
            {navLinks.map((link) => {
              const isActive = isActiveLink(link.href);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = link.href;
                  }}
                  className={`group relative flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                    isActive
                      ? "border-white/30 bg-white/10 text-white shadow-[0_10px_35px_rgba(0,0,0,0.55)]"
                      : "border-transparent text-white/70 hover:border-white/15 hover:bg-white/5 hover:text-white"
                    }`}
                  data-testid={`link-${link.testId}`}
                >
                  <span
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                      isActive
                        ? "scale-100 opacity-100 bg-primary"
                        : "scale-50 opacity-0 bg-white/60 group-hover:scale-100 group-hover:opacity-100"
                    }`}
                    aria-hidden="true"
                  />
                  <span>{link.label}</span>
                </a>
              );
            })}
          </nav>

          <div
            className={cn(
              "hidden md:flex items-center gap-3",
              contactAlignment,
            )}
          >
            <Button asChild variant="default" data-testid="button-whatsapp-contact">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <SiWhatsapp className="w-4 h-4" />
                {t("actions.contact")}
              </a>
            </Button>
          </div>

          <div className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2">
            <LanguageToggle />
          </div>

          <button
            className="md:hidden p-2 ml-auto"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-gradient-to-b from-black/95 via-black/90 to-black/80 backdrop-blur-xl shadow-[0_35px_45px_rgba(0,0,0,0.65)]">
          <nav className="container mx-auto px-6 py-6 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <LanguageToggle />
              <Button
                asChild
                variant="default"
                data-testid="button-mobile-whatsapp"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <SiWhatsapp className="w-4 h-4" />
                  {t("actions.contact")}
                </a>
              </Button>
            </div>
            {navLinks.map((link) => {
              const isActive = isActiveLink(link.href);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    window.location.href = link.href;
                  }}
                  className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-base font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                    isActive
                      ? "border-primary/60 bg-primary/10 text-white shadow-[0_10px_35px_rgba(0,0,0,0.55)]"
                      : "border-white/10 text-white/80 hover:border-white/25 hover:bg-white/5 hover:text-white"
                  }`}
                  data-testid={`link-mobile-${link.testId}`}
                >
                  <span>{link.label}</span>
                  <span
                    className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? "scale-100 opacity-100 bg-primary"
                        : "scale-75 opacity-40 bg-white/60"
                    }`}
                    aria-hidden="true"
                  />
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
