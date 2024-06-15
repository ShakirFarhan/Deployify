import httpStatus from 'http-status';
import ApiError from './apiError';
import { EnvVariables } from '../types/project.types';

export const validateBuildCommand = (command: string) => {
  if (!command) return;

  const validBuildCommands = [
    'npm run build',
    'react-scripts build',
    'next build',
    'vite build',
    'parcel build',
    'webpack',
    'gulp build',
    'gatsby build',
    'hugo',
    'jekyll build',
    'yarn build',
    'vue-cli-service build',
  ];

  if (typeof command !== 'string' || !validBuildCommands.includes(command)) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Invalid command - ${command}`);
  }
  return;
};

export const validateEnvs = (
  envs: EnvVariables[],
  validateId: boolean = false
) => {
  console.log(envs);
  if (!Array.isArray(envs)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Envs must be an array');
  }
  for (const env of envs) {
    if (!env.key || !env.value || (validateId && !env.id)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Each env must have key and value' + (validateId ? ' and id' : '')
      );
    }
  }
  return;
};
