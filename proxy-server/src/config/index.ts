export const config = {
  KAFKA: {
    BROKER: process.env.APP_KAFKA_BROKER as unknown as string,
    USERNAME: process.env.APP_KAFKA_USERNAME as string,
    PASSWORD: process.env.APP_KAFKA_PASSWORD as string,
  },
};
