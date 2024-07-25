const mongoose = require('mongoose');
const env = process.env.NODE_ENV || 'development';
const config = require('../config')[env];
const {createClient} = require("redis");

function connect() {
  return new Promise((resolve, reject) => {
    mongoose.connect(config.mongoURI,{})
        .then((res, err) => {
        if(err) {
          console.log("not connected");
          return reject(err);
        }
        resolve();
        })
  });
}

function close() {
  return mongoose.disconnect();
}

const createRedisClient = () => {
  return createClient({
    password: config.redis_password,
    socket: {
        host: config.redis_host,
        port: config.redis_port
    }
  }).connect();
}

module.exports = { connect, close, createRedisClient };