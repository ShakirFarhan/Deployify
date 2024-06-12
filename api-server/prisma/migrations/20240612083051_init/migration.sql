-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('local', 'github', 'google');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('active', 'suspended', 'deactivated');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'admin', 'moderator');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT,
    "github_id" TEXT,
    "full_name" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "github_username" TEXT,
    "status" "AccountStatus" NOT NULL DEFAULT 'active',
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "provider" "AuthProvider" NOT NULL DEFAULT 'local',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "slug" TEXT NOT NULL,
    "repo_url" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deployment" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "Deployment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_password_key" ON "User"("password");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deployment" ADD CONSTRAINT "Deployment_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
