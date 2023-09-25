-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "total" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Order_Item" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;
