import { Kafka } from 'kafkajs';
import { config } from '../config/production';
import fs from 'fs';
import path from 'path';
import ProjectService from './project.service';
import eventEmitter from '../utils/eventEmitter';
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
  const consumer = kafkaClient.consumer({ groupId: 'deployment-logs' });
  await consumer.connect();
  await consumer.subscribe({ topics: ['builder-logs', 'proxy-analytics'] });
  await consumer.run({
    autoCommit: false,
    eachBatch: async function ({
      batch,
      heartbeat,
      commitOffsetsIfNecessary,
      resolveOffset,
      pause,
    }) {
      const messages = batch.messages;
      for (const message of messages) {
        if (!message.value) return;
        try {
          if (batch.topic === 'builder-logs') {
            const { DEPLOYMENT_ID, log, status } = JSON.parse(
              message.value.toString()
            ) as {
              DEPLOYMENT_ID: string;
              log: string;
              status?: any;
            };

            if (status) {
              await ProjectService.updateDeployment(DEPLOYMENT_ID, { status });
            }
            // Emitting a new Event for SSE
            eventEmitter.emit(
              'log',
              JSON.stringify({ deploymentId: DEPLOYMENT_ID, log })
            );
            await ProjectService.createLog(DEPLOYMENT_ID, log);
          } else if (batch.topic === 'proxy-analytics') {
            /* 
            Handling Analytics
            Either Storing in Current DB(Postgres) or Influx
            */
          }
          resolveOffset(message.offset);
          await commitOffsetsIfNecessary({
            topics: [
              {
                topic: batch.topic,
                partitions: [
                  {
                    partition: batch.partition,
                    offset: message.offset,
                  },
                ],
              },
            ],
          });
          await heartbeat();
        } catch (error) {
          pause();
          setTimeout(() => {
            consumer.resume([{ topic: 'builder-logs' }]);
          }, 60 * 1000);
        }
      }
    },
  });
}
