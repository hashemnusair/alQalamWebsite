import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Gauge, Fuel, Settings, Zap } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import type { Car } from "@shared/schema";

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  const whatsappNumber = "+962791234567";
  const whatsappMessage = `Hello, I'm interested in ${car.title} - ${car.year}. Is it still available?`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <Card className="overflow-hidden hover-elevate group" data-testid={`card-car-${car.id}`}>
      <Link href={`/car/${car.id}`}>
        <div className="cursor-pointer">
          <div className="aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={car.images[0]}
              alt={car.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              data-testid={`img-car-${car.id}`}
            />
          </div>
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-1" data-testid={`text-car-title-${car.id}`}>
                  {car.title}
                </h3>
                <p className="text-sm text-muted-foreground">{car.year}</p>
              </div>
              <Badge variant="secondary" className="text-sm font-semibold shrink-0">
                {car.origin}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-primary mb-4" data-testid={`text-car-price-${car.id}`}>
              {car.price} {car.currency}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Gauge className="w-4 h-4" />
                <span>{car.mileage.toLocaleString()} km</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Settings className="w-4 h-4" />
                <span>{car.gearbox}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Fuel className="w-4 h-4" />
                <span>{car.fuel}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Zap className="w-4 h-4" />
                <span>{car.drive}</span>
              </div>
            </div>
          </CardContent>
        </div>
      </Link>
      <CardFooter className="p-6 pt-0 flex gap-3">
        <Button
          asChild
          variant="default"
          className="flex-1"
          data-testid={`button-view-details-${car.id}`}
        >
          <Link href={`/car/${car.id}`}>
            <a>View Details</a>
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="icon"
          className="shrink-0 bg-[#25D366]/10 border-[#25D366]/30 hover:bg-[#25D366]/20"
          data-testid={`button-whatsapp-${car.id}`}
        >
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <SiWhatsapp className="w-4 h-4 text-[#25D366]" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
