import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export interface FilterValues {
  make: string;
  minPrice: string;
  maxPrice: string;
  year: string;
}

interface CarFiltersProps {
  filters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
  resultCount: number;
}

export default function CarFilters({ filters, onFilterChange, resultCount }: CarFiltersProps) {
  const makes = ["All", "Toyota", "Nissan", "Honda", "Hyundai", "Mazda", "Kia", "Mercedes-Benz"];
  const priceRanges = [
    { label: "All Prices", value: "all" },
    { label: "Under 15,000 JOD", value: "0-15000" },
    { label: "15,000 - 25,000 JOD", value: "15000-25000" },
    { label: "25,000 - 40,000 JOD", value: "25000-40000" },
    { label: "Above 40,000 JOD", value: "40000-999999" },
  ];
  const years = ["All", "2024", "2023", "2022", "2021", "2020"];

  const hasActiveFilters = filters.make !== "All" || filters.year !== "All" || filters.minPrice !== "all";

  const clearFilters = () => {
    onFilterChange({
      make: "All",
      minPrice: "all",
      maxPrice: "999999",
      year: "All",
    });
  };

  const activeFilterLabels: string[] = [];
  if (filters.make !== "All") activeFilterLabels.push(filters.make);
  if (filters.year !== "All") activeFilterLabels.push(filters.year);
  if (filters.minPrice !== "all") {
    const priceRange = priceRanges.find(r => r.value === `${filters.minPrice}-${filters.maxPrice}`);
    if (priceRange) activeFilterLabels.push(priceRange.label);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap flex-1 w-full">
          <Select
            value={filters.make}
            onValueChange={(value) => onFilterChange({ ...filters, make: value })}
          >
            <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-make">
              <SelectValue placeholder="Make/Brand" />
            </SelectTrigger>
            <SelectContent>
              {makes.map((make) => (
                <SelectItem key={make} value={make}>
                  {make}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={`${filters.minPrice}-${filters.maxPrice}`}
            onValueChange={(value) => {
              const [min, max] = value.split("-");
              onFilterChange({ ...filters, minPrice: min, maxPrice: max });
            }}
          >
            <SelectTrigger className="w-full sm:w-[200px]" data-testid="select-price">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              {priceRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.year}
            onValueChange={(value) => onFilterChange({ ...filters, year: value })}
          >
            <SelectTrigger className="w-full sm:w-[140px]" data-testid="select-year">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full sm:w-auto"
              data-testid="button-clear-filters"
            >
              Clear All
            </Button>
          )}
        </div>

        <div className="text-sm font-medium text-muted-foreground whitespace-nowrap" data-testid="text-result-count">
          {resultCount} {resultCount === 1 ? "vehicle" : "vehicles"} found
        </div>
      </div>

      {activeFilterLabels.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilterLabels.map((label, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {label}
              <X className="w-3 h-3" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
