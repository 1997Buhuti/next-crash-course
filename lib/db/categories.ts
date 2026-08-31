import { prisma } from "@/lib/db/prisma";
import { DEFAULT_TRANSACTION_CATEGORIES } from "@/lib/constants/default-categories";
import type { TransactionType } from "@/generated/prisma/client";

/** Minimal shape for category dropdowns and other UI selectors. */
export type TransactionCategoryOption = {
  id: string;
  name: string;
};

export type TransactionCategoriesByType = Record<
  TransactionType,
  TransactionCategoryOption[]
>;

/** Copies default categories for a user on first use. Safe to call repeatedly. */
export async function ensureDefaultCategories(userId: string): Promise<void> {
  const count = await prisma.transactionCategory.count({ where: { userId } });
  if (count > 0) {
    return;
  }

  await prisma.transactionCategory.createMany({
    data: DEFAULT_TRANSACTION_CATEGORIES.map(({ name, transactionType }) => ({
      userId,
      name,
      transactionType,
    })),
    skipDuplicates: true,
  });
}

export async function getTransactionCategories(
  userId: string,
  transactionType: TransactionType
): Promise<TransactionCategoryOption[]> {
  await ensureDefaultCategories(userId);

  return prisma.transactionCategory.findMany({
    where: { userId, transactionType },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}

export async function getTransactionCategoriesByType(
  userId: string
): Promise<TransactionCategoriesByType> {
  await ensureDefaultCategories(userId);

  const categories = await prisma.transactionCategory.findMany({
    where: { userId },
    orderBy: [{ transactionType: "asc" }, { name: "asc" }],
    select: { id: true, name: true, transactionType: true },
  });

  const byType: TransactionCategoriesByType = {
    income: [],
    expense: [],
  };

  for (const category of categories) {
    byType[category.transactionType].push({
      id: category.id,
      name: category.name,
    });
  }

  return byType;
}
