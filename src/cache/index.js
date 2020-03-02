import cache from "persistent-cache";
import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;
const redisEnabled = !!redisUrl;

let redis;
let memoryCache;

if (redisEnabled) {
  redis = new Redis(redisUrl);
} else {
  memoryCache = cache();
}

export default {
  async set(key, value) {
    if(redisEnabled) {
      return redis.set(key, JSON.stringify(value))
    } else {
      return new Promise((resolve, reject) => memoryCache.put(key, value, (err, val) => {
        if(err) reject(err);
        else resolve(val);
      }))
    }
  },
  async get(key) {
    if(redisEnabled) {
      return redis.get(key).then(str => JSON.parse(str));
    } else {
      return new Promise((resolve, reject) => memoryCache.get(key, (err, val) => {
        if(err) reject(err);
        else resolve(val);
      }))
    }
  },
}
