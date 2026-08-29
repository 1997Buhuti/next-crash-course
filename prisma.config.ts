import { resolve } from "node:path";
import { config } from "dotenv";
import { defineConfig } from "prisma/config";

const root = process.cwd();

// Match Next.js: base .env first, then .env.local overrides for local dev
config({ path: resolve(root, ".env") });
config({ path: resolve(root, ".env.local"), override: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "postgresql://localhost:5432/postgres",
  },
});
