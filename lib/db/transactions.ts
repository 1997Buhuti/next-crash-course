import { prisma } from "@/lib/db/prisma";
import type { TransactionFormValues } from "@/lib/validations/transaction";
import type { TransactionType } from "@/generated/prisma/client";

async function resolveCategory(
  userId: string,
  transactionType: TransactionType,
  categoryIdOrName: string
) {
  const existingById = await prisma.transactionCategory.findFirst({
    where: { id: categoryIdOrName, userId, transactionType },
  });

  if (existingById) {
    return existingById;
  }

  return prisma.transactionCategory.upsert({
    where: {
      userId_name_transactionType: {
        userId,
        name: categoryIdOrName,
        transactionType,
      },
    },
    create: { userId, name: categoryIdOrName, transactionType },
    update: {},
  });
}

export async function createTransactionRecord(
  userId: string,
  input: TransactionFormValues
) {
  const category = await resolveCategory(
    userId,
    input.transactionType,
    input.categoryId
  );

  if (category.transactionType !== input.transactionType) {
    throw new Error("Category does not match transaction type.");
  }

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
