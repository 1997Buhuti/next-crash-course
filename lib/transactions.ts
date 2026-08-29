import { prisma } from "@/lib/prisma";
import type { TransactionFormValues } from "@/lib/validations/transaction";

async function resolveCategory(userId: string, categoryIdOrName: string) {
  const existingById = await prisma.transactionCategory.findFirst({
    where: { id: categoryIdOrName, userId },
  });

  if (existingById) {
    return existingById;
  }

  return prisma.transactionCategory.upsert({
    where: {
      userId_name: { userId, name: categoryIdOrName },
    },
    create: { userId, name: categoryIdOrName },
    update: {},
  });
}

export async function createTransactionRecord(
  userId: string,
  input: TransactionFormValues
) {
  const category = await resolveCategory(userId, input.categoryId);

  return prisma.transaction.create({
    data: {
      userId,
      transactionType: input.transactionType,
      description: input.description,
      amount: input.amount,
      categoryId: category.id,
      transactionDate: input.transactionDate,
    },
  });
}
