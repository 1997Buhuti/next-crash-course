import { prisma } from "@/lib/prisma";
import type { TransactionType } from "@/generated/prisma/client";

export async function getTransactionCategories(
  userId: string,
  transactionType: TransactionType
) {
  return prisma.transactionCategory.findMany({
    where: { userId, transactionType },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}
