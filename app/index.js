const cors = require('cors');
const frontApiDocs = require('../swagger');
const health = require('../routes/health');
const moderator = require("../routes/moderator");
const job = require("../routes/job");
const seekers = require("../routes/seekers");
const report = require("../routes/report");
const tasks = require("../routes/task");
const express = require('express');
const strategy = require("../routes/strategy");
const app = express();

app.use(cors());
app.use(express.json());
app.use('/docs',frontApiDocs);
app.use('/',[health,moderator,job,seekers,report,tasks,strategy]);

module.exports = app;