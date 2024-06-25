import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
  // url: process.env.REDIS_URL_DEV
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
  await redisClient.connect();
})();

export default redisClient;
