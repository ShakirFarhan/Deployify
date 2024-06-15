export interface Project {
  id: string;
  name: string;
  subDomain: string;
  repoUrl: string;
  userId: string;
  buildCommand: string;
  outputDir: string;
  createdAt: string;
  updatedAt: string;
}
export interface EnvVariables {
  id: string;
  key: string;
  value: string;
}
