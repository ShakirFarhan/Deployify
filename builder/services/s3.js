const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = new S3Client({
  region: process.env.APP_AWS_REGION,
  credentials: {
    accessKeyId: process.env.APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY,
  },
});

const uploadToS3 = async (key, body, type) => {
  const command = new PutObjectCommand({
    Bucket: process.env.APP_AWS_BUCKET,
    Key: key,
    Body: body,
    ContentType: type,
  });
  await s3Client.send(command);
};

module.exports = {
  uploadToS3,
};
