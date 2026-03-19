const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL
});

let isConnected = false;

client.on('error', (err) => {
  console.warn('Redis not available:', err.message);
  isConnected = false;
});

client.on('connect', () => {
  console.log('Redis Connected');
  isConnected = true;
});

const connectRedis = async () => {
  try {
    await client.connect();
  } catch (error) {
    console.warn('Redis connection failed, running without cache');
    isConnected = false;
  }
};

const getCache = async (key) => {
  if (!isConnected) return null;
  try {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
};

const setCache = async (key, value, expiry = 3600) => {
  if (!isConnected) return;
  try {
    await client.setEx(key, expiry, JSON.stringify(value));
  } catch (error) {
    console.warn('Cache set failed');
  }
};

const deleteCache = async (key) => {
  if (!isConnected) return;
  try {
    await client.del(key);
  } catch (error) {
    console.warn('Cache delete failed');
  }
};

module.exports = { client, connectRedis, getCache, setCache, deleteCache };
