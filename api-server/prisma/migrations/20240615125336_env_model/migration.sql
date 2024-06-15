/*
  Warnings:

  - You are about to drop the column `variables` on the `enviroments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "enviroments" DROP COLUMN "variables";

-- CreateTable
CREATE TABLE "enviroment_variables" (
    "id" TEXT NOT NULL,
    "environment_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enviroment_variables_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "enviroment_variables_environment_id_key_key" ON "enviroment_variables"("environment_id", "key");

-- AddForeignKey
ALTER TABLE "enviroment_variables" ADD CONSTRAINT "enviroment_variables_environment_id_fkey" FOREIGN KEY ("environment_id") REFERENCES "enviroments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
