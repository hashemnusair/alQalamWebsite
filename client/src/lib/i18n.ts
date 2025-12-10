import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en";
import ar from "@/locales/ar";

export const LANGUAGE_STORAGE_KEY = "qalammotors-lang";

export const SUPPORTED_LANGUAGES = {
  en: { label: "English", nativeLabel: "English", dir: "ltr" },
  ar: { label: "Arabic", nativeLabel: "العربية", dir: "rtl" },
} as const;

export type AppLanguage = keyof typeof SUPPORTED_LANGUAGES;

const resources = {
  en: { translation: en },
  ar: { translation: ar },
} as const;

const fallbackLng: AppLanguage = "en";

const detectInitialLanguage = (): AppLanguage => {
  if (typeof window === "undefined") {
    return fallbackLng;
  }

  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY) as AppLanguage | null;
  if (stored && stored in SUPPORTED_LANGUAGES) {
    return stored;
  }

  const browserLang = window.navigator.language.slice(0, 2) as AppLanguage;
  if (browserLang && browserLang in SUPPORTED_LANGUAGES) {
    return browserLang;
  }

  return fallbackLng;
};

const applyLanguageSideEffects = (lng: AppLanguage) => {
  if (typeof document === "undefined") {
    return;
  }

  const dir = SUPPORTED_LANGUAGES[lng]?.dir ?? "ltr";
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
  if (document.body) {
    document.body.dataset.lang = lng;
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
  }
};

const init = () => {
  const initialLanguage = detectInitialLanguage();

  if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
      resources,
      lng: initialLanguage,
      fallbackLng,
      supportedLngs: Object.keys(SUPPORTED_LANGUAGES),
      interpolation: { escapeValue: false },
      react: {
        useSuspense: false,
      },
    });
  }

  applyLanguageSideEffects(initialLanguage);

  i18n.on("languageChanged", (lng) => {
    const safeLanguage = (lng in SUPPORTED_LANGUAGES ? lng : fallbackLng) as AppLanguage;
    applyLanguageSideEffects(safeLanguage);
  });
};

init();

export default i18n;
