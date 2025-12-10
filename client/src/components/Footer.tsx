import { SiWhatsapp, SiFacebook, SiInstagram } from "react-icons/si";
import { Mail, Phone, MapPin } from "lucide-react";
import logoImage from "@assets/image_1763156274600.png";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const whatsappNumber = "+962791234567";
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto border-t border-white/10 bg-gradient-to-b from-[#070709] via-[#0a0b10] to-black text-white/80">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-40"
        aria-hidden="true"
      />
      <div className="container mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img
                src={logoImage}
                alt={t("brand.name")}
                className="h-12 w-12 object-contain"
              />
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/40">{t("brand.since")}</p>
                <p className="text-xl font-semibold text-white">{t("brand.name")}</p>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-white/70">
              {t("footer.description")}
            </p>
            <div className="flex gap-3">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/40 bg-primary/25 text-white transition-all hover:-translate-y-0.5 hover:bg-primary/35"
                data-testid="link-footer-whatsapp"
              >
                <SiWhatsapp className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:-translate-y-0.5 hover:bg-white/10"
                data-testid="link-footer-facebook"
              >
                <SiFacebook className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:-translate-y-0.5 hover:bg-white/10"
                data-testid="link-footer-instagram"
              >
                <SiInstagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/40">{t("footer.navigateEyebrow")}</p>
              <h3 className="text-lg font-semibold text-white">{t("footer.quickLinksTitle")}</h3>
            </div>
            <nav className="flex flex-col gap-4 text-sm" dir="auto">
              <a
                href="/"
                className="flex items-center gap-3 text-white/70 transition-all hover:translate-x-1 hover:text-white cursor-pointer"
                data-testid="link-footer-home"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  window.location.href = "/";
                }}
              >
                <span className="h-px w-6 bg-white/20" aria-hidden="true" />
                {t("nav.home")}
              </a>
              <a
                href="/inventory"
                className="flex items-center gap-3 text-white/70 transition-all hover:translate-x-1 hover:text-white cursor-pointer"
                data-testid="link-footer-inventory"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  window.location.href = "/inventory";
                }}
              >
                <span className="h-px w-6 bg-white/20" aria-hidden="true" />
                {t("nav.inventory")}
              </a>
              <a
                href="/about"
                className="flex items-center gap-3 text-white/70 transition-all hover:translate-x-1 hover:text-white cursor-pointer"
                data-testid="link-footer-about"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  window.location.href = "/about";
                }}
              >
                <span className="h-px w-6 bg-white/20" aria-hidden="true" />
                {t("footer.aboutLink")}
              </a>
            </nav>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/40">{t("footer.contactEyebrow")}</p>
              <h3 className="text-lg font-semibold text-white">{t("footer.contactTitle")}</h3>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70 shadow-[0_25px_50px_rgba(0,0,0,0.25)]">
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 shrink-0 text-primary" />
                  <span>{t("footer.address")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  <a href="tel:+962791234567" className="transition-colors hover:text-white">
                    +962 79 123 4567
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  <a href="mailto:info@alqalammotors.jo" className="transition-colors hover:text-white">
                    info@alqalammotors.jo
                  </a>
                </div>
              </div>
              <div className="mt-6 border-t border-white/10 pt-4 text-xs uppercase tracking-[0.35em] text-white/40">
                {t("footer.hoursTitle")}
              </div>
              <div className="space-y-1 text-white/70">
                <p>{t("footer.weekdayHours")}</p>
                <p>{t("footer.weekendHours")}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-sm text-white/55 md:flex md:items-center md:justify-between">
          <p>{t("footer.copy", { year: currentYear, brand: t("brand.name") })}</p>
          <p className="mt-3 text-xs uppercase tracking-[0.4em] text-white/40 md:mt-0">
            {t("brand.tagline")}
          </p>
        </div>
      </div>
    </footer>
  );
}
