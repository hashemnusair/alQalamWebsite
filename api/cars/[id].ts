import type { VercelRequest, VercelResponse } from "@vercel/node";
import { storage } from "../../../server/storage.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = req.query.id as string | undefined;
  if (!id) {
    return res.status(400).json({ message: "Missing id" });
  }

  try {
    if (req.method === "GET") {
      const car = await storage.getCar(id);
      if (!car) return res.status(404).json({ message: "Car not found" });
      return res.status(200).json(car);
    }

    if (req.method === "PUT") {
      const car = await storage.updateCar(id, (req as any).body ?? {});
      return res.status(200).json(car);
    }

    if (req.method === "DELETE") {
      await storage.deleteCar(id);
      return res.status(204).end();
    }

    res.setHeader("Allow", "GET,PUT,DELETE");
    return res.status(405).end("Method Not Allowed");
  } catch (error: any) {
    console.error(`${req.method} /api/cars/${id} error`, error);
    return res.status(500).json({ message: error?.message || "Internal Server Error" });
  }
}

