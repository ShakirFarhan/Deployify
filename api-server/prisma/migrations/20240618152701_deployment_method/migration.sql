-- CreateEnum
CREATE TYPE "DeploymentMethod" AS ENUM ('git', 'upload_link');

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "deployment_method" "DeploymentMethod" NOT NULL DEFAULT 'upload_link';
