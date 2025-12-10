import { useState } from "react";
import CarFilters, { FilterValues, createDefaultFilterValues } from "../CarFilters";

export default function CarFiltersExample() {
  const [filters, setFilters] = useState<FilterValues>(() => createDefaultFilterValues());

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
