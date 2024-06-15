-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "build_command" TEXT NOT NULL DEFAULT 'npm run build',
ADD COLUMN     "output_dir" TEXT NOT NULL DEFAULT 'build';
