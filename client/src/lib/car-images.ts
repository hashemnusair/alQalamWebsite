import type { Car } from "@shared/schema";

const httpPattern = /^https?:\/\//i;
const storageBaseUrl = import.meta.env.VITE_CAR_IMAGES_BASE_URL?.replace(/\/$/, "");

// Log warning in development if storage URL is not configured
if (!storageBaseUrl && import.meta.env.DEV) {
  console.warn(
    "[car-images] VITE_CAR_IMAGES_BASE_URL is not set. Car images will not load correctly.\n" +
    "Set it to your Supabase Storage URL, e.g.:\n" +
    "VITE_CAR_IMAGES_BASE_URL=https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/car-images"
  );
}

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

  // Fallback: return empty string if no base URL configured (will show placeholder)
  return "";
}

export function getCarImages(car?: Pick<Car, "images"> | null): string[] {
  if (!car || !Array.isArray(car.images)) {
    return [];
  }

  return car.images
    .filter(isValidImageSource)
    .map(resolveImageUrl)
    .filter((url) => url.length > 0);
}
