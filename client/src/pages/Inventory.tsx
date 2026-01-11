import { useEffect, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import CarFilters, {
  DEFAULT_FILTER_BOUNDS,
  FilterBounds,
  FilterValues,
  createDefaultFilterValues,
} from "@/components/CarFilters";
import { formatNumber } from "@/lib/locale";
import { usePaginatedCars, usePrefetchCars, usePrefetchCar } from "@/hooks/useCars";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { CarFilters as ApiCarFilters } from "@shared/schema";

function roundDown(value: number, step: number) {
  return Math.floor(value / step) * step;
}

function roundUp(value: number, step: number) {
  return Math.ceil(value / step) * step;
}

function buildPageRange(current: number, totalPages: number): Array<number | "ellipsis"> {
  // Best UX: always show first/last, current, and neighbors with ellipses.
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const pages = new Set<number>();
  pages.add(1);
  pages.add(totalPages);
  pages.add(current);
  pages.add(Math.max(1, current - 1));
  pages.add(Math.min(totalPages, current + 1));

  // keep 2 and totalPages-1 when near edges
  if (current <= 3) {
    pages.add(2);
    pages.add(3);
  }
  if (current >= totalPages - 2) {
    pages.add(totalPages - 1);
    pages.add(totalPages - 2);
  }

  const sorted = Array.from(pages).filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const out: Array<number | "ellipsis"> = [];
  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i];
    const prev = sorted[i - 1];
    if (prev !== undefined && p - prev > 1) out.push("ellipsis");
    out.push(p);
  }
  return out;
}

export default function Inventory() {
  const [filters, setFilters] = useState<FilterValues>(() => createDefaultFilterValues());
  const [hasUserChangedFilters, setHasUserChangedFilters] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 24;
  const { t, i18n } = useTranslation();

  const apiFilters: ApiCarFilters = useMemo(
    () => ({
      makes: filters.makes,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minYear: filters.yearRange[0],
      maxYear: filters.yearRange[1],
      minMileage: filters.mileageRange[0],
      maxMileage: filters.mileageRange[1],
      fuelTypes: filters.fuelTypes,
      search: filters.search.trim() ? filters.search.trim() : undefined,
    }),
    [filters],
  );

  const query = usePaginatedCars({ page, pageSize, filters: apiFilters });
  const { data, isLoading, isFetching, error } = query;
  const hasError = Boolean(error);
  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const prefetchCars = usePrefetchCars();
  const prefetchCar = usePrefetchCar();

  const gridTopRef = useRef<HTMLDivElement | null>(null);
  const lastPageChangeRef = useRef<number>(page);

  const bounds: FilterBounds = useMemo(() => {
    const facets = data?.facets;
    if (!facets) return DEFAULT_FILTER_BOUNDS;

    const minPrice = Math.max(0, roundDown(facets.bounds.price.min, 1000));
    const maxPrice = Math.max(minPrice, roundUp(facets.bounds.price.max, 1000));

    const minYear = Math.min(facets.bounds.year.min, facets.bounds.year.max);
    const maxYear = Math.max(facets.bounds.year.min, facets.bounds.year.max);

    const maxMileage = Math.max(DEFAULT_FILTER_BOUNDS.mileage.min, roundUp(facets.bounds.mileage.max, 1000));

    return {
      price: { min: minPrice, max: maxPrice },
      year: { min: minYear, max: maxYear },
      mileage: { min: DEFAULT_FILTER_BOUNDS.mileage.min, max: maxMileage },
    };
  }, [data?.facets]);

  const makeOptions = useMemo(() => data?.facets?.makes ?? [], [data?.facets?.makes]);

  useEffect(() => {
    // Initialize the default filter ranges from the actual dataset once it's loaded.
    // This prevents hidden cars due to static bounds (e.g., future model years, high prices).
    if (hasUserChangedFilters) return;
    if (!data?.facets) return;
    setFilters(createDefaultFilterValues(bounds));
  }, [bounds, data?.facets, hasUserChangedFilters]);

  const handleFilterChange = (next: FilterValues) => {
    setHasUserChangedFilters(true);
    setFilters(next);
    setPage(1);
  };

  // Prefetch next/prev pages for instant-feeling pagination.
  useEffect(() => {
    if (!data) return;
    if (page < totalPages) prefetchCars({ page: page + 1, pageSize, filters: apiFilters });
    if (page > 1) prefetchCars({ page: page - 1, pageSize, filters: apiFilters });
  }, [apiFilters, data, page, pageSize, prefetchCars, totalPages]);

  // Smooth scroll rules on page change: only scroll if the grid is off-screen.
  useEffect(() => {
    if (lastPageChangeRef.current === page) return;
    lastPageChangeRef.current = page;

    const el = gridTopRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const isVisible = rect.top >= 80 && rect.top <= window.innerHeight * 0.35;
    if (isVisible) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page]);

  const formattedTotalVehicles = formatNumber(total, i18n.language);
  const pageRange = useMemo(() => buildPageRange(page, totalPages), [page, totalPages]);

  const goToPage = (nextPage: number) => {
    const safe = Math.min(Math.max(1, nextPage), totalPages);
    if (safe === page) return;
    setPage(safe);
  };

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
                      count: total,
                      formatted: formattedTotalVehicles,
                    })}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <CarFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              resultCount={total}
              bounds={bounds}
              makeOptions={makeOptions}
            />
          </div>

          {!isLoading && !hasError && total > 0 && (
            <div className="mb-6 flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                {t("inventory.availableCount", { count: total, formatted: formattedTotalVehicles })} ·{" "}
                {t("inventory.pageOf", { page, totalPages, defaultValue: `Page ${page} of ${totalPages}` })}
              </p>
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full transition ${
                    isFetching ? "bg-primary animate-pulse" : "bg-muted-foreground/30"
                  }`}
                  aria-hidden
                />
                <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  {isFetching ? t("status.loadingInventory") : t("status.ready", { defaultValue: "Ready" })}
                </span>
              </div>
            </div>
          )}

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

          {!isLoading && !hasError && totalPages > 1 && (
            <div className="mb-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        goToPage(page - 1);
                      }}
                      aria-disabled={page <= 1}
                      className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
                    />
                  </PaginationItem>
                  {pageRange.map((p, idx) =>
                    p === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-${idx}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={p}>
                        <PaginationLink
                          href="#"
                          isActive={p === page}
                          onClick={(e) => {
                            e.preventDefault();
                            goToPage(p);
                          }}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        goToPage(page + 1);
                      }}
                      aria-disabled={page >= totalPages}
                      className={page >= totalPages ? "pointer-events-none opacity-50" : undefined}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          <div ref={gridTopRef} />

          {!isLoading && !hasError && items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  onPointerEnter={() => prefetchCar(car.id)}
                  onPointerDown={() => prefetchCar(car.id)}
                />
              ))}
            </div>
          ) : null}

          {!isLoading && !hasError && items.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                {t("inventory.emptyState")}
              </p>
            </div>
          )}

          {!isLoading && !hasError && totalPages > 1 && (
            <div className="mt-10">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        goToPage(page - 1);
                      }}
                      aria-disabled={page <= 1}
                      className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
                    />
                  </PaginationItem>
                  {pageRange.map((p, idx) =>
                    p === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-bottom-${idx}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={`bottom-${p}`}>
                        <PaginationLink
                          href="#"
                          isActive={p === page}
                          onClick={(e) => {
                            e.preventDefault();
                            goToPage(p);
                          }}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        goToPage(page + 1);
                      }}
                      aria-disabled={page >= totalPages}
                      className={page >= totalPages ? "pointer-events-none opacity-50" : undefined}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
