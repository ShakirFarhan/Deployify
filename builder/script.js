const path = require('path');
const { exec } = require('child_process');
const dotenv = require('dotenv');
const fs = require('fs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const Redis = require('ioredis');
const pub = new Redis(process.env.APP_REDIS_URL);
dotenv.config();
const mime = require('mime-types');
const s3Client = new S3Client({
  region: process.env.APP_AWS_REGION,
  credentials: {
    accessKeyId: process.env.APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY,
  },
});
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
  console.log(buildScript);
  if (!validBuildCommands.includes(buildScript)) {
    console.error(`Error: "${buildScript}" is not a recognized build script.`);
    process.exit(1);
  }
}
const APP_PROJECT_SLUG = process.env.APP_PROJECT_SLUG;
function publishLog(log) {
  pub.publish(`LOGS:${APP_PROJECT_SLUG}`, JSON.stringify({ log }));
}

async function init() {
  console.log('Started Executing....');
  const outDirPath = path.join(__dirname, 'output');
  validateBuildScript(path.join(outDirPath, 'package.json'));
  const prc = exec(`cd ${outDirPath} && npm install && npm run build`);

  prc.stdout.on('data', function (data) {
    console.log('LOG:', data.toString());
    publishLog(data.toString());
  });

  prc.stdout.on('error', function (data) {
    console.log('ERROR:', data.toString());
    publishLog(data.toString());
  });

  prc.on('close', async function () {
    console.log('Build Completed');
    publishLog('Build Completed');
    // What if the build command generated build folder
    const distPath = path.join(outDirPath, 'dist');

    const distContent = fs.readdirSync(distPath, {
      recursive: true,
    });

    for (const file of distContent) {
      const filePath = path.join(distPath, file);
      if (fs.lstatSync(filePath).isDirectory()) continue;
      console.log('Uploading', filePath);
      publishLog(`Uploading ${file}`);
      try {
        const command = new PutObjectCommand({
          Bucket: process.env.APP_AWS_BUCKET,
          Key: `outputs/${APP_PROJECT_SLUG}/${file}`,
          Body: fs.createReadStream(filePath),
          ContentType: mime.lookup(filePath),
        });
        await s3Client.send(command);
      } catch (error) {
        publishLog(error.message);
        process.exit(1);
      }
      console.log('uploaded', filePath);
    }
    publishLog(`${APP_PROJECT_SLUG} is live now`);
    console.log(`${APP_PROJECT_SLUG} is live now`);
    process.exit(0);
  });
}

init();
