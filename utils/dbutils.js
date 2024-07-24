const mongoose = require('mongoose');
const env = process.env.NODE_ENV || 'development';
const config = require('../config')[env];

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

module.exports = { connect, close };