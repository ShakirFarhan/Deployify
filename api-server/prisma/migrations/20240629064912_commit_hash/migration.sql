/*
  Warnings:

  - You are about to drop the `GithubUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Test` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "deployments" ADD COLUMN     "commit_hash" TEXT;

-- DropTable
DROP TABLE "GithubUser";

-- DropTable
DROP TABLE "Test";
