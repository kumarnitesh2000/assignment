const server = require('../app');
const should = require('should');
const request = require('supertest');
const HttpStatus = require('http-status-codes');

describe('test the health of app', function () {
    it('check health at /health GET',function (done){
        request(server)
        .get('/health')
        .expect(HttpStatus.OK)
        .end(function(err, res) {
            should.not.exist(err);
            done();
        });
    })
})


