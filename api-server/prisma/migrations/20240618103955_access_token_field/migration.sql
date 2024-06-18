/*
  Warnings:

  - You are about to drop the column `github_id` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "github_id",
ADD COLUMN     "github_access_token" TEXT;
