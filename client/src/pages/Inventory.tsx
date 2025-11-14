import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import CarFilters, { FilterValues } from "@/components/CarFilters";
import { mockCars } from "@/data/cars";

export default function Inventory() {
  const [filters, setFilters] = useState<FilterValues>({
    make: "All",
    minPrice: "all",
    maxPrice: "999999",
    year: "All",
  });

  const filteredCars = useMemo(() => {
    return mockCars.filter((car) => {
      if (filters.make !== "All" && car.make !== filters.make) return false;
      if (filters.year !== "All" && car.year.toString() !== filters.year) return false;
      if (filters.minPrice !== "all") {
        const price = parseFloat(car.price);
        const min = parseFloat(filters.minPrice);
        const max = parseFloat(filters.maxPrice);
        if (price < min || price > max) return false;
      }
      return true;
    });
  }, [filters]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="pt-24 pb-16 flex-1">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our <span className="text-primary">Inventory</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Browse our collection of premium vehicles
            </p>
          </div>

          <div className="mb-8">
            <CarFilters
              filters={filters}
              onFilterChange={setFilters}
              resultCount={filteredCars.length}
            />
          </div>

          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                No vehicles match your filters. Try adjusting your search criteria.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
