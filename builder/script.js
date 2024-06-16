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

async function publishLog(log) {
  await producer.send({
    topic: 'builder-logs',
    messages: [{ key: 'log', value: JSON.stringify({ DEPLOYMENT_ID, log }) }],
  });
}

async function init() {
  await producer.connect();
  console.log('Started Executing....');
  const outDirPath = path.join(__dirname, 'output');
  validateBuildScript(path.join(outDirPath, 'package.json'));
  const prc = exec(`cd ${outDirPath} && npm install && ${BUILD_COMMAND}`);

  prc.stdout.on('data', async function (data) {
    console.log('LOG:', data.toString());
    await publishLog(data.toString());
  });

  prc.stdout.on('error', async function (data) {
    console.log('ERROR:', data.toString());
    await publishLog(data.toString());
  });

  prc.on('close', async function () {
    console.log('Build Completed');
    await publishLog('Build Completed');

    console.log(process.env);
    // What if the build command generated build folder
    const distPath = path.join(outDirPath, OUTPUT_DIR);

    const distContent = fs.readdirSync(distPath, {
      recursive: true,
    });

    for (const file of distContent) {
      const filePath = path.join(distPath, file);
      if (fs.lstatSync(filePath).isDirectory()) continue;
      console.log('Uploading', filePath);
      await publishLog(`Uploading ${file}`);
      try {
        uploadToS3(
          `outputs/${SUB_DOMAIN}/${file}`,
          fs.createReadStream(filePath),
          mime.lookup(filePath)
        );
      } catch (error) {
        await publishLog(error.message);
        process.exit(1);
      }
      console.log('uploaded', filePath);
    }
    await publishLog(`${SUB_DOMAIN} is live now`);
    console.log(`${SUB_DOMAIN} is live now`);
    process.exit(0);
  });
}

init();
