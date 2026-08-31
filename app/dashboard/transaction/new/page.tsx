import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { NewTransactionForm } from "@/components/transactions/new-transaction-form";
import { getTransactionCategoriesByType } from "@/lib/db/categories";
import { fromDateInputValue, getTodayDateInputValue } from "@/lib/dates";
import { HouseIcon } from "@phosphor-icons/react/ssr";

export default async function NewTransactionPage() {
  const { userId } = await auth.protect();
  const categoriesByType = await getTransactionCategoriesByType(userId);
  const todayDate = getTodayDateInputValue();

  return (
    <div className="flex w-full flex-col items-start gap-6 self-stretch px-4 py-10 sm:px-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              render={<Link href="/dashboard" />}
              className="gap-1.5"
            >
              <HouseIcon className="size-3.5" weight="duotone" />
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard/transaction" />}>
              Transaction
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New Transaction</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <NewTransactionForm
        categoriesByType={categoriesByType}
        defaultTransactionDate={fromDateInputValue(todayDate)}
        maxTransactionDate={todayDate}
      />
    </div>
  );
}
