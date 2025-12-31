import { useQuery } from "@tanstack/react-query";
import type { Car } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export const carsQueryKey = ["/api/cars"] as const;

export function useCars() {
  return useQuery<Car[]>({
    queryKey: carsQueryKey,
  });
}

export function useCar(id?: string) {
  return useQuery<Car>({
    queryKey: [...carsQueryKey, "detail", id ?? "missing-id"],
    enabled: Boolean(id),
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/cars?id=${encodeURIComponent(id!)}`);
      return await res.json();
    },
  });
}
