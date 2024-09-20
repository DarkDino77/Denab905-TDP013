import assert from 'assert';
import superagent from 'superagent';
import {start_server } from '../../lab1/app.js';
import { run } from '../../lab1/database.js';

let api = 'http://localhost:3000';
let server;

describe("frontend tests", () => {
    before((done) => {
        const port = 3000;
        server = start_server(port, done);
        run();
    });

    it('Check CORS headers when connecting from port 8080', 
        (done) => {
            superagent
            .get('http://localhost:3000/messages')
            .set('Origin', 'http://localhost:8080')
            .end((err, res) => {
                if (err) done(err);
                assert.equal(
                    'http://localhost:8080',
                    res.headers['access-control-allow-origin']
                );

                done();
                
            });
    });

    it('Check for no CORS headers when connecting from not port 8080', 
        (done) => {
            superagent
            .get('http://localhost:3000/messages')
            .set('Origin', 'http://localhost:9000')
            .end((err, res) => {
                if (err) done(err);

               // console.log(res.headers['access-control-allow-origin'])
                assert.equal(res.statusCode, 200);
                assert.notEqual(
                    'http://localhost:9000',
                    res.headers['access-control-allow-origin']
                );

                done();
                
            });
    });

    it('POST /messages with valid message from different origin should return 200', 
        (done) => {
            superagent
            .post(`${api}/messages`)
            .set('Origin', 'http://localhost:8080')
            .send({ 
                "author": "Dennis",
                "message": "hej",
                "time": 0,
                "read": "false"
            })
            .end((err, res) => {
                assert.equal(res.statusCode, 200);
                assert.equal(res.body.message, "hej");
                done(); 
            })
    });

    it('POST /messages with valid message from invalid origin should return 200', 
        (done) => {
            superagent
            .post(`${api}/messages`)
            .send({ 
                "author": "Dennis",
                "message": "hej",
                "time": 0,
                "read": "false"
            })
            .set('Origin', 'http://localhost:9000')
            .end((err, res) => {
                console.log(res);
                assert.equal(res.statusCode, 200);
                assert.equal(res.body.message, "hej");
                assert.notEqual(
                    'http://localhost:9000',
                    res.headers['access-control-allow-origin']
                );
                done(); 
            })
    });

    after((done) => {
        server.close(() => done());
    })
});