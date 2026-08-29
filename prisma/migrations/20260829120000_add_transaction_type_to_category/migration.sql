-- AlterTable
ALTER TABLE "transaction_category" ADD COLUMN "transactionType" "TransactionType" NOT NULL DEFAULT 'expense';

UPDATE "transaction_category"
SET "transactionType" = 'income'
WHERE "name" IN ('Salary', 'Freelance', 'Investments');

ALTER TABLE "transaction_category" ALTER COLUMN "transactionType" DROP DEFAULT;

-- DropIndex
DROP INDEX "transaction_category_userId_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "transaction_category_userId_name_transactionType_key" ON "transaction_category"("userId", "name", "transactionType");

-- CreateIndex
CREATE INDEX "transaction_category_userId_transactionType_idx" ON "transaction_category"("userId", "transactionType");
