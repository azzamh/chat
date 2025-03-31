import redis from './redisClient';

export const setKey = async (key: string, value: string, expiryInSeconds: number | null | undefined = 3600) => {
  try {
    if (expiryInSeconds === null || expiryInSeconds === undefined || expiryInSeconds < 0) {
      // Set key with no expiration
      await redis.set(key, value);
    } else {
      // Set key with expiration
      await redis.set(key, value, 'EX', expiryInSeconds);
    }
  } catch (error) {
    console.error('❌ Error setting key:', error);
  }
};

export const getKey = async (key: string, defaultValue: string | undefined = undefined) => {
  try {
    const value = await redis.get(key);
    return value ?? defaultValue;
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
