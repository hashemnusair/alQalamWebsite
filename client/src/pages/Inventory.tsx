import { useState, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import CarFilters, { FilterValues, createDefaultFilterValues } from "@/components/CarFilters";
import { getCarSearchText } from "@/data/car-translations";
import { formatNumber } from "@/lib/locale";
import { useCars } from "@/hooks/useCars";

export default function Inventory() {
  const [filters, setFilters] = useState<FilterValues>(() => createDefaultFilterValues());
  const { t, i18n } = useTranslation();

  const { data: cars, isLoading, error } = useCars();
  const hasError = Boolean(error);
  const inventory = cars ?? [];

  const filteredCars = useMemo(() => {
    return inventory.filter((car) => {
      if (filters.makes.length > 0 && !filters.makes.includes(car.make)) return false;
      const price = parseFloat(car.price);
      if (price < filters.minPrice || price > filters.maxPrice) return false;
      const [minYear, maxYear] = filters.yearRange;
      if (car.year < minYear || car.year > maxYear) return false;
      const [minMileage, maxMileage] = filters.mileageRange;
      if (car.mileage < minMileage || car.mileage > maxMileage) return false;
      if (filters.fuelTypes.length > 0 && !filters.fuelTypes.includes(car.fuel)) return false;
      if (filters.search.trim()) {
        const term = filters.search.trim().toLowerCase();
        const haystack = getCarSearchText(car);
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  }, [filters, inventory]);

  const formattedTotalVehicles = formatNumber(inventory.length, i18n.language);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-white">
      <Header />
      <main className="pt-28 pb-20 flex-1">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">{t("inventory.eyebrow")}</p>
              <h1 className="text-4xl md:text-5xl font-bold">
                <Trans
                  i18nKey="inventory.heading"
                  components={{
                    highlight: (
                      <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent" />
                    ),
                  }}
                />
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                {t("inventory.description")}
              </p>
            </div>
            <div className="rounded-[28px] border border-white/15 bg-gradient-to-br from-[#050607] via-[#0a1019] to-[#050607] px-8 py-6 text-white shadow-[0_45px_85px_rgba(5,6,7,0.55)]">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">{t("inventory.availableLabel")}</p>
              <p className="text-3xl font-semibold">
                {isLoading
                  ? t("status.loadingInventory")
                  : hasError
                    ? t("status.errorInventory")
                    : t("inventory.availableCount", {
                      count: inventory.length,
                      formatted: formattedTotalVehicles,
                    })}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <CarFilters
              filters={filters}
              onFilterChange={setFilters}
              resultCount={filteredCars.length}
            />
          </div>

          {isLoading && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">{t("status.loadingInventory")}</p>
            </div>
          )}

          {hasError && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">{t("status.errorInventory")}</p>
            </div>
          )}

          {!isLoading && !hasError && filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : null}

          {!isLoading && !hasError && filteredCars.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                {inventory.length === 0
                  ? t("status.emptyInventory")
                  : t("inventory.emptyState")}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
