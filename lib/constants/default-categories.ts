import type { TransactionType } from "@/generated/prisma/client";

export type DefaultCategoryDefinition = {
  name: string;
  transactionType: TransactionType;
};

export const DEFAULT_TRANSACTION_CATEGORIES: DefaultCategoryDefinition[] = [
  { name: "Salary", transactionType: "income" },
  { name: "Freelance", transactionType: "income" },
  { name: "Investments", transactionType: "income" },
  { name: "Food", transactionType: "expense" },
  { name: "Housing", transactionType: "expense" },
  { name: "Transport", transactionType: "expense" },
  { name: "Entertainment", transactionType: "expense" },
  { name: "Utilities", transactionType: "expense" },
  { name: "Healthcare", transactionType: "expense" },
];
