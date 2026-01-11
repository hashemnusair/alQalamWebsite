import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { insertCarSchema, type CarFilters } from "@shared/schema";
import { z } from "zod";

type RouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const updateCarSchema = insertCarSchema.partial();

function asyncHandler(handler: RouteHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, next).catch(next);
  };
}

function parseCarFiltersFromQuery(query: Record<string, unknown>): {
  page: number;
  pageSize: number;
  filters: CarFilters;
} {
  const page = Math.max(1, parseInt(String(query.page ?? "1"), 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(String(query.pageSize ?? "24"), 10) || 24));

  const filters: CarFilters = {};

  // makes - comma-separated
  if (query.makes && typeof query.makes === "string" && query.makes.trim()) {
    filters.makes = query.makes.split(",").map((s) => s.trim()).filter(Boolean);
  }

  // price range
  if (query.minPrice !== undefined && query.minPrice !== "") {
    const val = parseFloat(String(query.minPrice));
    if (Number.isFinite(val)) filters.minPrice = val;
  }
  if (query.maxPrice !== undefined && query.maxPrice !== "") {
    const val = parseFloat(String(query.maxPrice));
    if (Number.isFinite(val)) filters.maxPrice = val;
  }

  // year range
  if (query.minYear !== undefined && query.minYear !== "") {
    const val = parseInt(String(query.minYear), 10);
    if (Number.isFinite(val)) filters.minYear = val;
  }
  if (query.maxYear !== undefined && query.maxYear !== "") {
    const val = parseInt(String(query.maxYear), 10);
    if (Number.isFinite(val)) filters.maxYear = val;
  }

  // mileage range
  if (query.minMileage !== undefined && query.minMileage !== "") {
    const val = parseInt(String(query.minMileage), 10);
    if (Number.isFinite(val)) filters.minMileage = val;
  }
  if (query.maxMileage !== undefined && query.maxMileage !== "") {
    const val = parseInt(String(query.maxMileage), 10);
    if (Number.isFinite(val)) filters.maxMileage = val;
  }

  // fuelTypes - comma-separated
  if (query.fuelTypes && typeof query.fuelTypes === "string" && query.fuelTypes.trim()) {
    filters.fuelTypes = query.fuelTypes.split(",").map((s) => s.trim()).filter(Boolean);
  }

  // search
  if (query.search && typeof query.search === "string" && query.search.trim()) {
    filters.search = query.search.trim();
  }

  return { page, pageSize, filters };
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
    asyncHandler(async (req, res) => {
      const { page, pageSize, filters } = parseCarFiltersFromQuery(req.query as Record<string, unknown>);
      const result = await storage.searchCars(page, pageSize, filters);
      res.json(result);
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
