"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { Controller, useForm, useWatch, type Resolver } from "react-hook-form";

import { createTransaction } from "@/app/dashboard/transaction/new/actions";
import type { TransactionCategoriesByType } from "@/lib/db/categories";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { fromDateInputValue, toDateInputValue } from "@/lib/dates";
import {
  transactionFormSchema,
  type TransactionFormValues,
} from "@/lib/validations/transaction";

type NewTransactionFormProps = {
  categoriesByType: TransactionCategoriesByType;
  /** From server — keeps date fields consistent between SSR and hydration. */
  defaultTransactionDate: Date;
  maxTransactionDate: string;
};

export function NewTransactionForm({
  categoriesByType,
  defaultTransactionDate,
  maxTransactionDate,
}: NewTransactionFormProps) {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(
      transactionFormSchema
    ) as Resolver<TransactionFormValues>,
    // defaultValues = starting *data*, not validation rules
    defaultValues: {
      transactionType: "expense",
      description: "",
      amount: 0,
      categoryId: "",
      transactionDate: defaultTransactionDate,
    },
  });

  const transactionType = useWatch({
    control: form.control,
    name: "transactionType",
  });

  const categories = useMemo(
    () => categoriesByType[transactionType],
    [categoriesByType, transactionType]
  );

  useEffect(() => {
    form.setValue("categoryId", "");
  }, [form, transactionType]);

  async function onSubmit(values: TransactionFormValues) {
    await createTransaction(values);
    form.reset();
  }

  return (
    <Card className="w-full max-w-xl">
      <CardHeader className="border-b">
        <CardTitle className="text-base font-semibold">New Transaction</CardTitle>
        <CardDescription>
          Record a new income or expense.
        </CardDescription>
      </CardHeader>

      <form
        id="new-transaction-form"
        autoComplete="off"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <CardContent className="pt-(--card-spacing) mb-3">
          <FieldGroup>
            <Controller
              name="transactionType"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="transactionType">Type</FieldLabel>
                  <select
                    {...field}
                    id="transactionType"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                    suppressHydrationWarning
                    className="h-8 w-full rounded-none border border-input bg-transparent px-2.5 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Input
                    {...field}
                    id="description"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. Grocery shopping"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="amount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="amount">Amount</FieldLabel>
                  <Input
                    {...field}
                    id="amount"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="0.01"
                    aria-invalid={fieldState.invalid}
                    placeholder="0.00"
                    value={Number.isNaN(field.value) ? "" : field.value}
                    onChange={(event) =>
                      field.onChange(event.target.valueAsNumber)
                    }
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="categoryId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="categoryId">Category</FieldLabel>
                  <select
                    {...field}
                    id="categoryId"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                    suppressHydrationWarning
                    className="h-8 w-full rounded-none border border-input bg-transparent px-2.5 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="transactionDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="transactionDate">Date</FieldLabel>
                  <Input
                    id="transactionDate"
                    type="date"
                    max={maxTransactionDate}
                    aria-invalid={fieldState.invalid}
                    value={
                      field.value instanceof Date
                        ? toDateInputValue(field.value)
                        : ""
                    }
                    onChange={(event) =>
                      field.onChange(
                        event.target.value
                          ? fromDateInputValue(event.target.value)
                          : undefined
                      )
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>

        <CardFooter className="justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
          <Button type="submit" form="new-transaction-form">
            Create transaction
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
