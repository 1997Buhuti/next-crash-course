"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { createTransactionRecord } from "@/lib/transactions";
import {
  transactionFormSchema,
  type TransactionFormValues,
} from "@/lib/validations/transaction";

export async function createTransaction(input: TransactionFormValues) {
  const { userId } = await auth.protect();

  const parsed = transactionFormSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Invalid transaction data.");
  }

  await createTransactionRecord(userId, parsed.data);

  revalidatePath("/dashboard");
}
