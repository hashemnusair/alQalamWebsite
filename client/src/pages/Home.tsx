import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedCars from "@/components/FeaturedCars";
import WhyChooseUs from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";
import { useCars } from "@/hooks/useCars";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { data: cars, isLoading, error } = useCars();
  const hasError = Boolean(error);
  const featuredCars = (cars ?? []).slice(0, 6);
  const { t } = useTranslation();

  const renderStatus = (message: string) => (
    <section className="py-16 md:py-24">
      <div className="container mx-auto max-w-3xl px-6 lg:px-8">
        <div className="rounded-[28px] border border-white/30 bg-white/80 px-8 py-10 text-center shadow-[0_25px_55px_rgba(15,23,42,0.12)]">
          <p className="text-lg font-semibold text-slate-700">{message}</p>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <Hero />
        {isLoading && renderStatus(t("status.loadingInventory"))}
        {hasError && renderStatus(t("status.errorInventory"))}
        {!isLoading && !hasError && featuredCars.length === 0 &&
          renderStatus(t("status.emptyInventory"))}
        {!isLoading && !hasError && featuredCars.length > 0 && (
          <FeaturedCars cars={featuredCars} />
        )}
        <WhyChooseUs />
      </main>
      <Footer />
    </div>
  );
}
