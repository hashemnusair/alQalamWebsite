import { useQuery } from "@tanstack/react-query";
import type { Car } from "@shared/schema";

export const carsQueryKey = ["/api/cars"] as const;

export function useCars() {
  return useQuery<Car[]>({
    queryKey: carsQueryKey,
  });
}

export function useCar(id?: string) {
  const queryKey = id ? [...carsQueryKey, id] : [...carsQueryKey, "detail"];

  return useQuery<Car>({
    queryKey,
    enabled: Boolean(id),
  });
}
