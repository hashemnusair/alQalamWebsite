import type { Car } from "@shared/schema";

export const getCarSearchText = (car: Car) => {
  return [
    car.title,
    car.make,
    car.color,
    car.drive,
    car.fuel,
    car.description,
    car.engine,
    String(car.year),
    String(car.mileage),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
};
