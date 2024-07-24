require('dotenv').config();

module.exports = {
    development: {
        logDirectory: process.env.LOG_DIRECTORY || "/var/log/app",
        port:process.env.PORT || 5000,
        mongoURI: process.env.URI
    },
    test: {
        logDirectory: process.env.LOG_DIRECTORY || "/var/log/app",
        port:process.env.PORT || 5000,
        mongoURI: process.env.URI
    }
}