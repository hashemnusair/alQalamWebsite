import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gauge, Fuel, Settings, Zap } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import type { Car } from "@shared/schema";
import { useTranslation } from "react-i18next";
import { formatNumber, toTranslationKey } from "@/lib/locale";
import { getCarImages } from "@/lib/car-images";

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  const whatsappNumber = "+962791234567";
  const { t, i18n } = useTranslation();
  const whatsappMessage = t("whatsapp.carInterest", {
    model: car.title,
    year: car.year,
  });
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  const price = formatNumber(car.price, i18n.language, {
    maximumFractionDigits: 0,
  });
  const mileage = formatNumber(car.mileage, i18n.language);
  const year = formatNumber(car.year, i18n.language, { useGrouping: false });
  const currencyLabel = t(`vehicle.currency.${toTranslationKey(car.currency)}`, {
    defaultValue: car.currency,
  });
  const originLabel = t(`vehicle.origin.${toTranslationKey(car.origin)}`, {
    defaultValue: car.origin,
  });
  const carImages = getCarImages(car);
  const primaryImage = carImages[0];

  return (
    <Card className="overflow-hidden hover-elevate group" data-testid={`card-car-${car.id}`}>
      <a
        href={`/car/${car.id}`}
        onClick={(e) => {
          e.preventDefault();
          window.location.href = `/car/${car.id}`;
        }}
        className="block cursor-pointer"
      >
        <div className="aspect-[4/3] overflow-hidden bg-muted">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={car.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              data-testid={`img-car-${car.id}`}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-sm font-medium text-slate-500">
              {t("carCard.imagePlaceholder")}
            </div>
          )}
        </div>
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-1" data-testid={`text-car-title-${car.id}`}>
                {car.title}
              </h3>
              <p className="text-sm text-muted-foreground">{year}</p>
            </div>
            <Badge variant="secondary" className="text-sm font-semibold shrink-0">
              {originLabel}
            </Badge>
          </div>
          <div className="text-2xl font-bold text-primary mb-4" data-testid={`text-car-price-${car.id}`}>
            {price} {currencyLabel}
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Gauge className="w-4 h-4" />
              <span>{t("vehicle.mileage.short", { value: mileage })}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Settings className="w-4 h-4" />
              <span>
                {t(`vehicle.gearbox.${toTranslationKey(car.gearbox)}`, {
                  defaultValue: car.gearbox,
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Fuel className="w-4 h-4" />
              <span>
                {t(`vehicle.fuel.${toTranslationKey(car.fuel)}`, {
                  defaultValue: car.fuel,
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="w-4 h-4" />
              <span>
                {t(`vehicle.drive.${toTranslationKey(car.drive)}`, {
                  defaultValue: car.drive,
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </a>
      <CardFooter className="p-6 pt-0 flex gap-3">
        <Button
          asChild
          variant="default"
          className="flex-1"
          data-testid={`button-view-details-${car.id}`}
        >
          <a
            href={`/car/${car.id}`}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/car/${car.id}`;
            }}
          >
            {t("actions.viewDetails")}
          </a>
        </Button>
        <Button
          asChild
          variant="outline"
          size="icon"
          className="shrink-0 border-white/70 bg-white text-[#25D366] shadow-[0_14px_28px_rgba(0,0,0,0.18)] hover:bg-white/95 hover:text-[#1DA955]"
          data-testid={`button-whatsapp-${car.id}`}
        >
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label={t("carCard.whatsappLabel")}>
            <SiWhatsapp className="w-4 h-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
