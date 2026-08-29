"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { getTransactionCategories } from "@/lib/categories";
import { createTransactionRecord } from "@/lib/transactions";
import {
  transactionFormSchema,
  type TransactionFormValues,
} from "@/lib/validations/transaction";
import type { TransactionType } from "@/generated/prisma/client";

export async function getCategories(transactionType: TransactionType) {
  const { userId } = await auth.protect();

  return getTransactionCategories(userId, transactionType);
}

export async function createTransaction(input: TransactionFormValues) {
  const { userId } = await auth.protect();

  const parsed = transactionFormSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Invalid transaction data.");
  }

  await createTransactionRecord(userId, parsed.data);

  revalidatePath("/dashboard");
}
