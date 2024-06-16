/*
  Warnings:

  - A unique constraint covering the columns `[name,project_id]` on the table `enviroments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "enviroments_name_project_id_key" ON "enviroments"("name", "project_id");
