const fs = require('fs');
function validateBuildScript(packageJsonPath) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  if (!packageJson || !packageJson.scripts || !packageJson.scripts.build) {
    console.error('Error: No "build" script found in package.json.');
    process.exit(1);
  }

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

  const buildScript = packageJson.scripts.build.trim();
  if (!validBuildCommands.includes(buildScript)) {
    console.error(`Error: "${buildScript}" is not a recognized build script.`);
    process.exit(1);
  }
}
module.exports = validateBuildScript;
