import type { AppLanguage } from "@/lib/i18n";

const SUPPORTED_ORDER: AppLanguage[] = ["en", "ar"];

export const normalizeLanguage = (language?: string): AppLanguage => {
  if (!language) {
    return "en";
  }

  const shortCode = language.slice(0, 2).toLowerCase();
  return (SUPPORTED_ORDER.find((lng) => lng === shortCode) ?? "en") as AppLanguage;
};

export const isRTL = (language?: string) => normalizeLanguage(language) === "ar";

const coerceNumber = (value: number | string) => {
  if (typeof value === "number") {
    return value;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatNumber = (
  value: number | string,
  locale: string,
  options?: Intl.NumberFormatOptions,
) => {
  return new Intl.NumberFormat(locale, options).format(coerceNumber(value));
};

export const toTranslationKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
