/*
  Warnings:

  - You are about to drop the column `totalPurchase` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `totalSale` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `TransactionItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Stock" ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "totalPurchase",
DROP COLUMN "totalSale",
ADD COLUMN     "status" "TransactionStatus" NOT NULL DEFAULT 'PURCHASE',
ADD COLUMN     "totalPrice" INTEGER;

-- AlterTable
ALTER TABLE "TransactionItem" DROP COLUMN "status";
