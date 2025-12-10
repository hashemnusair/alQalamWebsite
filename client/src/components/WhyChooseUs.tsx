import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, DollarSign, Wrench, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

const FEATURES = [
  {
    icon: ShieldCheck,
    titleKey: "home.why.features.quality.title",
    descriptionKey: "home.why.features.quality.description",
    taglineKey: "home.why.features.quality.tagline",
  },
  {
    icon: DollarSign,
    titleKey: "home.why.features.pricing.title",
    descriptionKey: "home.why.features.pricing.description",
    taglineKey: "home.why.features.pricing.tagline",
  },
  {
    icon: Wrench,
    titleKey: "home.why.features.service.title",
    descriptionKey: "home.why.features.service.description",
    taglineKey: "home.why.features.service.tagline",
  },
  {
    icon: Clock,
    titleKey: "home.why.features.speed.title",
    descriptionKey: "home.why.features.speed.description",
    taglineKey: "home.why.features.speed.tagline",
  },
];

export default function WhyChooseUs() {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("home.why.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("home.why.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="relative h-full cursor-default overflow-hidden rounded-3xl border border-white/25 bg-white/80 p-0 shadow-[0_35px_65px_rgba(15,23,42,0.08)] backdrop-blur-md transition-none dark:border-white/10 dark:bg-white/5"
              >
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                  aria-hidden="true"
                />
                <CardContent className="flex h-full flex-col gap-5 p-8 text-left cursor-default">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary dark:border-primary/30 dark:bg-primary/15">
                      <Icon className="h-7 w-7" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground/80">
                      {t(feature.taglineKey)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{t(feature.titleKey)}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {t(feature.descriptionKey)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
