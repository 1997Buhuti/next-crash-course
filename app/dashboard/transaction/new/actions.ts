"use server";

import { auth } from "@clerk/nextjs/server";

import {
  transactionFormSchema,
  type TransactionFormValues,
} from "@/lib/validations/transaction";

/**
 * Placeholder mutation for creating a transaction.
 * Wire persistence here later.
 */
export async function createTransaction(input: TransactionFormValues) {
  await auth.protect();

  const parsed = transactionFormSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Invalid transaction data.");
  }

  // Dummy no-op for now — replace with real create logic.
  console.info("[createTransaction]", parsed.data);
}
