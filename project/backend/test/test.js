import assert from 'assert';
import superagent from 'superagent';
import {start_server, clear_server } from '../app.js';
import { Cookie } from 'express-session';

const port = 8080;
let api = 'http://localhost:' + port;
let server;

describe('database api tests', () => {
    before((done) => {
        server = start_server(port, done);

        clear_server();
    });

    it('Test create account and login', (done) => {
        const request = {
            "name": "elvin",
            "password": "a"
        };
        superagent
        .post(`${api}/users`)
        .send(request)
        .end((err, res) => {
            if (err) return done(err);
            const id = res.body._id;
            console.log(id);

            superagent
            .post(`${api}/login`)
            .send(request)
            .end((err, res) => {
                if (err) return done(err);

                var Cookies = res.headers['set-cookie'].pop().split(';')[0];
                console.log(Cookies)
                    superagent
                        .get(`${api}/users/${id}`)
                        .set("cookie", Cookies)
                        .end((err, res) => {
                            if (err) {
                                //console.log(err);
                                console.log(res.status);

                                return done(err);
                            } 

                            const user = res.body;
                            assert.equal(user.name, "elvin");
                            done();
                });
                
            });

        });
    });
    

    after((done) => {
        server.close();
        done();
    });
});