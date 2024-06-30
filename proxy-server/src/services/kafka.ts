import { Kafka } from 'kafkajs';
import fs from 'fs';
import path from 'path';
import { config } from '../config';
const kafkaClient = new Kafka({
  clientId: `proxy-server`,
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
const producer = kafkaClient.producer();
export async function publishAnalytic(data: any) {
  await producer.send({
    topic: 'proxy-analytics',
    messages: [{ key: 'analytic', value: JSON.stringify({ data }) }],
  });
}
