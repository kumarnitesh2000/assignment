const server = require("../app");
const should = require("should");
const logger = require("../utils/logger");
const request = require("supertest");
const HttpStatus = require("http-status-codes");
const {
  moderator_1,
  moderator_2,
  moderator_3,
  moderator_4,
  job,
  seeker,
} = require("./data");
const moderatorSchema = require("../models/moderator");
const jobSchema = require("../models/job");
const jobseekerSchema = require("../models/jobseeker");
const configSchema = require("../models/config");
const taskSchema = require("../models/task");
const { currentShift } = require("../utils/helper");
const {createRedisClient}  = require("../utils/dbutils");

describe("test for application flow", function () {
  let jobId;
  let seekerId;
  let reason_1 = "ask for money";
  let reason_2 = "asking for otp";
  let moderator_1_id;
  let moderator_2_id;
  let moderator_3_id;
  let moderator_4_id;
  let current_shift = currentShift();
  // moderator 1 and 2 are night shifts and moderator 3 and 4 day shifts
  before((done) => {
    logger.info("create moderators");
    request(server)
      .post("/moderators")
      .send(moderator_1)
      .expect(HttpStatus.OK)
      // eslint-disable-next-line no-unused-vars
      .end(function (err, res) {
        moderator_1_id = res.body["_id"];
        should.not.exist(err);
        request(server)
          .post("/moderators")
          .send(moderator_2)
          .expect(HttpStatus.OK)
          // eslint-disable-next-line no-unused-vars
          .end(function (err, res) {
            should.not.exist(err);
            moderator_2_id = res.body["_id"];
            request(server)
              .post("/moderators")
              .send(moderator_3)
              .expect(HttpStatus.OK)
              .end(function (err, res) {
                should.not.exist(err);
                moderator_3_id = res.body["_id"];
                request(server)
                  .post("/moderators")
                  .send(moderator_4)
                  .expect(HttpStatus.OK)
                  .end(function (err, res) {
                    should.not.exist(err);
                    moderator_4_id = res.body["_id"];
                    request(server)
                      .post("/jobs")
                      .send(job)
                      .expect(HttpStatus.OK)
                      .end(function (err, res) {
                        should.not.exist(err);
                        jobId = res.body["_id"];
                        request(server)
                          .post("/seekers")
                          .send(seeker)
                          .expect(HttpStatus.OK)
                          .end(function (err, res) {
                            seekerId = res.body["_id"];
                            configSchema
                              .create({ strategy: "round_robin" })
                              .then(() => {
                                done();
                              });
                          });
                      });
                  });
              });
          });
      });
  });
  it("get all moderators", function (done) {
    request(server)
      .get("/moderators")
      .expect(HttpStatus.OK)
      .end(function (err, res) {
        should.not.exist(err);
        done();
      });
  });
  it("hit the report api first time", function (done) {
    request(server)
      .post("/report")
      .send({
        seeker_id: seekerId,
        job_id: jobId,
        reason: reason_1,
      })
      .expect(HttpStatus.OK)
      .end(function (err, res) {
        should.not.exist(err);
        let moderator = res.body["moderator"];
        if(moderator==moderator_1_id || moderator==moderator_3_id){
            // first elements that means code runs correctly
            done();
        }else{
            // test fail
            done(new Error('Test failed: Invalid moderator ID'));
        }
      });
  });
  it("hit the report api second time", function (done) {
    request(server)
      .post("/report")
      .send({
        seeker_id: seekerId,
        job_id: jobId,
        reason: reason_2,
      })
      .expect(HttpStatus.OK)
      .end(function (err, res) {
        should.not.exist(err);
        let moderator = res.body["moderator"];
        if(moderator==moderator_2_id || moderator==moderator_4_id){
            // first elements that means code runs correctly
            done();
        }else{
            // test fail
            done(new Error('Test failed: Invalid moderator ID'));
        }
      });
  });
  after((done) => {
    logger.debug("deleting data");
    moderatorSchema
      .deleteMany({})
      .then(() => {
        return jobSchema.deleteMany({});
      })
      .then(() => {
        return jobseekerSchema.deleteMany({});
      })
      .then(() => {
        return configSchema.deleteMany({});
      })
      .then(() => {
        return taskSchema.deleteMany({});
      })
      .then(() => {
        return createRedisClient();
      })
      .then((redisClient) => {
        return redisClient.flushDb();
      })
      .then(() => {
        done();
      })
      .catch((err) => {
        logger.error(`not able to delete data due to ${err}`);
        done(err);
      });
  });
});
