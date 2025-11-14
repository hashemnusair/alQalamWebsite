import { useState } from "react";
import CarFilters, { FilterValues } from "../CarFilters";

export default function CarFiltersExample() {
  const [filters, setFilters] = useState<FilterValues>({
    make: "All",
    minPrice: "all",
    maxPrice: "999999",
    year: "All",
  });

  return (
    <div className="p-8">
      <CarFilters
        filters={filters}
        onFilterChange={setFilters}
        resultCount={8}
      />
    </div>
  );
}
