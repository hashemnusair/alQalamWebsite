import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Banknote, Calendar, ChevronDown, Gauge, RotateCcw, Search, Sparkles, X } from "lucide-react";
import { SiAudi, SiBmw, SiLandrover, SiMercedes, SiPorsche, SiToyota } from "react-icons/si";

const CURRENT_YEAR = new Date().getFullYear();
const PRICE_BOUNDS = { min: 5000, max: 250000 };
const YEAR_BOUNDS = { min: CURRENT_YEAR - 12, max: CURRENT_YEAR };
const MILEAGE_BOUNDS = { min: 0, max: 250000 };

const MAKE_OPTIONS = [
  "Audi",
  "BMW",
  "Chevrolet",
  "Ford",
  "Land Rover",
  "Lexus",
  "Mazda",
  "Mercedes-Benz",
  "Nissan",
  "Porsche",
  "Toyota",
];

const PRICE_PRESETS = [
  { labelKey: "carFilters.pricePresets.under65k", range: [PRICE_BOUNDS.min, 65000] as [number, number] },
  { labelKey: "carFilters.pricePresets.between65And100", range: [65000, 100000] as [number, number] },
  { labelKey: "carFilters.pricePresets.between100And200", range: [100000, 200000] as [number, number] },
  { labelKey: "carFilters.pricePresets.above200", range: [200000, PRICE_BOUNDS.max] as [number, number] },
];

const YEAR_PRESETS = [
  { labelKey: "carFilters.yearPresets.recent", range: [Math.max(YEAR_BOUNDS.max - 2, YEAR_BOUNDS.min), YEAR_BOUNDS.max] as [number, number] },
  { labelKey: "carFilters.yearPresets.since2018", range: [Math.max(2018, YEAR_BOUNDS.min), YEAR_BOUNDS.max] as [number, number] },
  { labelKey: "carFilters.yearPresets.from2014To2019", range: [Math.max(2014, YEAR_BOUNDS.min), Math.min(2019, YEAR_BOUNDS.max)] as [number, number] },
];

const MILEAGE_PRESETS = [
  { labelKey: "carFilters.mileagePresets.under25k", range: [MILEAGE_BOUNDS.min, 25000] as [number, number] },
  { labelKey: "carFilters.mileagePresets.between25And60", range: [25000, 60000] as [number, number] },
  { labelKey: "carFilters.mileagePresets.between60And120", range: [60000, 120000] as [number, number] },
  { labelKey: "carFilters.mileagePresets.above120", range: [120000, MILEAGE_BOUNDS.max] as [number, number] },
];

const FUEL_OPTIONS = [
  {
    id: "petrol",
    values: ["Petrol"],
    labelKey: "carFilters.fuelOptions.petrol.label",
    descriptionKey: "carFilters.fuelOptions.petrol.description",
  },
  {
    id: "diesel",
    values: ["Diesel"],
    labelKey: "carFilters.fuelOptions.diesel.label",
    descriptionKey: "carFilters.fuelOptions.diesel.description",
  },
  {
    id: "electricHybrid",
    values: ["Electric", "Hybrid"],
    labelKey: "carFilters.fuelOptions.electricHybrid.label",
    descriptionKey: "carFilters.fuelOptions.electricHybrid.description",
  },
];

const makeIcons = [
  { name: "BMW", icon: SiBmw },
  { name: "Mercedes-Benz", icon: SiMercedes },
  { name: "Land Rover", icon: SiLandrover },
  { name: "Audi", icon: SiAudi },
  { name: "Porsche", icon: SiPorsche },
  { name: "Toyota", icon: SiToyota },
];

export interface FilterValues {
  makes: string[];
  minPrice: number;
  maxPrice: number;
  yearRange: [number, number];
  mileageRange: [number, number];
  fuelTypes: string[];
  search: string;
}

export const createDefaultFilterValues = (): FilterValues => ({
  makes: [],
  minPrice: PRICE_BOUNDS.min,
  maxPrice: PRICE_BOUNDS.max,
  yearRange: [YEAR_BOUNDS.min, YEAR_BOUNDS.max],
  mileageRange: [MILEAGE_BOUNDS.min, MILEAGE_BOUNDS.max],
  fuelTypes: [],
  search: "",
});

interface CarFiltersProps {
  filters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
  resultCount: number;
}

export default function CarFilters({ filters, onFilterChange, resultCount }: CarFiltersProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const makeSearchRef = useRef<HTMLInputElement>(null);
  const [makeQuery, setMakeQuery] = useState("");
  const [isMakeDropdownOpen, setIsMakeDropdownOpen] = useState(false);

  const locale = i18n.language === "ar" ? "ar-JO" : "en-US";
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "JOD",
        maximumFractionDigits: 0,
      }),
    [locale]
  );
  const numberFormatter = useMemo(() => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }), [locale]);

  useEffect(() => {
    if (isMakeDropdownOpen) {
      makeSearchRef.current?.focus();
    } else {
      setMakeQuery("");
    }
  }, [isMakeDropdownOpen]);

  const filteredMakes = useMemo(() => {
    const query = makeQuery.trim().toLowerCase();
    if (!query) return MAKE_OPTIONS;
    return MAKE_OPTIONS.filter((make) => make.toLowerCase().includes(query));
  }, [makeQuery]);

  const toggleMake = (make: string) => {
    const isSelected = filters.makes.includes(make);
    const makes = isSelected ? filters.makes.filter((value) => value !== make) : [...filters.makes, make];
    onFilterChange({ ...filters, makes });
  };

  const toggleFuel = (values: string[]) => {
    const hasAllValues = values.every((value) => filters.fuelTypes.includes(value));
    const fuelTypes = hasAllValues
      ? filters.fuelTypes.filter((fuel) => !values.includes(fuel))
      : Array.from(new Set([...filters.fuelTypes, ...values]));
    onFilterChange({ ...filters, fuelTypes });
  };

  const handlePriceSlider = (value: number[]) => {
    const [min, max] = value as [number, number];
    onFilterChange({ ...filters, minPrice: Math.round(min), maxPrice: Math.round(max) });
  };

  const handleYearSlider = (value: number[]) => {
    const [min, max] = value as [number, number];
    onFilterChange({ ...filters, yearRange: [Math.round(min), Math.round(max)] });
  };

  const handleMileageSlider = (value: number[]) => {
    const [min, max] = value as [number, number];
    onFilterChange({ ...filters, mileageRange: [Math.round(min), Math.round(max)] });
  };

  const clearFilters = () => {
    onFilterChange(createDefaultFilterValues());
    setMakeQuery("");
  };

  const priceSummary =
    filters.minPrice === PRICE_BOUNDS.min && filters.maxPrice === PRICE_BOUNDS.max
      ? t("carFilters.summary.anyBudget")
      : `${currencyFormatter.format(filters.minPrice)} - ${currencyFormatter.format(filters.maxPrice)}`;

  const yearSummary =
    filters.yearRange[0] === YEAR_BOUNDS.min && filters.yearRange[1] === YEAR_BOUNDS.max
      ? t("carFilters.summary.allYears")
      : `${filters.yearRange[0]} - ${filters.yearRange[1]}`;

  const mileageSummary =
    filters.mileageRange[0] === MILEAGE_BOUNDS.min && filters.mileageRange[1] === MILEAGE_BOUNDS.max
      ? t("carFilters.summary.anyMileage")
      : `${numberFormatter.format(filters.mileageRange[0])} - ${numberFormatter.format(filters.mileageRange[1])} km`;

  const makeSummary =
    filters.makes.length === 0
      ? t("carFilters.summary.anyMake")
      : filters.makes.length <= 2
        ? filters.makes.join(", ")
        : t("carFilters.summary.selectedCount", { count: filters.makes.length });

  const hasActiveFilters =
    filters.makes.length > 0 ||
    filters.minPrice !== PRICE_BOUNDS.min ||
    filters.maxPrice !== PRICE_BOUNDS.max ||
    filters.yearRange[0] !== YEAR_BOUNDS.min ||
    filters.yearRange[1] !== YEAR_BOUNDS.max ||
    filters.mileageRange[0] !== MILEAGE_BOUNDS.min ||
    filters.mileageRange[1] !== MILEAGE_BOUNDS.max ||
    filters.fuelTypes.length > 0 ||
    filters.search.trim().length > 0;

  const fuelLabels = useMemo(
    () => ({
      Petrol: t("vehicle.fuel.petrol"),
      Diesel: t("vehicle.fuel.diesel"),
      Hybrid: t("vehicle.fuel.hybrid"),
      Electric: t("vehicle.fuel.electric"),
    }),
    [i18n.language, t]
  );

  type ActiveFilterChip = {
    key: string;
    label: string;
    onClear: () => void;
  };

  const activeFilterChips: ActiveFilterChip[] = [];

  filters.makes.forEach((make) => {
    activeFilterChips.push({
      key: `make-${make}`,
      label: make,
      onClear: () => onFilterChange({ ...filters, makes: filters.makes.filter((value) => value !== make) }),
    });
  });

  if (filters.minPrice !== PRICE_BOUNDS.min || filters.maxPrice !== PRICE_BOUNDS.max) {
    activeFilterChips.push({
      key: "price",
      label: t("carFilters.active.price", {
        min: numberFormatter.format(filters.minPrice),
        max: numberFormatter.format(filters.maxPrice),
      }),
      onClear: () => onFilterChange({ ...filters, minPrice: PRICE_BOUNDS.min, maxPrice: PRICE_BOUNDS.max }),
    });
  }

  if (filters.yearRange[0] !== YEAR_BOUNDS.min || filters.yearRange[1] !== YEAR_BOUNDS.max) {
    activeFilterChips.push({
      key: "year",
      label: t("carFilters.active.years", { start: filters.yearRange[0], end: filters.yearRange[1] }),
      onClear: () => onFilterChange({ ...filters, yearRange: [YEAR_BOUNDS.min, YEAR_BOUNDS.max] }),
    });
  }

  if (filters.mileageRange[0] !== MILEAGE_BOUNDS.min || filters.mileageRange[1] !== MILEAGE_BOUNDS.max) {
    activeFilterChips.push({
      key: "mileage",
      label: t("carFilters.active.mileage", {
        min: numberFormatter.format(filters.mileageRange[0]),
        max: numberFormatter.format(filters.mileageRange[1]),
      }),
      onClear: () => onFilterChange({ ...filters, mileageRange: [MILEAGE_BOUNDS.min, MILEAGE_BOUNDS.max] }),
    });
  }

  if (filters.fuelTypes.length > 0) {
    const uniqueFuelLabels = Array.from(new Set(filters.fuelTypes)).map(
      (value) => fuelLabels[value as keyof typeof fuelLabels] ?? value
    );
    activeFilterChips.push({
      key: "fuel",
      label: t("carFilters.active.fuel", { list: uniqueFuelLabels.join(", ") }),
      onClear: () => onFilterChange({ ...filters, fuelTypes: [] }),
    });
  }

  if (filters.search.trim()) {
    activeFilterChips.push({
      key: "search",
      label: t("carFilters.active.search", { term: filters.search.trim() }),
      onClear: () => onFilterChange({ ...filters, search: "" }),
    });
  }

  const eyebrowClass = cn(
    "text-[0.6rem] uppercase tracking-[0.35em] text-slate-400",
    isRTL && "tracking-[0.1em] font-semibold"
  );

  return (
    <section className="rounded-[32px] border border-white/40 bg-white/95 px-6 py-8 shadow-[0_35px_80px_rgba(15,23,42,0.12)] backdrop-blur-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            aria-label={t("carFilters.searchLabel")}
            dir="auto"
            placeholder={t("carFilters.searchPlaceholder")}
            value={filters.search}
            onChange={(event) => onFilterChange({ ...filters, search: event.target.value })}
            className="w-full rounded-[999px] border border-white/70 bg-white/90 px-14 py-4 text-base font-medium text-slate-800 shadow-[0_20px_45px_rgba(15,23,42,0.12)] ring-offset-0 transition focus:border-slate-400 focus:outline-none"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFilterChange({ ...filters, search: "" })}
              className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:text-slate-900"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex flex-shrink-0 items-center gap-3">
          <div className="rounded-[24px] border border-slate-100 bg-gradient-to-br from-white/90 to-white px-6 py-3 text-left shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <p className={eyebrowClass}>{t("carFilters.liveResults")}</p>
            <p className="text-2xl font-semibold text-slate-900">{resultCount}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            className="h-12 rounded-full border border-slate-200/80 bg-white px-5 text-sm font-semibold text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.12)] transition hover:bg-white/90 hover:text-slate-900"
            disabled={!hasActiveFilters}
            onClick={clearFilters}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            {t("actions.clearAll")}
          </Button>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FilterDropdown
            label={t("carFilters.makeLabel")}
            summary={makeSummary}
            icon={<Sparkles className="h-4 w-4" />}
            onOpenChange={setIsMakeDropdownOpen}
            isRTL={isRTL}
          >
            <div className="space-y-5">
              <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-inner">
                <p className={eyebrowClass}>{t("carFilters.searchBrand")}</p>
                <Input
                  ref={makeSearchRef}
                  value={makeQuery}
                  onChange={(event) => setMakeQuery(event.target.value)}
                  placeholder={t("carFilters.searchBrandPlaceholder")}
                  dir="auto"
                  className="mt-2 rounded-2xl border-slate-200 bg-white px-4 py-2 text-sm font-medium focus-visible:ring-0"
                />
              </div>
              <div className="space-y-3">
                <p className={eyebrowClass}>{t("carFilters.quickPicks")}</p>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {makeIcons.map(({ name, icon: Icon }) => {
                    const isActive = filters.makes.includes(name);
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => toggleMake(name)}
                        className={cn(
                          "flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold transition",
                          isActive
                            ? "border-slate-900 bg-slate-900 text-white shadow-[0_12px_26px_rgba(15,23,42,0.25)]"
                            : "border-slate-200/80 bg-white/80 text-slate-700 hover:border-slate-300"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-2">
                <p className={eyebrowClass}>{t("carFilters.allMakes")}</p>
                <ScrollArea className="h-48 pr-2">
                  <div className="space-y-2">
                    {filteredMakes.map((make) => {
                      const checkboxId = `make-${make}`;
                      const isChecked = filters.makes.includes(make);
                      return (
                        <label
                          key={make}
                          htmlFor={checkboxId}
                          className={cn(
                            "flex items-center justify-between rounded-2xl border px-4 py-2 text-sm font-semibold transition",
                            isChecked ? "border-slate-900 bg-slate-900/95 text-white" : "border-slate-200 text-slate-700 hover:border-slate-300"
                          )}
                        >
                          <span>{make}</span>
                          <Checkbox
                            id={checkboxId}
                            checked={isChecked}
                            onCheckedChange={() => toggleMake(make)}
                            className="border-slate-300 data-[state=checked]:border-white"
                          />
                        </label>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </FilterDropdown>

          <FilterDropdown
            label={t("carFilters.priceLabel")}
            summary={priceSummary}
            icon={<Banknote className="h-4 w-4" />}
            isRTL={isRTL}
          >
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                {PRICE_PRESETS.map((preset) => {
                  const isActive = filters.minPrice === preset.range[0] && filters.maxPrice === preset.range[1];
                  return (
                    <button
                      key={preset.labelKey}
                      type="button"
                      onClick={() => onFilterChange({ ...filters, minPrice: preset.range[0], maxPrice: preset.range[1] })}
                      className={cn(
                        "rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] transition",
                        isActive
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200/70 text-slate-600 hover:border-slate-300"
                      )}
                    >
                      {t(preset.labelKey)}
                    </button>
                  );
                })}
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm font-semibold">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-400">
                  <span>{t("carFilters.priceMin")}</span>
                  <span>{t("carFilters.priceMax")}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-slate-900">
                  <span>{currencyFormatter.format(filters.minPrice)}</span>
                  <span>{currencyFormatter.format(filters.maxPrice)}</span>
                </div>
              </div>
              <div className="px-1">
                <Slider
                  value={[filters.minPrice, filters.maxPrice]}
                  min={PRICE_BOUNDS.min}
                  max={PRICE_BOUNDS.max}
                  step={1000}
                  onValueChange={handlePriceSlider}
                  className="py-2"
                />
              </div>
            </div>
          </FilterDropdown>

          <FilterDropdown
            label={t("carFilters.yearLabel")}
            summary={yearSummary}
            icon={<Calendar className="h-4 w-4" />}
            isRTL={isRTL}
          >
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                {YEAR_PRESETS.map((preset) => {
                  const isActive = filters.yearRange[0] === preset.range[0] && filters.yearRange[1] === preset.range[1];
                  return (
                    <button
                      key={preset.labelKey}
                      type="button"
                      onClick={() => onFilterChange({ ...filters, yearRange: preset.range })}
                      className={cn(
                        "rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] transition",
                        isActive
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200/70 text-slate-600 hover:border-slate-300"
                      )}
                    >
                      {t(preset.labelKey)}
                    </button>
                  );
                })}
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm font-semibold">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-400">
                  <span>{t("carFilters.yearStart")}</span>
                  <span>{t("carFilters.yearEnd")}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-slate-900">
                  <span>{filters.yearRange[0]}</span>
                  <span>{filters.yearRange[1]}</span>
                </div>
              </div>
              <div className="px-1">
                <Slider
                  value={[filters.yearRange[0], filters.yearRange[1]]}
                  min={YEAR_BOUNDS.min}
                  max={YEAR_BOUNDS.max}
                  step={1}
                  onValueChange={handleYearSlider}
                  className="py-2"
                />
              </div>
            </div>
          </FilterDropdown>

          <FilterDropdown
            label={t("carFilters.mileageLabel")}
            summary={mileageSummary}
            icon={<Gauge className="h-4 w-4" />}
            isRTL={isRTL}
          >
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                {MILEAGE_PRESETS.map((preset) => {
                  const isActive =
                    filters.mileageRange[0] === preset.range[0] && filters.mileageRange[1] === preset.range[1];
                  return (
                    <button
                      key={preset.labelKey}
                      type="button"
                      onClick={() => onFilterChange({ ...filters, mileageRange: preset.range })}
                      className={cn(
                        "rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] transition",
                        isActive
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200/70 text-slate-600 hover:border-slate-300"
                      )}
                    >
                      {t(preset.labelKey)}
                    </button>
                  );
                })}
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm font-semibold">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-400">
                  <span>{t("carFilters.mileageMin")}</span>
                  <span>{t("carFilters.mileageMax")}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-slate-900">
                  <span>{numberFormatter.format(filters.mileageRange[0])} km</span>
                  <span>{numberFormatter.format(filters.mileageRange[1])} km</span>
                </div>
              </div>
              <div className="px-1">
                <Slider
                  value={[filters.mileageRange[0], filters.mileageRange[1]]}
                  min={MILEAGE_BOUNDS.min}
                  max={MILEAGE_BOUNDS.max}
                  step={1000}
                  onValueChange={handleMileageSlider}
                  className="py-2"
                />
              </div>
            </div>
          </FilterDropdown>
        </div>

        <div className="grid gap-6">
          <div className="rounded-[28px] border border-slate-100 bg-white/90 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className={eyebrowClass}>{t("carFilters.fuelLabel")}</p>
                <p className="text-lg font-semibold text-slate-900">{t("carFilters.chooseDrivingProfile")}</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {FUEL_OPTIONS.map((option) => {
                const isChecked = option.values.every((value) => filters.fuelTypes.includes(value));
                const checkboxId = `fuel-${option.id}`;
                return (
                  <label
                    key={option.id}
                    htmlFor={checkboxId}
                    className={cn(
                      "group flex cursor-pointer flex-col gap-2 rounded-2xl border px-4 py-3 text-sm transition",
                      isChecked
                        ? "border-slate-900 bg-slate-900/95 text-white shadow-[0_15px_35px_rgba(15,23,42,0.35)]"
                        : "border-slate-200/80 bg-white text-slate-700 hover:border-slate-300"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={checkboxId}
                        checked={isChecked}
                        onCheckedChange={() => toggleFuel(option.values)}
                        className="border-slate-300 data-[state=checked]:border-white"
                      />
                      <span className="text-sm font-semibold">{t(option.labelKey)}</span>
                    </div>
                    <p className="text-xs text-slate-500 group-hover:text-slate-600">{t(option.descriptionKey)}</p>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {activeFilterChips.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilterChips.map((chip) => (
              <Badge
                key={chip.key}
                variant="secondary"
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[0.75rem] font-semibold text-slate-700"
              >
                <span>{chip.label}</span>
                <button
                  type="button"
                  onClick={chip.onClear}
                  className="rounded-full bg-white/60 p-0.5 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
                  aria-label={t("actions.clearAll")}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

interface FilterDropdownProps {
  label: string;
  summary: string;
  icon: ReactNode;
  children: ReactNode;
  onOpenChange?: (open: boolean) => void;
  isRTL?: boolean;
}

function FilterDropdown({ label, summary, icon, children, onOpenChange, isRTL = false }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    onOpenChange?.(value);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          className="flex w-full items-center justify-between rounded-[26px] border border-slate-200/80 bg-white/70 px-4 py-4 text-left shadow-[0_16px_35px_rgba(15,23,42,0.08)] transition hover:border-slate-300 hover:bg-white"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-[0_12px_28px_rgba(15,23,42,0.35)]">
              {icon}
            </span>
            <div>
              <p
                className={cn(
                  "text-[0.6rem] uppercase tracking-[0.35em] text-slate-400",
                  isRTL && "tracking-[0.1em] font-semibold"
                )}
              >
                {label}
              </p>
              <p className="text-sm font-semibold text-slate-900">{summary}</p>
            </div>
          </div>
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25, ease: "easeInOut" }}>
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </motion.span>
        </button>
      </PopoverTrigger>
      <AnimatePresence>
        {open ? (
          <PopoverContent
            asChild
            side="bottom"
            align="start"
            sideOffset={16}
            collisionPadding={24}
            avoidCollisions={false}
            className="border-none bg-transparent p-0 shadow-none"
          >
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              className="rounded-[28px] border border-white/70 bg-white/95 p-5 shadow-[0_32px_80px_rgba(15,23,42,0.2)]"
            >
              {children}
            </motion.div>
          </PopoverContent>
        ) : null}
      </AnimatePresence>
    </Popover>
  );
}
