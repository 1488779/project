-- AlterTable
ALTER TABLE "Animal" ADD COLUMN     "adopted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "adoptedAt" TIMESTAMP(3),
ADD COLUMN     "adoptedBy" INTEGER;

-- AddForeignKey
ALTER TABLE "Animal" ADD CONSTRAINT "Animal_adoptedBy_fkey" FOREIGN KEY ("adoptedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
