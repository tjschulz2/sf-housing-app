import { createClient } from "redis";

export async function createRedisClient() {
  if (!process.env.REDIS_URL) {
    console.error("Environment Variable 'REDIS_URL' undefined");
    return;
  }
  try {
    const client = createClient({
      url: process.env.REDIS_URL,
    });
    client.on("error", (err) => console.log("Redis Client Error", err));
    await client.connect();
    return client;
  } catch (err) {
    console.error(err);
  }
}
