import Redis from 'ioredis';
//The Redis client lets your backend talk to Redis, a lightning-fast temporary database used to cache data, 
// manage sessions, or handle real-time features — making your app faster and more efficient.


const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
});


redisClient.on('connect', () => {
    console.log('Redis connected');
})

export default redisClient;