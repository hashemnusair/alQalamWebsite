import CarCard from "./CarCard";
import type { Car } from "@shared/schema";
import { useTranslation } from "react-i18next";

interface FeaturedCarsProps {
  cars: Car[];
}

export default function FeaturedCars({ cars }: FeaturedCarsProps) {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("home.featured.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("home.featured.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
}
