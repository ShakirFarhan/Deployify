import { Kafka } from 'kafkajs';
import { config } from '../config/production';
import fs from 'fs';
import path from 'path';
export const kafkaClient = new Kafka({
  clientId: `API-SERVER`,
  brokers: [config.KAFKA.BROKER],
  sasl: {
    username: config.KAFKA.USERNAME,
    password: config.KAFKA.PASSWORD,
    mechanism: 'plain',
  },
  ssl: {
    ca: [fs.readFileSync(path.resolve(__dirname, '../../ca.pem'), 'utf-8')],
  },
});

export async function logsConsumer() {
  console.log(__dirname);
  const consumer = kafkaClient.consumer({ groupId: 'deployment-logs' });
  await consumer.connect();
  await consumer.subscribe({ topic: 'builder-logs' });
  await consumer.run({
    eachBatch: async function ({
      batch,
      heartbeat,
      commitOffsetsIfNecessary,
      resolveOffset,
    }) {
      const messages = batch.messages;
      for (const message of messages) {
        console.log(message);
        if (!message.value) return;

        const data = JSON.parse(message.value.toString());
        // Insert into DB
        console.log(data);
      }
    },
  });
}
