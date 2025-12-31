import type { VercelRequest, VercelResponse } from "@vercel/node";
import { storage } from "../../server/storage.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const id = req.query.id as string | undefined;
    if (id) {
      const car = await storage.getCar(id);
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }
      return res.status(200).json(car);
    }

    const cars = await storage.listCars();
    return res.status(200).json(cars);
  } catch (error: any) {
    console.error("GET /api/cars error", error);
    return res.status(500).json({ message: error?.message || "Internal Server Error" });
  }
}

