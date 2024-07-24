require('dotenv').config();

module.exports = {
    development: {
        logDirectory: process.env.LOG_DIRECTORY || "/var/log/app",
        port:process.env.PORT || 5000,
        mongoURI: process.env.URI,
        redis_host: process.env.REDIS_HOST,
        redis_password: process.env.REDIS_PASSWORD,
        redis_port: process.env.REDIS_PORT
    },
    test: {
        logDirectory: process.env.LOG_DIRECTORY || "/var/log/app",
        port:process.env.PORT || 5000,
        mongoURI: process.env.URI,
        redis_host: process.env.REDIS_HOST,
        redis_password: process.env.REDIS_PASSWORD,
        redis_port: process.env.REDIS_PORT
    }
}