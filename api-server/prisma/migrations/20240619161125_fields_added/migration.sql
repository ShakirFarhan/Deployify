/*
  Warnings:

  - You are about to drop the column `repo_url` on the `projects` table. All the data in the column will be lost.
  - Added the required column `repo` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "repo_url",
ADD COLUMN     "repo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "github_app_token" TEXT,
ADD COLUMN     "installation_id" TEXT;
