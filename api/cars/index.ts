import type { VercelRequest, VercelResponse } from "@vercel/node";
import { storage } from "../../server/storage";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const cars = await storage.listCars();
    res.status(200).json(cars);
  } catch (error: any) {
    console.error("GET /api/cars error", error);
    res.status(500).json({ message: error?.message || "Internal Server Error" });
  }
}

