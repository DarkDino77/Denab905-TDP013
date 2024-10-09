import assert from 'assert';
import superagent from 'superagent';
import {start_server } from '../app.js';
import { run, get_all_messages, save_message } from '../database.js';
import { getDatabaseConnection } from '../mongoUtils.js';


let api = 'http://localhost:3000';
let server;

describe('database api tests', () => {
    before((done) => {
        const port = 3000;
        server = start_server(port, done);
        run();
    }); 

    it('GET /messages should return nothing first time', 
        (done) => {
            superagent
                .get(`${api}/messages`)
                .end((err, res) => {
                    if (err) done(err);
                    let msgs = res.body;
                    assert.deepEqual(msgs, {});

                    done();
                });
    });

    it('POST /messages with valid message should return 200', 
        (done) => {
            superagent
            .post(`${api}/messages`)
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

    it('PATCH /messages/:id to true should update read status and return 200',   (done) => {
        superagent
        .post(`${api}/messages`)
        .send({ 
            "author": "Dennis",
            "message": "hej",
            "time": 0,
            "read": "false"
        })
        .end((err, res) => {
            assert.equal(res.statusCode, 200);
            assert.equal(res.body.message, "hej");
            let savedMessage = res.body._id;

        superagent
            .patch(`${api}/messages/${savedMessage}`)
            .send({read: "true"})
            .end((err, res) => {
                if (err) done(err);
                assert.equal(res.statusCode, 200);

                //Verify that the message has been updated
                superagent
                    .get(`${api}/messages/${savedMessage}`)
                    .end((err, res) => {
                        if (err) done(err);
                        assert.equal(res.body.read, true);
                    });
            });

            done();
        });

    });
    
    it('PATCH /messages/:id to false should update read status and return 200',   (done) => {
        superagent
        .post(`${api}/messages`)
        .send({ 
            "author": "Dennis",
            "message": "hej",
            "time": 0,
            "read": "true"
        })
        .end((err, res) => {
            assert.equal(res.statusCode, 200);
            assert.equal(res.body.message, "hej");
            let savedMessage = res.body._id;

        superagent
            .patch(`${api}/messages/${savedMessage}`)
            .send({read: "false"})
            .end((err, res) => {
                if (err) done(err);
                assert.equal(res.statusCode, 200);

                //Verify that the message has been updated
                superagent
                    .get(`${api}/messages/${savedMessage}`)
                    .end((err, res) => {
                        if (err) done(err);
                        assert.equal(res.body.read, false);
                    });
            });

            done();
        });

    });

    
    it('GET /messages/999 should return 400 for invalid ID', (done) => {
        superagent
            .get(`${api}/messages/999`)
            .end((err, res) => {
                assert.equal(res.statusCode, 400);
                done();
            });
    });

    it('GET /messages/66e7da6a7a012ac151043c7e should return 400 for invalid ID', (done) => {
        superagent
            .get(`${api}/messages/66e7da6a7a012ac151043c7e`)
            .end((err, res) => {
                assert.equal(res.statusCode, 400);
                done();
            });
    });

    it('PATCH /messages/66e7da6a7a012ac151043c7e should return 400 for invalid ID', (done) => {
        superagent
            .patch(`${api}/messages/66e7da6a7a012ac151043c7e`)
            .send({ read: "true" })
            .end((err, res) => {
                assert.equal(res.statusCode, 400);
                done();
            });
    });

    it('PATCH /messages/999 should return 400 for invalid ID', (done) => {
        superagent
            .patch(`${api}/messages/999`)
            .send({ read: "true" })
            .end((err, res) => {
                assert.equal(res.statusCode, 400);
                done();
            });
    });

    it('GET /messages should now return a JSON object with 2 elements', 
        (done) => {
            superagent
                .get(`${api}/messages`)
                .end((err, res) => {
                    if (err) done(err);
                    let msgs = res.body;

                    assert.notEqual(msgs, {});
                    assert.notEqual(msgs.length, 0);

                    done();
                });
    });

    it('POST /messages with non-string message should return 400', (done) => {
        superagent
            .post(`${api}/messages`)
            .send({ "message": 12345 })
            .end((err, res) => {
                assert.equal(res.statusCode, 400);
                done();
            });
    });

    it('POST /messages with no message field should return 400', (done) => {
        superagent
            .post(`${api}/messages`)
            .send({ "text": "This is a wrong field" })
            .end((err, res) => {
                assert.equal(res.statusCode, 400);
                done();
            });
    });

    it('PATCH /messages/:id with invalid read status should return 400', (done) => {
        superagent
        .post(`${api}/messages`)
        .send({ 
            "author": "Dennis",
            "message": "hej",
            "time": 0,
            "read": "true"
        })
        .end((err, res) => {
            assert.equal(res.statusCode, 200);
            assert.equal(res.body.message, "hej");
            let savedMessage = res.body._id;

        superagent
            .patch(`${api}/messages/${savedMessage}`)
            .send({read: "yes"})
            .end((err, res) => {
                assert.equal(res.statusCode, 400);
            });

            done();
        });
    });

    it('GET /non-existent-route should return 404', (done) => {
        superagent
            .get(`${api}/non-existent-route`)
            .end((err, res) => {
                assert.equal(res.statusCode, 404);
                done();
            });
    });

    it('POST /messages with invalid parameters should return 400', (done) => {
        superagent
            .post(`${api}/messages`)
            .send({ "abc": "heh"})
            .end((err, res) => {
                assert.equal(res.statusCode, 400);
                
                done(); 
            })
    });

    it('/messages with invalid method should return 405', (done) => {
        superagent
            .patch(`${api}/messages`)
            .send({ "abc": "heh"})
            .end((err, res) => {
                assert.equal(res.statusCode, 405);
                done(); 
            })
    });

    it('PATCH /messages/0 with invalid parameters should return 400', (done) => {
        superagent
            .patch(`${api}/messages/0`)
            .send({ "abc": "heh"})
            .end((err, res) => {
                assert.equal(res.statusCode, 400);

                done(); 
            })
    });

    it('POST /messages/0 with invalid method should return 405', (done) => {
        superagent
            .post(`${api}/messages/0`)
            .send({ "message": "heh"})
            .end((err, res) => {
                assert.equal(res.statusCode, 405);

                done(); 
            })
    });

    it('POST /messages with message longer than 140 characters returns 400', (done) => {
        superagent
            .post(`${api}/messages`)
            .send({ "message": 
                "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"})
            .end((err, res) => {
                assert.equal(res.statusCode, 400);
                done(); 
            })
    });

    it('POST /messages with empty message returns 400', (done) => {
        superagent
            .post(`${api}/messages`)
            .send({ "message": 
                ""})
            .end((err, res) => {
                assert.equal(res.statusCode, 400);
                done(); 
            })
    });

    it('POST /messages where message is an object are not allowed', (done) => {
        superagent
            .post(`${api}/messages`)
            .send({ "message": 
                {"hej": "hej"}})
            .end((err, res) => {
                assert.equal(res.statusCode, 400);
                done(); 
            })
        
    });

    it('POST /messages/:id with invalid read key should return 400', (done) => {
        superagent
        .post(`${api}/messages`)
        .send({ 
            "author": "Dennis",
            "message": "hej",
            "time": 0,
            "read": true
        })
        .end((err, res) => {
            assert.equal(res.statusCode, 400);

            done();
        });
    });

    it('POST /messages/:id with read value not set should return 200', (done) => {
        superagent
        .post(`${api}/messages`)
        .send({ 
            "author": "Dennis",
            "message": "hej",
            "time": 0,
            "read": ""
        })
        .end((err, res) => {
            assert.equal(res.statusCode, 200);

            done();
        });
    });

    it('POST /messages/:id without all keys set should return 400', (done) => {
        superagent
        .post(`${api}/messages`)
        .send({ 
            "message": "hej",
            "time": 0,
            "read": ""
        })
        .end((err, res) => {
            assert.equal(res.statusCode, 400);

            done();
        });
    });

    it('POST /messages/:id without all keys set should return 400', (done) => {
        superagent
        .post(`${api}/messages`)
        .send({ 
            "author": "hej",
            "message": "hej",
            "read": ""
        })
        .end((err, res) => {
            assert.equal(res.statusCode, 400);

            done();
        });
    });

    after((done) => {
        server.close(() => done());
    })
});


