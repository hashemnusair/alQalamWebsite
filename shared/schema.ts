import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const cars = pgTable(
  "cars",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    title: text("title").notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    currency: text("currency").notNull().default("JOD"),
    mileage: integer("mileage").notNull(),
    year: integer("year").notNull(),
    make: text("make").notNull(),
    gearbox: text("gearbox").notNull(),
    engine: text("engine").notNull(),
    drive: text("drive").notNull(),
    fuel: text("fuel").notNull(),
    color: text("color").notNull(),
    origin: text("origin").notNull(),
    images: text("images").array(),
    description: text("description").notNull(),
  },
  (t) => ({
    titleIdx: index("cars_title_idx").on(t.title),
    makeIdx: index("cars_make_idx").on(t.make),
    yearIdx: index("cars_year_idx").on(t.year),
    priceIdx: index("cars_price_idx").on(t.price),
    mileageIdx: index("cars_mileage_idx").on(t.mileage),
    titleIdIdx: index("cars_title_id_idx").on(t.title, t.id),
  }),
);

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

const carImagesSchema = z
  .array(z.string().min(1, "Image URL is required"))
  .min(1, "At least one image is required")
  .optional()
  .nullable();

export const insertCarSchema = createInsertSchema(cars, {
  images: carImagesSchema,
}).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCar = z.infer<typeof insertCarSchema>;
export type Car = typeof cars.$inferSelect;

// Lightweight car summary for list views (omits description)
export type CarListItem = Omit<Car, "description">;

// Filter parameters for car search
export interface CarFilters {
  makes?: string[];
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  minMileage?: number;
  maxMileage?: number;
  fuelTypes?: string[];
  search?: string;
}

// Facets returned alongside paginated results
export interface CarFacets {
  makes: string[];
  bounds: {
    price: { min: number; max: number };
    year: { min: number; max: number };
    mileage: { min: number; max: number };
  };
}

// Paginated response shape
export interface PaginatedCars {
  items: CarListItem[];
  total: number;
  page: number;
  pageSize: number;
  facets: CarFacets;
}
