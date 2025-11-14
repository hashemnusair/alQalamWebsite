import { useState } from "react";
import { useRoute } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SiWhatsapp } from "react-icons/si";
import { ChevronLeft, Gauge, Settings, Fuel, Zap, Calendar, Palette } from "lucide-react";
import { Link } from "wouter";
import { mockCars } from "@/data/cars";

export default function CarDetails() {
  const [, params] = useRoute("/car/:id");
  const car = mockCars.find((c) => c.id === params?.id);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!car) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="pt-24 pb-16 flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Vehicle not found</h1>
            <Button asChild variant="default">
              <a 
                href="/inventory"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/inventory";
                }}
              >
                Back to Inventory
              </a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const whatsappNumber = "+962791234567";
  const whatsappMessage = `Hello, I'm interested in ${car.title} - ${car.year}. Is it still available?`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const specs = [
    { icon: Calendar, label: "Year", value: car.year },
    { icon: Gauge, label: "Mileage", value: `${car.mileage.toLocaleString()} km` },
    { icon: Settings, label: "Gearbox", value: car.gearbox },
    { icon: Fuel, label: "Fuel Type", value: car.fuel },
    { icon: Zap, label: "Drive", value: car.drive },
    { icon: Palette, label: "Color", value: car.color },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="pt-24 pb-16 flex-1">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <Button
            asChild
            variant="ghost"
            className="mb-6"
            data-testid="button-back-to-inventory"
          >
            <a 
              href="/inventory"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/inventory";
              }}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Inventory
            </a>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <div className="aspect-[4/3] rounded-md overflow-hidden bg-muted mb-4">
                <img
                  src={car.images[selectedImage]}
                  alt={car.title}
                  className="w-full h-full object-cover"
                  data-testid="img-car-main"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {car.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-[4/3] rounded-md overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-transparent hover:border-border"
                    }`}
                    data-testid={`button-thumbnail-${index}`}
                  >
                    <img
                      src={image}
                      alt={`${car.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:sticky lg:top-24 lg:h-fit">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-car-title">
                    {car.title}
                  </h1>
                  <p className="text-lg text-muted-foreground">{car.year}</p>
                </div>
                <Badge variant="secondary" className="text-base">
                  {car.origin}
                </Badge>
              </div>

              <div className="text-4xl font-bold text-primary mb-6" data-testid="text-car-price">
                {car.price} {car.currency}
              </div>

              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Specifications</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {specs.map((spec, index) => {
                      const Icon = spec.icon;
                      return (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">{spec.label}</p>
                            <p className="text-sm font-medium">{spec.value}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                        <Settings className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Engine</p>
                        <p className="text-sm font-medium">{car.engine}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{car.description}</p>
              </div>

              <Button
                asChild
                size="lg"
                className="w-full text-base font-semibold"
                data-testid="button-whatsapp-inquiry"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <SiWhatsapp className="w-5 h-5 mr-2" />
                  Inquire via WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
