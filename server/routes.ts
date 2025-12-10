import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCarSchema } from "@shared/schema";
import { z } from "zod";

type RouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const updateCarSchema = insertCarSchema.partial();

function asyncHandler(handler: RouteHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, next).catch(next);
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  app.get(
    "/api/health",
    asyncHandler(async (_req, res) => {
      res.json({ status: "ok" });
    }),
  );

  app.get(
    "/api/cars",
    asyncHandler(async (_req, res) => {
      const cars = await storage.listCars();
      res.json(cars);
    }),
  );

  app.get(
    "/api/cars/:id",
    asyncHandler(async (req, res) => {
      const car = await storage.getCar(req.params.id);
      if (!car) {
        res.status(404).json({ message: "Car not found" });
        return;
      }
      res.json(car);
    }),
  );

  app.post(
    "/api/cars",
    asyncHandler(async (req, res) => {
      const payload = insertCarSchema.parse(req.body);
      const car = await storage.createCar(payload);
      res.status(201).json(car);
    }),
  );

  app.put(
    "/api/cars/:id",
    asyncHandler(async (req, res) => {
      const parsed = updateCarSchema.parse(req.body);
      if (Object.keys(parsed).length === 0) {
        throw new z.ZodError([
          {
            code: "custom",
            path: [],
            message: "At least one field is required",
          },
        ]);
      }

      const car = await storage.updateCar(req.params.id, parsed);
      res.json(car);
    }),
  );

  app.delete(
    "/api/cars/:id",
    asyncHandler(async (req, res) => {
      await storage.deleteCar(req.params.id);
      res.status(204).end();
    }),
  );

  const httpServer = createServer(app);

  return httpServer;
}
