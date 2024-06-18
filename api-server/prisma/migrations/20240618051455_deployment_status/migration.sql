/*
  Warnings:

  - The values [pending,inprogress,success,failed] on the enum `DeploymentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DeploymentStatus_new" AS ENUM ('queued', 'starting', 'building', 'uploading', 'deployed', 'cancelled');
ALTER TABLE "deployments" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "deployments" ALTER COLUMN "status" TYPE "DeploymentStatus_new" USING ("status"::text::"DeploymentStatus_new");
ALTER TYPE "DeploymentStatus" RENAME TO "DeploymentStatus_old";
ALTER TYPE "DeploymentStatus_new" RENAME TO "DeploymentStatus";
DROP TYPE "DeploymentStatus_old";
ALTER TABLE "deployments" ALTER COLUMN "status" SET DEFAULT 'queued';
COMMIT;

-- AlterTable
ALTER TABLE "deployments" ALTER COLUMN "status" SET DEFAULT 'queued';
