import { z } from "zod";

/** Tomorrow at end of day — used as the max allowed transaction date. */
function tomorrow(): Date {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(23, 59, 59, 999);
  return date;
}

export const transactionFormSchema = z.object({
  transactionType: z.enum(["income", "expense"], {
    error: "Select income or expense.",
  }),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long")
    .max(300, "Description must be less than 300 characters long"),
  amount: z
    .number({ error: "Amount is required" })
    .min(0, "Amount must be greater than 0")
    .max(1_000_000, "Amount must be less than 1000000"),
  categoryId: z.string().min(1, "Category is required"),
  transactionDate: z
    .date({ error: "Date is required" })
    .max(tomorrow(), "Transaction date cannot be more than one day in the future"),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;
