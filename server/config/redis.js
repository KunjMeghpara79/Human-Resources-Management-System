const redis = require('redis');

let redisClient = null;

const connectRedis = async () => {
    try {
        redisClient = redis.createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379'
        });

        redisClient.on('error', (err) => {
            console.error('Redis Client Error:', err);
        });

        redisClient.on('connect', () => {
            console.log('Redis Client Connected');
        });

        await redisClient.connect();
        return redisClient;
    } catch (error) {
        console.error('Redis connection error:', error);
        // Return null if Redis is not available (graceful degradation)
        return null;
    }
};

const getRedisClient = () => {
    return redisClient;
};

const cacheGet = async (key) => {
    if (!redisClient) return null;
    try {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Redis GET error:', error);
        return null;
    }
};

const cacheSet = async (key, value, expiry = 3600) => {
    if (!redisClient) return false;
    try {
        await redisClient.setEx(key, expiry, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Redis SET error:', error);
        return false;
    }
};

const cacheDelete = async (key) => {
    if (!redisClient) return false;
    try {
        await redisClient.del(key);
        return true;
    } catch (error) {
        console.error('Redis DELETE error:', error);
        return false;
    }
};

module.exports = {
    connectRedis,
    getRedisClient,
    cacheGet,
    cacheSet,
    cacheDelete
};

