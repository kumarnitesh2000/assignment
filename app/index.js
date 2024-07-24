const cors = require('cors');
const frontApiDocs = require('../swagger');
const health = require('../routes/health');
const express = require('express');
const app = express();

app.use(cors());
app.use('/docs',frontApiDocs);
app.use('/',[health]);

module.exports = app;