/*
  Warnings:

  - Added the required column `totalPurchase` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalSale` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "totalPurchase" INTEGER NOT NULL,
ADD COLUMN     "totalSale" INTEGER NOT NULL;
