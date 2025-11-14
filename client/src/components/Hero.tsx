import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { SiWhatsapp } from "react-icons/si";
import heroImage from "@assets/image_1763156214950.png";

export default function Hero() {
  const whatsappNumber = "+962791234567";
  const whatsappMessage = "Hello! I'm interested in learning more about your vehicles.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      </div>

      <div className="relative z-10 container mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            Premium Vehicles in <span className="text-gray-300">Amman</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl leading-relaxed">
            Discover exceptional quality cars from trusted brands. Your journey to finding the perfect vehicle starts here at Al Qalam Motors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              variant="default"
              className="text-base font-semibold"
              data-testid="button-browse-inventory"
            >
              <a 
                href="/inventory"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/inventory";
                }}
              >
                Browse Inventory
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base font-semibold bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20"
              data-testid="button-hero-whatsapp"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <SiWhatsapp className="w-5 h-5 mr-2" />
                WhatsApp Us
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
