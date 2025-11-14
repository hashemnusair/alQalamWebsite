import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedCars from "@/components/FeaturedCars";
import WhyChooseUs from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";
import { mockCars } from "@/data/cars";

export default function Home() {
  const featuredCars = mockCars.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <Hero />
        <FeaturedCars cars={featuredCars} />
        <WhyChooseUs />
      </main>
      <Footer />
    </div>
  );
}
