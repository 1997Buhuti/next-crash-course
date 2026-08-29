import { resolve } from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { subDays } from "date-fns";
import { config } from "dotenv";

import { PrismaClient } from "../generated/prisma/client";

const root = process.cwd();

config({ path: resolve(root, ".env") });
config({ path: resolve(root, ".env.local"), override: true });

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const INCOME_CATEGORIES = ["Salary", "Freelance", "Investments"] as const;
const EXPENSE_CATEGORIES = [
  "Food",
  "Housing",
  "Transport",
  "Entertainment",
  "Utilities",
  "Healthcare",
] as const;

const INCOME_TRANSACTIONS = [
  { description: "Monthly salary", amount: 5200, category: "Salary" },
  { description: "Client project payment", amount: 1850, category: "Freelance" },
  { description: "Dividend payout", amount: 320, category: "Investments" },
  { description: "Bonus", amount: 750, category: "Salary" },
  { description: "Side gig", amount: 420, category: "Freelance" },
] as const;

const EXPENSE_TRANSACTIONS = [
  { description: "Weekly groceries", amount: 142.35, category: "Food" },
  { description: "Rent payment", amount: 1650, category: "Housing" },
  { description: "Gas fill-up", amount: 58.2, category: "Transport" },
  { description: "Streaming subscription", amount: 15.99, category: "Entertainment" },
  { description: "Electric bill", amount: 94.5, category: "Utilities" },
  { description: "Pharmacy", amount: 28.75, category: "Healthcare" },
  { description: "Coffee shop", amount: 6.5, category: "Food" },
  { description: "Bus pass", amount: 45, category: "Transport" },
  { description: "Dinner out", amount: 72.4, category: "Food" },
  { description: "Concert tickets", amount: 120, category: "Entertainment" },
  { description: "Internet bill", amount: 79.99, category: "Utilities" },
  { description: "Doctor visit copay", amount: 35, category: "Healthcare" },
  { description: "Home supplies", amount: 64.2, category: "Housing" },
  { description: "Ride share", amount: 18.6, category: "Transport" },
  { description: "Takeout lunch", amount: 14.25, category: "Food" },
] as const;

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(items: readonly T[]) {
  return items[randomInt(0, items.length - 1)];
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

async function seedCategories(userId: string) {
  const names = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

  const categories = await Promise.all(
    names.map((name) =>
      prisma.transactionCategory.upsert({
        where: { userId_name: { userId, name } },
        create: { userId, name },
        update: {},
      })
    )
  );

  return new Map(categories.map((category) => [category.name, category.id]));
}

async function seedTransactions(
  userId: string,
  categoryIds: Map<string, string>,
  transactionCount: number
) {
  const today = startOfDay(new Date());
  const transactions = Array.from({ length: transactionCount }, (_, index) => {
    const isIncome = index % 5 === 0;
    const template = isIncome
      ? pick(INCOME_TRANSACTIONS)
      : pick(EXPENSE_TRANSACTIONS);

    const categoryId = categoryIds.get(template.category);
    if (!categoryId) {
      throw new Error(`Missing category: ${template.category}`);
    }

    return {
      userId,
      transactionType: isIncome ? ("income" as const) : ("expense" as const),
      description: template.description,
      amount: template.amount + randomInt(0, 20) / 10,
      categoryId,
      transactionDate: subDays(today, randomInt(0, 89)),
    };
  });

  await prisma.transaction.createMany({ data: transactions });
}

async function main() {
  const userId = process.env.SEED_USER_ID;
  const fresh = process.argv.includes("--fresh");

  if (!userId) {
    throw new Error(
      "SEED_USER_ID is required. Set it to your Clerk user id in .env.local, then run `npm run db:seed`."
    );
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required.");
  }

  if (fresh) {
    await prisma.transaction.deleteMany({ where: { userId } });
    await prisma.transactionCategory.deleteMany({ where: { userId } });
    console.log(`Cleared existing seed data for user ${userId}`);
  } else {
    const existingCount = await prisma.transaction.count({ where: { userId } });
    if (existingCount > 0) {
      console.log(
        `Skipping seed: found ${existingCount} transactions for user ${userId}.`
      );
      console.log("Run `npm run db:seed -- --fresh` to replace existing data.");
      return;
    }
  }

  const categoryIds = await seedCategories(userId);
  const transactionCount = Number(process.env.SEED_TRANSACTION_COUNT ?? 40);

  await seedTransactions(userId, categoryIds, transactionCount);

  const [categoryCount, seededTransactionCount] = await Promise.all([
    prisma.transactionCategory.count({ where: { userId } }),
    prisma.transaction.count({ where: { userId } }),
  ]);

  console.log(`Seeded ${categoryCount} categories and ${seededTransactionCount} transactions for user ${userId}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
