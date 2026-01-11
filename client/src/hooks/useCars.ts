import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Car, CarFilters, PaginatedCars } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export const carsQueryKey = ["/api/cars"] as const;

export interface UsePaginatedCarsParams {
  page: number;
  pageSize: number;
  filters: CarFilters;
}

function buildCarsQueryString(params: UsePaginatedCarsParams): string {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params.page));
  searchParams.set("pageSize", String(params.pageSize));

  const { filters } = params;
  if (filters.makes && filters.makes.length > 0) {
    searchParams.set("makes", filters.makes.join(","));
  }
  if (filters.minPrice !== undefined) {
    searchParams.set("minPrice", String(filters.minPrice));
  }
  if (filters.maxPrice !== undefined) {
    searchParams.set("maxPrice", String(filters.maxPrice));
  }
  if (filters.minYear !== undefined) {
    searchParams.set("minYear", String(filters.minYear));
  }
  if (filters.maxYear !== undefined) {
    searchParams.set("maxYear", String(filters.maxYear));
  }
  if (filters.minMileage !== undefined) {
    searchParams.set("minMileage", String(filters.minMileage));
  }
  if (filters.maxMileage !== undefined) {
    searchParams.set("maxMileage", String(filters.maxMileage));
  }
  if (filters.fuelTypes && filters.fuelTypes.length > 0) {
    searchParams.set("fuelTypes", filters.fuelTypes.join(","));
  }
  if (filters.search) {
    searchParams.set("search", filters.search);
  }

  return searchParams.toString();
}

export function getCarsQueryKey(params: UsePaginatedCarsParams) {
  return [...carsQueryKey, "paginated", params] as const;
}

export function usePaginatedCars(params: UsePaginatedCarsParams) {
  return useQuery<PaginatedCars>({
    queryKey: getCarsQueryKey(params),
    queryFn: async () => {
      const qs = buildCarsQueryString(params);
      const res = await apiRequest("GET", `/api/cars?${qs}`);
      return await res.json();
    },
    placeholderData: (previousData) => previousData, // keepPreviousData equivalent in v5
    staleTime: 30_000, // 30 seconds before refetching
  });
}

export function usePrefetchCars() {
  const queryClient = useQueryClient();

  return (params: UsePaginatedCarsParams) => {
    const qs = buildCarsQueryString(params);
    queryClient.prefetchQuery({
      queryKey: getCarsQueryKey(params),
      queryFn: async () => {
        const res = await apiRequest("GET", `/api/cars?${qs}`);
        return await res.json();
      },
      staleTime: 30_000,
    });
  };
}

export function useCar(id?: string) {
  return useQuery<Car>({
    queryKey: ["/api/cars", id] as const,
    enabled: Boolean(id),
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/cars/${encodeURIComponent(id!)}`);
      return await res.json();
    },
    staleTime: 60_000, // 1 minute for individual car data
  });
}

export function usePrefetchCar() {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: ["/api/cars", id] as const,
      queryFn: async () => {
        const res = await apiRequest("GET", `/api/cars/${encodeURIComponent(id)}`);
        return await res.json();
      },
      staleTime: 60_000,
    });
  };
}
