export interface Project {
  id: string;
  name: string;
  subDomain: string;
  repo: string;
  userId: string;
  buildCommand: string;
  deploymentMethod?: 'git' | 'upload_link';
  outputDir: string;
  createdAt: string;
  updatedAt: string;
}
export interface EnvVariables {
  id: string;
  key: string;
  value: string;
}
