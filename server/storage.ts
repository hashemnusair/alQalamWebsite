import { db } from "./db";
import {
  type User,
  type InsertUser,
  type Car,
  type InsertCar,
  users,
  cars,
} from "@shared/schema";
import { eq } from "drizzle-orm";
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
