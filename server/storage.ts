import { db } from "./db.js";
import {
  type User,
  type InsertUser,
  type Car,
  type InsertCar,
  type CarListItem,
  type CarFilters,
  type CarFacets,
  type PaginatedCars,
  users,
  cars,
} from "../shared/schema.js";
import { eq, and, gte, lte, inArray, ilike, or, sql, min, max, count, asc } from "drizzle-orm";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export class NotFoundError extends Error {
  status = 404;

  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  listCars(): Promise<Car[]>;
  searchCars(page: number, pageSize: number, filters: CarFilters): Promise<PaginatedCars>;
  getCar(id: string): Promise<Car | undefined>;
  createCar(car: InsertCar): Promise<Car>;
  updateCar(id: string, car: Partial<InsertCar>): Promise<Car>;
  deleteCar(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async listCars(): Promise<Car[]> {
    return await db.select().from(cars).orderBy(cars.title);
  }

  async searchCars(page: number, pageSize: number, filters: CarFilters): Promise<PaginatedCars> {
    // Build WHERE conditions
    const conditions: ReturnType<typeof eq>[] = [];

    if (filters.makes && filters.makes.length > 0) {
      conditions.push(inArray(cars.make, filters.makes));
    }
    if (filters.minPrice !== undefined) {
      conditions.push(gte(sql`CAST(${cars.price} AS NUMERIC)`, filters.minPrice));
    }
    if (filters.maxPrice !== undefined) {
      conditions.push(lte(sql`CAST(${cars.price} AS NUMERIC)`, filters.maxPrice));
    }
    if (filters.minYear !== undefined) {
      conditions.push(gte(cars.year, filters.minYear));
    }
    if (filters.maxYear !== undefined) {
      conditions.push(lte(cars.year, filters.maxYear));
    }
    if (filters.minMileage !== undefined) {
      conditions.push(gte(cars.mileage, filters.minMileage));
    }
    if (filters.maxMileage !== undefined) {
      conditions.push(lte(cars.mileage, filters.maxMileage));
    }
    if (filters.fuelTypes && filters.fuelTypes.length > 0) {
      conditions.push(inArray(cars.fuel, filters.fuelTypes));
    }
    if (filters.search && filters.search.trim()) {
      const term = `%${filters.search.trim()}%`;
      conditions.push(
        or(
          ilike(cars.title, term),
          ilike(cars.make, term),
          ilike(cars.color, term),
          ilike(cars.origin, term)
        )!
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Run paginated query and count in parallel
    const offset = (page - 1) * pageSize;

    const [items, countResult, facetsResult] = await Promise.all([
      // Paginated items (lightweight - omit description)
      db
        .select({
          id: cars.id,
          title: cars.title,
          price: cars.price,
          currency: cars.currency,
          mileage: cars.mileage,
          year: cars.year,
          make: cars.make,
          gearbox: cars.gearbox,
          engine: cars.engine,
          drive: cars.drive,
          fuel: cars.fuel,
          color: cars.color,
          origin: cars.origin,
          images: cars.images,
        })
        .from(cars)
        .where(whereClause)
        .orderBy(asc(cars.title), asc(cars.id))
        .limit(pageSize)
        .offset(offset),

      // Total count with filters
      db
        .select({ total: count() })
        .from(cars)
        .where(whereClause),

      // Facets: get bounds and distinct makes from ALL data (unfiltered)
      // This allows filters to show full range even when filtered
      db
        .select({
          minPrice: min(sql`CAST(${cars.price} AS NUMERIC)`),
          maxPrice: max(sql`CAST(${cars.price} AS NUMERIC)`),
          minYear: min(cars.year),
          maxYear: max(cars.year),
          minMileage: min(cars.mileage),
          maxMileage: max(cars.mileage),
        })
        .from(cars),
    ]);

    // Get distinct makes separately (simpler query)
    const makesResult = await db
      .selectDistinct({ make: cars.make })
      .from(cars)
      .orderBy(asc(cars.make));

    const total = countResult[0]?.total ?? 0;
    const facetRow = facetsResult[0];

    const facets: CarFacets = {
      makes: makesResult.map((r) => r.make),
      bounds: {
        price: {
          min: Number(facetRow?.minPrice) || 0,
          max: Number(facetRow?.maxPrice) || 100000,
        },
        year: {
          min: facetRow?.minYear ?? 2000,
          max: facetRow?.maxYear ?? new Date().getFullYear(),
        },
        mileage: {
          min: facetRow?.minMileage ?? 0,
          max: facetRow?.maxMileage ?? 200000,
        },
      },
    };

    return {
      items: items as CarListItem[],
      total,
      page,
      pageSize,
      facets,
    };
  }

  async getCar(id: string): Promise<Car | undefined> {
    const [car] = await db.select().from(cars).where(eq(cars.id, id));
    return car;
  }

  async createCar(insertCar: InsertCar): Promise<Car> {
    const [car] = await db.insert(cars).values(insertCar).returning();
    return car;
  }

  async updateCar(id: string, update: Partial<InsertCar>): Promise<Car> {
    const [car] = await db
      .update(cars)
      .set(update)
      .where(eq(cars.id, id))
      .returning();

    if (!car) {
      throw new NotFoundError("Car not found");
    }

    return car;
  }

  async deleteCar(id: string): Promise<void> {
    const deleted = await db.delete(cars).where(eq(cars.id, id)).returning({ id: cars.id });
    if (deleted.length === 0) {
      throw new NotFoundError("Car not found");
    }
  }
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private cars: Map<string, Car>;

  constructor() {
    this.users = new Map();
    this.cars = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async listCars(): Promise<Car[]> {
    return Array.from(this.cars.values());
  }

  async searchCars(page: number, pageSize: number, filters: CarFilters): Promise<PaginatedCars> {
    const allCars = Array.from(this.cars.values());

    // Apply filters
    let filtered = allCars.filter((car) => {
      if (filters.makes && filters.makes.length > 0 && !filters.makes.includes(car.make)) return false;
      const price = parseFloat(car.price);
      if (filters.minPrice !== undefined && price < filters.minPrice) return false;
      if (filters.maxPrice !== undefined && price > filters.maxPrice) return false;
      if (filters.minYear !== undefined && car.year < filters.minYear) return false;
      if (filters.maxYear !== undefined && car.year > filters.maxYear) return false;
      if (filters.minMileage !== undefined && car.mileage < filters.minMileage) return false;
      if (filters.maxMileage !== undefined && car.mileage > filters.maxMileage) return false;
      if (filters.fuelTypes && filters.fuelTypes.length > 0 && !filters.fuelTypes.includes(car.fuel)) return false;
      if (filters.search && filters.search.trim()) {
        const term = filters.search.trim().toLowerCase();
        const haystack = `${car.title} ${car.make} ${car.color} ${car.origin}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });

    // Sort by title, then id
    filtered.sort((a, b) => a.title.localeCompare(b.title) || a.id.localeCompare(b.id));

    const total = filtered.length;
    const offset = (page - 1) * pageSize;
    const items = filtered.slice(offset, offset + pageSize);

    // Compute facets from ALL cars (unfiltered)
    const prices = allCars.map((c) => parseFloat(c.price)).filter((n) => Number.isFinite(n));
    const years = allCars.map((c) => c.year);
    const mileages = allCars.map((c) => c.mileage);
    const makes = Array.from(new Set(allCars.map((c) => c.make))).sort();

    const facets: CarFacets = {
      makes,
      bounds: {
        price: {
          min: prices.length ? Math.min(...prices) : 0,
          max: prices.length ? Math.max(...prices) : 100000,
        },
        year: {
          min: years.length ? Math.min(...years) : 2000,
          max: years.length ? Math.max(...years) : new Date().getFullYear(),
        },
        mileage: {
          min: mileages.length ? Math.min(...mileages) : 0,
          max: mileages.length ? Math.max(...mileages) : 200000,
        },
      },
    };

    // Convert to CarListItem (omit description)
    const listItems: CarListItem[] = items.map(({ description, ...rest }) => rest);

    return {
      items: listItems,
      total,
      page,
      pageSize,
      facets,
    };
  }

  async getCar(id: string): Promise<Car | undefined> {
    return this.cars.get(id);
  }

  async createCar(insertCar: InsertCar): Promise<Car> {
    const id = randomUUID();
    const car: Car = {
      currency: "JOD",
      ...insertCar,
      images: insertCar.images ?? null,
      id,
    };
    this.cars.set(id, car);
    return car;
  }

  async updateCar(id: string, update: Partial<InsertCar>): Promise<Car> {
    const existing = this.cars.get(id);
    if (!existing) {
      throw new NotFoundError("Car not found");
    }
    const updated = { ...existing, ...update } as Car;
    this.cars.set(id, updated);
    return updated;
  }

  async deleteCar(id: string): Promise<void> {
    if (!this.cars.delete(id)) {
      throw new NotFoundError("Car not found");
    }
  }
}

export const storage = new DatabaseStorage();
