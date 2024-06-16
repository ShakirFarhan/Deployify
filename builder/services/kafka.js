const { Kafka } = require('kafkajs');
const fs = require('fs');
const path = require('path');
console.log(process.env.APP_KAFKA_BROKER);
const kafkaClient = new Kafka({
  clientId: `builder-${process.env.DEPLOYMENT_ID}`,
  brokers: [process.env.APP_KAFKA_BROKER],
  sasl: {
    username: process.env.APP_KAFKA_USERNAME,
    password: process.env.APP_KAFKA_PASSWORD,
    mechanism: process.env.APP_KAFKA_MECHANISM,
  },
  ssl: {
    ca: [fs.readFileSync(path.resolve(__dirname, '../ca.pem'), 'utf-8')],
  },
});
const producer = kafkaClient.producer();
module.exports = {
  producer,
};
