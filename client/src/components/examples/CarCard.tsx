import CarCard from "../CarCard";
import { mockCars } from "@/data/cars";

export default function CarCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <CarCard car={mockCars[0]} />
    </div>
  );
}
