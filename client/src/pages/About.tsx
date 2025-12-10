import { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiWhatsapp } from "react-icons/si";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { formatNumber } from "@/lib/locale";

const STATS = [
  { labelKey: "about.stats.years", value: 20, suffix: "+" },
  { labelKey: "about.stats.deliveries", value: 2500, suffix: "+" },
  { labelKey: "about.stats.satisfaction", value: 98, suffix: "%" },
];

export default function About() {
  const { t, i18n } = useTranslation();
  const whatsappNumber = "+962791234567";
  const whatsappMessage = t("whatsapp.aboutInquiry");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const stats = useMemo(
    () =>
      STATS.map((stat) => ({
        label: t(stat.labelKey),
        value: `${formatNumber(stat.value, i18n.language)}${stat.suffix ?? ""}`,
      })),
    [i18n.language, t],
  );

  const storyParagraphs = t("about.story.paragraphs", { returnObjects: true }) as string[];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-slate-50 via-white to-white pt-28 pb-20">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <section className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr,0.9fr] mb-16">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.4em] text-slate-500">{t("brand.since")}</p>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight text-slate-900">
                  <Trans
                    i18nKey="about.hero.title"
                    components={{
                      highlight: (
                        <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent" />
                      ),
                    }}
                  />
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl">{t("about.hero.description")}</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-3xl border border-white/60 bg-white/80 p-5 text-center shadow-[0_20px_55px_rgba(15,23,42,0.12)]"
                  >
                    <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-[32px] border border-white/60 bg-white/90 p-8 shadow-[0_35px_70px_rgba(15,23,42,0.12)]">
                <h2 className="text-2xl font-semibold mb-4 text-slate-900">{t("about.story.title")}</h2>
                <div className="space-y-4 text-slate-600 leading-relaxed">
                  {storyParagraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>

            <Card className="rounded-[32px] border-white/60 bg-white/90 shadow-[0_45px_85px_rgba(15,23,42,0.18)] backdrop-blur">
              <CardContent className="p-8 flex h-full flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-slate-500">{t("about.visit.eyebrow")}</p>
                    <h2 className="text-2xl font-semibold text-slate-900">{t("about.visit.title")}</h2>
                  </div>
                  <span className="text-xs rounded-full border border-slate-200 px-3 py-1 uppercase tracking-[0.3em] text-slate-500">
                    {t("about.visit.status")}
                  </span>
                </div>
                <div className="relative mb-6 flex-1">
                  <div className="absolute inset-0 rounded-2xl border border-white/40 bg-muted shadow-[0_30px_60px_rgba(15,23,42,0.15)]">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3384.8261841475144!2d35.86643831519313!3d31.963157581244785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ca1c0d8d4f36d%3A0x5c2cf66f9c8c8c8c!2sMecca%20St%2C%20Amman%2C%20Jordan!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
                <div className="space-y-5 text-slate-600">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{t("about.visit.addressLabel")}</p>
                      <p className="text-base font-semibold text-slate-900">{t("footer.address")}</p>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{t("about.visit.hoursLabel")}</p>
                        <p className="text-base text-slate-700">
                          {t("footer.weekdayHours")}
                          <br />
                          {t("footer.weekendHours")}
                        </p>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm">
                      <p className="uppercase tracking-[0.3em] text-primary/80 text-xs mb-2">{t("about.visit.contactLabel")}</p>
                      <p className="font-semibold text-slate-900">+962 79 123 4567</p>
                      <p className="text-slate-600">info@alqalammotors.jo</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/40 bg-white/70 p-4 text-xs uppercase tracking-[0.4em] text-slate-500">
                    {t("about.visit.concierge")}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <Card className="rounded-[32px] border-white/60 bg-gradient-to-br from-[#050607] via-[#0a1019] to-[#050607] text-white shadow-[0_50px_95px_rgba(5,6,7,0.55)]">
            <CardContent className="p-8 md:p-10">
              <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/60">{t("about.connect.eyebrow")}</p>
                  <h2 className="text-3xl font-semibold mt-2">{t("about.connect.title")}</h2>
                  <p className="mt-3 text-white/70 max-w-2xl">{t("about.connect.body")}</p>
                </div>
                <Button
                  asChild
                  size="lg"
                  className="w-full md:w-auto border-[#1AA956] bg-gradient-to-r from-[#25D366] via-[#20C15A] to-[#1ABF60] text-white shadow-[0_25px_55px_rgba(32,178,87,0.35)] hover:-translate-y-0.5"
                  data-testid="button-contact-whatsapp"
                >
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <SiWhatsapp className="w-5 h-5" />
                    {t("actions.startConversation")}
                  </a>
                </Button>
              </div>
              <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-2xl border border-white/20 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">{t("footer.phoneLabel")}</p>
                  <a
                    href="tel:+962791234567"
                    className="mt-2 block text-lg font-semibold text-white hover:text-white/80 transition"
                  >
                    +962 79 123 4567
                  </a>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">{t("footer.emailLabel")}</p>
                  <a
                    href="mailto:info@alqalammotors.jo"
                    className="mt-2 block text-lg font-semibold text-white hover:text-white/80 transition"
                  >
                    info@alqalammotors.jo
                  </a>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">{t("footer.whatsappLabel")}</p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block text-lg font-semibold text-white hover:text-white/80 transition"
                  >
                    {t("actions.chatInstantly")}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
