/*
  Warnings:

  - The primary key for the `Transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "TransactionItem" DROP CONSTRAINT "TransactionItem_transactionId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(31),
ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Transaction_id_seq";

-- AlterTable
ALTER TABLE "TransactionItem" ALTER COLUMN "transactionId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "TransactionItem" ADD CONSTRAINT "TransactionItem_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
