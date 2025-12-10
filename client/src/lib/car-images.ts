import type { Car } from "@shared/schema";

const httpPattern = /^https?:\/\//i;
const storageBaseUrl = import.meta.env.VITE_CAR_IMAGES_BASE_URL?.replace(/\/$/, "");

function isValidImageSource(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function resolveImageUrl(path: string): string {
  if (httpPattern.test(path)) {
    return path;
  }

  const normalizedPath = path.replace(/^\/+/, "");

  if (storageBaseUrl) {
    return `${storageBaseUrl}/${normalizedPath}`;
  }

  return `/${normalizedPath}`;
}

export function getCarImages(car?: Pick<Car, "images"> | null): string[] {
  if (!car || !Array.isArray(car.images)) {
    return [];
  }

  return car.images.filter(isValidImageSource).map(resolveImageUrl);
}
