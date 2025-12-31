import fs from "fs";
import path from "path";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
const { Pool } = pg;
import * as schema from "../shared/schema.js";


function loadEnvFromFile() {
  if (process.env.DATABASE_URL) {
    return;
  }

  const envPath = process.env.ENV_FILE
    ? path.resolve(process.cwd(), process.env.ENV_FILE)
    : path.resolve(process.cwd(), ".env");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, eqIndex).trim();
    if (!key || process.env[key] !== undefined) {
      continue;
    }

    let value = trimmed.slice(eqIndex + 1).trim();
    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

loadEnvFromFile();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Configure it to connect to Supabase Postgres.");
}

// Supabase requires SSL. Allow override via PGSSLMODE=disable if needed.
const useSsl = (process.env.PGSSLMODE ?? "").toLowerCase() !== "disable";
const isSupabasePooler = /(^|@)[^/]*\.pooler\.supabase\.com(?::\d+)?\//.test(connectionString);
const rejectUnauthorized =
  process.env.PG_SSL_REJECT_UNAUTHORIZED !== undefined
    ? process.env.PG_SSL_REJECT_UNAUTHORIZED !== "false"
    : !isSupabasePooler;
const ssl = useSsl ? { rejectUnauthorized } : false;

export const pool = new Pool({
  connectionString,
  max: parseInt(process.env.PG_POOL_SIZE ?? "10", 10),
  ssl,
});

export const db = drizzle(pool, { schema });

export type Database = typeof db;
