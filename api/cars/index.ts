import type { VercelRequest, VercelResponse } from "@vercel/node";
import { storage } from "../../server/storage.js";
import type { CarFilters } from "../../shared/schema.js";

function parseCarFiltersFromQuery(query: Record<string, string | string[] | undefined>): {
  page: number;
  pageSize: number;
  filters: CarFilters;
} {
  const getStr = (key: string): string | undefined => {
    const val = query[key];
    return typeof val === "string" ? val : Array.isArray(val) ? val[0] : undefined;
  };

  const page = Math.max(1, parseInt(getStr("page") ?? "1", 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(getStr("pageSize") ?? "24", 10) || 24));

  const filters: CarFilters = {};

  // makes - comma-separated
  const makesStr = getStr("makes");
  if (makesStr && makesStr.trim()) {
    filters.makes = makesStr.split(",").map((s) => s.trim()).filter(Boolean);
  }

  // price range
  const minPriceStr = getStr("minPrice");
  if (minPriceStr) {
    const val = parseFloat(minPriceStr);
    if (Number.isFinite(val)) filters.minPrice = val;
  }
  const maxPriceStr = getStr("maxPrice");
  if (maxPriceStr) {
    const val = parseFloat(maxPriceStr);
    if (Number.isFinite(val)) filters.maxPrice = val;
  }

  // year range
  const minYearStr = getStr("minYear");
  if (minYearStr) {
    const val = parseInt(minYearStr, 10);
    if (Number.isFinite(val)) filters.minYear = val;
  }
  const maxYearStr = getStr("maxYear");
  if (maxYearStr) {
    const val = parseInt(maxYearStr, 10);
    if (Number.isFinite(val)) filters.maxYear = val;
  }

  // mileage range
  const minMileageStr = getStr("minMileage");
  if (minMileageStr) {
    const val = parseInt(minMileageStr, 10);
    if (Number.isFinite(val)) filters.minMileage = val;
  }
  const maxMileageStr = getStr("maxMileage");
  if (maxMileageStr) {
    const val = parseInt(maxMileageStr, 10);
    if (Number.isFinite(val)) filters.maxMileage = val;
  }

  // fuelTypes - comma-separated
  const fuelTypesStr = getStr("fuelTypes");
  if (fuelTypesStr && fuelTypesStr.trim()) {
    filters.fuelTypes = fuelTypesStr.split(",").map((s) => s.trim()).filter(Boolean);
  }

  // search
  const searchStr = getStr("search");
  if (searchStr && searchStr.trim()) {
    filters.search = searchStr.trim();
  }

  return { page, pageSize, filters };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Legacy support: if ?id= is passed, redirect to single car fetch
    const id = req.query.id as string | undefined;
    if (id) {
      // Cache car details aggressively (mostly static content).
      res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=86400");
      const car = await storage.getCar(id);
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }
      return res.status(200).json(car);
    }

    // Paginated search
    // Cache list responses briefly; stale-while-revalidate keeps it fast under load.
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=600");
    const { page, pageSize, filters } = parseCarFiltersFromQuery(
      req.query as Record<string, string | string[] | undefined>
    );
    const result = await storage.searchCars(page, pageSize, filters);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("GET /api/cars error", error);
    return res.status(500).json({ message: error?.message || "Internal Server Error" });
  }
}

