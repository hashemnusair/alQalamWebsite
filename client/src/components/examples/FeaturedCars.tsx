import FeaturedCars from "../FeaturedCars";
import { mockCars } from "@/data/cars";

export default function FeaturedCarsExample() {
  return <FeaturedCars cars={mockCars.slice(0, 3)} />;
}
