/*
  Warnings:

  - The `installation_id` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "installation_id",
ADD COLUMN     "installation_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "users_installation_id_key" ON "users"("installation_id");
