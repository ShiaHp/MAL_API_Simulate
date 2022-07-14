const redis = require("ioredis");
const util = require('util');
const redisClient = redis.createClient({
  port: 6379, // Redis port
  host: "127.0.0.1", // Redis host
  username: "", // needs Redis >= 6
  password: "",
  db: 0, // Defaults to 0
});




module.exports = redisClient;