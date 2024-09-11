import assert from 'assert';
import superagent from 'superagent';
import {start_server} from '../app.js';
import {run} from '../database.js';

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

                    assert.deepEqual(msgs, []);

                    done();
                });
    });

    it('POST /messages should add "Dennis"', (done) => {
        superagent
            .post(`${api}/messages`)
            .send({ "message": "Dennis"})
            .end((err, res) => {
                assert.equal(res.statusCode, 200);

                done(); 
            })
        
    });

    it('GET /messages should now return a message containing "Dennis"', 
        (done) => {
            superagent
                .get(`${api}/messages`)
                .end((err, res) => {
                    if (err) done(err);
                    const msg = res.body[0];
                    assert.equal(msg.message, "Dennis");
                    assert.equal(msg.id, 0);
                    assert.equal(msg.read, false);

                    done();
                });
    });

    it('PATCH /messages/0 to set status should return 200', 
        (done) => {
            superagent
                .patch(`${api}/messages/0`)
                .send({ "read": "true" })
                .end((err, res) => {
                    if (err) done(err);
                    assert.equal(res.statusCode, 200);

                    done();
                });
    });

    it('GET /messages/0 should now return a message marked as "read"', 
        (done) => {
            superagent
                .get(`${api}/messages/0`)
                .end((err, res) => {
                    if (err) done(err);
                    const msg = res.body;
                    assert.equal(msg.message, "Dennis");
                    assert.equal(msg.id, 0);
                    assert.equal(msg.read, true);

                    done();
                });
    });

    it('POST /messages should add "Elvin"', (done) => {
        superagent
            .post(`${api}/messages`)
            .send({ "message": "Elvin"})
            .end((err, res) => {
                assert.equal(res.statusCode, 200);

                done(); 
            })
        
    });

    it('GET /messages should now return an array with two elements', 
        (done) => {
            superagent
                .get(`${api}/messages`)
                .end((err, res) => {
                    if (err) done(err);
                    let msgs = res.body;

                    assert.notEqual(msgs, []);
                    assert.equal(msgs.length, 2);
                    
                    assert.equal(msgs[0].message, "Dennis");
                    assert.equal(msgs[0].id, 0);
                    assert.equal(msgs[0].read, true);

                    assert.equal(msgs[1].message, "Elvin");
                    assert.equal(msgs[1].id, 1);
                    assert.equal(msgs[1].read, false);

                    done();
                });
    });

    it('GET /messages/1 should return a message containing "Elvin"', 
        (done) => {
            superagent
                .get(`${api}/messages/1`)
                .end((err, res) => {
                    if (err) done(err);
                    const msg = res.body;
                    assert.equal(msg.message, "Elvin");
                    assert.equal(msg.id, 1);
                    assert.equal(msg.read, false);

                    done();
                });
    });

    it('PATCH /messages/0 to set status should return 200', 
        (done) => {
            superagent
                .patch(`${api}/messages/0`)
                .send({ "read": "false" })
                .end((err, res) => {
                    if (err) done(err);
                    assert.equal(res.statusCode, 200);

                    done();
                });
    });

    it('PATCH /messages/1 to set status should return 200', 
        (done) => {
            superagent
                .patch(`${api}/messages/1`)
                .send({ "read": "true" })
                .end((err, res) => {
                    if (err) done(err);
                    assert.equal(res.statusCode, 200);

                    done();
                });
    });

    it('GET /messages/0 should now return a message marked as " not read"', 
        (done) => {
            superagent
                .get(`${api}/messages/0`)
                .end((err, res) => {
                    if (err) done(err);
                    const msg = res.body;
                    assert.equal(msg.message, "Dennis");
                    assert.equal(msg.id, 0);
                    assert.equal(msg.read, false);

                    done();
                });
    });

    it('GET /messages/1 should now return a message marked as "read"', 
        (done) => {
            superagent
                .get(`${api}/messages/1`)
                .end((err, res) => {
                    if (err) done(err);
                    const msg = res.body;
                    assert.equal(msg.message, "Elvin");
                    assert.equal(msg.id, 1);
                    assert.equal(msg.read, true);

                    done();
                });
    });

    //Dions nya test elvin kålla igenm

    it('GET /messages/999 should return 404 for invalid ID', (done) => {
        superagent
            .get(`${api}/messages/999`)
            .end((err, res) => {
                assert.equal(res.statusCode, 404);
                done();
            });
    });
    
    it('PATCH /messages/999 should return 404 for invalid ID', (done) => {
        superagent
            .patch(`${api}/messages/999`)
            .send({ "read": "true" })
            .end((err, res) => {
                assert.equal(res.statusCode, 404);
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
    
    it('PATCH /messages/0 with invalid read status should return 400', (done) => {
        superagent
            .patch(`${api}/messages/0`)
            .send({ "read": "yes" })
            .end((err, res) => {
                assert.equal(res.statusCode, 400);
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
    

    //slut

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

    it('GET /messages should be unchanged', 
        (done) => {
            superagent
                .get(`${api}/messages`)
                .end((err, res) => {
                    if (err) done(err);
                    let msgs = res.body;
                    assert.notEqual(msgs, []);
                    assert.equal(msgs.length, 2);
                    
                    assert.equal(msgs[0].message, "Dennis");
                    assert.equal(msgs[0].id, 0);
                    assert.equal(msgs[0].read, false);

                    assert.equal(msgs[1].message, "Elvin");
                    assert.equal(msgs[1].id, 1);
                    assert.equal(msgs[1].read, true);

                    done();
                });
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

    after((done) => {
        server.close(() => done());
    })
});


