const path = require('path');
const { exec } = require('child_process');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();
const mime = require('mime-types');
const validateBuildScript = require('./utils/validation');
const { uploadToS3 } = require('./services/s3');
const { producer } = require('./services/kafka');
const SUB_DOMAIN = process.env.SUB_DOMAIN;
const BUILD_COMMAND = process.env.BUILD_COMMAND;
const OUTPUT_DIR = process.env.OUTPUT_DIR;
const DEPLOYMENT_ID = process.env.DEPLOYMENT_ID;

async function publishLog(log, status) {
  await producer.send({
    topic: 'builder-logs',
    messages: [
      { key: 'log', value: JSON.stringify({ DEPLOYMENT_ID, log, status }) },
    ],
  });
}

async function init() {
  await producer.connect();
  console.log('Started Executing....');

  await publishLog('Starting deployment process...', 'starting');
  const outDirPath = path.join(__dirname, 'output');
  console.log('Validating build script...');
  await publishLog('Validating build script...');
  validateBuildScript(path.join(outDirPath, 'package.json'));
  console.log('Installing dependencies and running build command...');
  await publishLog(
    'Installing dependencies and running build command...',
    'building'
  );
  const prc = exec(`cd ${outDirPath} && npm install && ${BUILD_COMMAND}`);
  console.log(process.env.GIT_REPO);
  console.log(process.env.REPOSITORY_URL);
  console.log(process.env.GIT_ACCESS_TOKEN);
  console.log(process.env.GIT_USERNAME);

  prc.stdout.on('data', async function (data) {
    console.log('LOG:', data.toString());
    await publishLog(data.toString());
  });

  prc.stdout.on('error', async function (data) {
    console.log('ERROR:', data.toString());
    await publishLog(data.toString(), 'failed');
  });

  prc.on('close', async function (code) {
    console.log(code);
    if (code === 0) {
      console.log('Build completed successfully');
      await publishLog('Build completed successfully.');
    } else {
      console.log('Build failed');
      await publishLog('Build failed.', 'failed');
      process.exit(1);
    }

    console.log('Reading build output directory...');
    await publishLog('Reading build output directory...', 'uploading');
    const distPath = path.join(outDirPath, OUTPUT_DIR);

    const distContent = fs.readdirSync(distPath, {
      recursive: true,
    });

    for (const file of distContent) {
      const filePath = path.join(distPath, file);
      if (fs.lstatSync(filePath).isDirectory()) continue;
      console.log('Uploading', filePath);
      await publishLog(`Uploading ${file}...`);
      try {
        uploadToS3(
          `outputs/${SUB_DOMAIN}/${file}`,
          fs.createReadStream(filePath),
          mime.lookup(filePath)
        );
      } catch (error) {
        console.log(`Upload failed: ${error.message}`);
        await publishLog(`Upload failed: ${error.message}`, 'failed');
        process.exit(1);
      }
    }
    await publishLog(`${SUB_DOMAIN} is live now`, 'deployed');
    console.log(`${SUB_DOMAIN} is live now`);
    process.exit(0);
  });
}

init();
