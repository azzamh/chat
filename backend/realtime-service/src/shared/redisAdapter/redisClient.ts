import Redis from 'ioredis';
import { promisify } from 'util'

const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  password: process.env.REDIS_PASSWORD,  // If Redis is secured
  db: 0                        // Optional: Select specific DB (default is 0)
});


// Export for reuse
export default redis;


export const getAsync = promisify(redis.get).bind(redis)
export const setAsync = promisify(redis.set).bind(redis)
