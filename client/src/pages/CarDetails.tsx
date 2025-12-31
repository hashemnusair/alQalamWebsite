import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SiWhatsapp } from "react-icons/si";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Fuel,
  Gauge,
  Palette,
  Settings,
  Zap,
} from "lucide-react";
import { formatNumber, isRTL, toTranslationKey } from "@/lib/locale";
import { useCar } from "@/hooks/useCars";
import { getCarImages } from "@/lib/car-images";

export default function CarDetails() {
  const [, params] = useRoute("/car/:id");
  const carId = params?.id;
  const { data: car, isLoading, error } = useCar(carId);
  const [selectedImage, setSelectedImage] = useState(0);
  const { t, i18n } = useTranslation();
  const rtl = isRTL(i18n.language);

  useEffect(() => {
    setSelectedImage(0);
  }, [car?.id]);

  const renderStatusPage = (message: string, showBackButton = false) => (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="pt-24 pb-16 flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">{message}</h1>
          {showBackButton && (
            <Button asChild variant="default">
              <a
                href="/inventory"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/inventory";
                }}
              >
                {t("actions.backToInventory")}
              </a>
            </Button>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );

  if (isLoading) {
    return renderStatusPage(t("status.loadingInventory"));
  }

  const queryError = error instanceof Error ? error : undefined;
  const isNotFoundError = queryError?.message.startsWith("404");

  if (isNotFoundError) {
    return renderStatusPage(t("carDetails.notFoundTitle"), true);
  }

  if (queryError) {
    return renderStatusPage(t("status.errorInventory"), true);
  }

  if (!car) {
    return renderStatusPage(t("carDetails.notFoundTitle"), true);
  }

  const carImages = getCarImages(car);
  const imageCount = carImages.length;
  const safeSelectedImage = imageCount ? Math.min(selectedImage, imageCount - 1) : 0;
  const mainImage = imageCount ? carImages[safeSelectedImage] : undefined;
  const whatsappNumber = "+962791234567";
  const whatsappMessage = t("whatsapp.carInterest", {
    model: car.title,
    year: car.year,
  });
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  const price = formatNumber(car.price, i18n.language, {
    maximumFractionDigits: 0,
  });
  const currencyLabel = t(`vehicle.currency.${toTranslationKey(car.currency)}`, {
    defaultValue: car.currency,
  });
  const originLabel = t(`vehicle.origin.${toTranslationKey(car.origin)}`, {
    defaultValue: car.origin,
  });
  const formattedYear = formatNumber(car.year, i18n.language, { useGrouping: false });

  const formattedMileage = formatNumber(car.mileage, i18n.language);
  const specs = [
    {
      icon: Calendar,
      label: t("carDetails.specs.year"),
      value: formattedYear,
    },
    {
      icon: Gauge,
      label: t("carDetails.specs.mileage"),
      value: t("vehicle.mileage.short", { value: formattedMileage }),
    },
    {
      icon: Settings,
      label: t("carDetails.specs.gearbox"),
      value: t(`vehicle.gearbox.${toTranslationKey(car.gearbox)}`, { defaultValue: car.gearbox }),
    },
    {
      icon: Fuel,
      label: t("carDetails.specs.fuel"),
      value: t(`vehicle.fuel.${toTranslationKey(car.fuel)}`, { defaultValue: car.fuel }),
    },
    {
      icon: Zap,
      label: t("carDetails.specs.drive"),
      value: t(`vehicle.drive.${toTranslationKey(car.drive)}`, { defaultValue: car.drive }),
    },
    {
      icon: Palette,
      label: t("carDetails.specs.color"),
      value: t(`vehicle.colors.${toTranslationKey(car.color)}`, { defaultValue: car.color }),
    },
    {
      icon: CircleDot,
      label: t("carDetails.specs.engine"),
      value: car.engine,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-slate-50 via-white to-white pt-28 pb-20">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <Button
            asChild
            variant="ghost"
            className="mb-8 rounded-full border border-slate-200/70 bg-white/80 px-6 py-2 text-sm font-semibold text-slate-700 shadow-[0_18px_38px_rgba(15,23,42,0.08)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:text-slate-900"
            data-testid="button-back-to-inventory"
          >
            <a
              href="/inventory"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/inventory";
              }}
            >
              {rtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              {t("actions.backToInventory")}
            </a>
          </Button>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
            <div>
              <div className="relative mb-5 rounded-[32px] border border-white/60 bg-white/80 p-2 shadow-[0_40px_65px_rgba(15,23,42,0.18)]">
                <div className="aspect-[4/3] overflow-hidden rounded-[26px] bg-muted">
                  {mainImage ? (
                    <img
                      src={mainImage}
                      alt={car.title}
                      className="h-full w-full object-cover"
                      data-testid="img-car-main"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-sm font-semibold text-slate-500">
                      {t("carDetails.noImagePlaceholder")}
                    </div>
                  )}
                </div>
              </div>
              {imageCount > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {carImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-[4/3] overflow-hidden rounded-2xl border transition-all ${safeSelectedImage === index
                          ? "border-primary shadow-[0_15px_30px_rgba(15,23,42,0.18)]"
                          : "border-transparent hover:border-white/70"
                        }`}
                      data-testid={`button-thumbnail-${index}`}
                      aria-label={t("carDetails.thumbnailLabel", { model: car.title, index: index + 1 })}
                    >
                      <img
                        src={image}
                        alt={`${car.title} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:sticky lg:top-28 lg:h-fit">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-car-title">
                    {car.title}
                  </h1>
                  <p className="text-lg text-muted-foreground">{formattedYear}</p>
                </div>
                <Badge variant="secondary" className="text-base">
                  {originLabel}
                </Badge>
              </div>

              <div
                className="mb-8 inline-flex flex-wrap items-baseline gap-2 rounded-3xl border border-white/40 bg-white/85 px-6 py-4 text-slate-900 shadow-[0_25px_55px_rgba(15,23,42,0.12)]"
                data-testid="text-car-price"
              >
                <span className="text-4xl font-black">{price}</span>
                <span className="text-lg font-semibold text-slate-500">{currencyLabel}</span>
              </div>

              <Card className="mb-6 rounded-[32px] border-white/60 bg-white/90 shadow-[0_45px_85px_rgba(15,23,42,0.18)] backdrop-blur">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{t("carDetails.specsTitle")}</h2>
                    <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                      {t("carDetails.specsSubtitle")}
                    </span>
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {specs.map((spec, index) => {
                      const Icon = spec.icon;
                      return (
                        <div
                          key={index}
                          className="group flex items-center gap-3 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 shadow-[0_10px_25px_rgba(15,23,42,0.08)] transition-colors"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                              {spec.label}
                            </p>
                            <p className="text-sm font-semibold text-foreground">{spec.value}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6 rounded-3xl border-white/50 bg-white/90 shadow-[0_35px_60px_rgba(15,23,42,0.12)]">
                <CardContent className="p-8">
                  <h2 className="text-xl font-semibold mb-3">{t("carDetails.descriptionTitle")}</h2>
                  <p className="text-base leading-relaxed text-muted-foreground">{car.description}</p>
                </CardContent>
              </Card>

              <Button
                asChild
                size="lg"
                className="w-full text-base font-semibold border-[#1AA956] bg-gradient-to-r from-[#25D366] via-[#20C15A] to-[#1ABF60] text-white shadow-[0_30px_65px_rgba(32,178,87,0.35)] hover:-translate-y-0.5 hover:shadow-[0_40px_75px_rgba(32,178,87,0.4)]"
                data-testid="button-whatsapp-inquiry"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <SiWhatsapp className="w-5 h-5" />
                  {t("actions.inquireWhatsapp")}
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
