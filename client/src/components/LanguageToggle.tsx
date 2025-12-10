import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { AppLanguage, SUPPORTED_LANGUAGES } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { normalizeLanguage } from "@/lib/locale";

const ORDERED_LANGUAGES: AppLanguage[] = ["en", "ar"];

export default function LanguageToggle() {
  const { i18n, t } = useTranslation();
  const currentLanguage = normalizeLanguage(i18n.resolvedLanguage || i18n.language);
  const indicatorLeft = currentLanguage === "ar" ? "calc(50% + 2px)" : "4px";

  const handleToggle = useCallback(
    (next: AppLanguage) => {
      if (next !== currentLanguage) {
        i18n.changeLanguage(next);
      }
    },
    [currentLanguage, i18n],
  );

  return (
    <div
      className="relative inline-flex h-10 w-[96px] items-center rounded-full border border-white/25 bg-white/10 px-1 text-[0.75rem] font-semibold shadow-[0_10px_25px_rgba(0,0,0,0.35)] backdrop-blur-md"
      dir="ltr"
    >
      <span className="sr-only">{t("language.toggleLabel")}</span>
      <span
        className="pointer-events-none absolute top-1 bottom-1 w-[calc(50%-6px)] rounded-full bg-white shadow-[0_12px_35px_rgba(255,255,255,0.35)] transition-[left] duration-200 ease-out"
        style={{ left: indicatorLeft }}
        aria-hidden="true"
      />
      {ORDERED_LANGUAGES.map((language) => {
        const isActive = currentLanguage === language;
        const labels = SUPPORTED_LANGUAGES[language];
        return (
          <button
            key={language}
            type="button"
            onClick={() => handleToggle(language)}
            className="relative z-10 flex-1 rounded-full px-2 py-1 text-center transition-colors duration-150"
            aria-pressed={isActive}
            aria-label={t("language.option", {
              language: labels.nativeLabel,
            })}
          >
            <span
              className={cn(
                "text-xs font-semibold tracking-wide",
                isActive ? "text-slate-900" : "text-white/75",
              )}
            >
              {language === "en" ? "EN" : "ع"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
