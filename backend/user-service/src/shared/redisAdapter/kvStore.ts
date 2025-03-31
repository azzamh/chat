import redis from './redisClient';

export const setKey = async (key: string, value: string, expiryInSeconds?: number) => {
  try {
    if (expiryInSeconds) {
      await redis.set(key, value, 'EX', expiryInSeconds);
    } else {
      await redis.set(key, value, 'EX', 3600);
    }
  } catch (error) {
    console.error('❌ Error setting key:', error);
  }
};

export const getKey = async (key: string) => {
  try {
    const value = await redis.get(key);
    return value;
  } catch (error) {
    console.error('❌ Error getting key:', error);
    return null;
  }
};

// // Test the KV operations
// (async () => {
//   await setKey('user:azzam', 'Hello, Azzam!', 30); // Key expires in 30 seconds
//   await getKey('user:azzam');
// })();
