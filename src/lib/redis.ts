import Redis from "ioredis";
import { parseURL } from "ioredis/built/utils/index.js";

import env from "@/env";

export const redisConnectionOptions = parseURL(env.REDIS_URL);

export const redisClient = new Redis({
  ...redisConnectionOptions,
  maxRetriesPerRequest: null,
});
