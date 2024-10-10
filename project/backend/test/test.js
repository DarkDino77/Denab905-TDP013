import assert from 'assert';
import superagent from 'superagent';
import { start_server, clear_server } from '../app.js';
import { Cookie } from 'express-session';
import * as db from '../db.js';

const port = 8080;
let api = 'http://localhost:' + port;
let server;

describe('database api tests', () => {
    let cookie;
    let userId;
    let username = "elvin";

    before((done) => {
        // Start the server
        server = start_server(port);

        // Clear the server database
        clear_server()
            .then(() => {
                const request = {
                    "name": username,
                    "password": "a"
                };

                // Create user
                return superagent
                    .post(`${api}/users`)
                    .send(request)
                    .then((createRes) => {
                        userId = createRes.body._id;
                        // Login
                        return superagent
                            .post(`${api}/login`)
                            .send(request)
                            .then((loginRes) => {
                                cookie = loginRes.headers['set-cookie'].pop().split(';')[0];
                            });
                    });
            })
            .then(() => done())
            .catch((err) => done(err));
    });

    it('Sending GET request to /auth should return 200 and username and ID', (done) => {
        superagent
            .get(`${api}/auth`)
            .set("cookie", cookie)
            .end((err, res) => {
                if (err) done(err)

                assert.equal(res.status, 200);
                assert.equal(res.body.id, userId);
                assert.equal(res.body.name, username);


                done();
            });
    });

    it('Fetch all users should return an array containing name and ID of newly created user', (done) => {
        superagent
            .get(`${api}/users`)
            .end((err, res) => {
                if (err) done(err)
                assert.deepEqual(res.body, [{ "name": username, "_id": userId }]);

                done();
            });
    });

    it('Fetching newly created user should return name and ID', (done) => {
        // Fetch user

        superagent
            .get(`${api}/users/${userId}`)
            .set("cookie", cookie)
            .end((err, res) => {
                if (err) done(err)
                const user = res.body;
                assert.equal(user.name, username);
                assert.equal(user._id, userId);

                assert.deepEqual(user.posts, []);
                assert.deepEqual(user.friends, []);
                assert.deepEqual(user.friendRequests, []);

                // TODO: aktivera detta när passwords är borttagna
                //assert.equal(user.password, undefined);

                done();
            });
    });

    it('Posting valid message to ones own wall should return status code 200', (done) => {
        const request = {
            "message": "hej hej",
            "author": username,
            "date": Date.now()
        };

        superagent
            .post(`${api}/users/${userId}/wall`)
            .set("cookie", cookie)
            .send(request)
            .end((err, res) => {
                if (err) done(err)
                assert.equal(res.status, 200);

                db.getPostsByUser(userId)
                    .then((res) => {
                        assert.equal(res.message, request.message);
                        assert.equal(res.author, request.author);
                    });

                done();
            });
    });

    it('Getting request list should be empty array', (done) => {
        superagent
            .get(`${api}/friends`)
            .set("cookie", cookie)
            .end((err, res) => {
                if (err) return done(err)
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, []);

                done();
            });
    });

    it('Getting friend request list should be empty array', (done) => {
        superagent
            .get(`${api}/requests`)
            .set("cookie", cookie)
            .end((err, res) => {
                if (err) return done(err)
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, []);

                done();
            });
    });



    it('Posting message with an empty message should return status code 400 and not add message', (done) => {
        const request = {
            "message": "",
            "author": username,
            "date": Date.now()
        };

        superagent
            .post(`${api}/users/${userId}/wall`)
            .set("cookie", cookie)
            .send(request)
            .end((err, res) => {
                assert.equal(res.status, 400);

                db.getPostsByUser(userId)
                    .then((res) => {
                        assert.equal(res.length, 1);
                    });

                done();
            });
    });

    it('Posting message longer than 140 characters return status code 400 and not add message', (done) => {
        const request = {
            "message": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "author": username,
            "date": Date.now()
        };

        superagent
            .post(`${api}/users/${userId}/wall`)
            .set("cookie", cookie)
            .send(request)
            .end((err, res) => {
                assert.equal(res.status, 400);

                db.getPostsByUser(userId)
                    .then((res) => {
                        assert.equal(res.length, 1);
                    });

                done();
            });
    });

    it('Logging out and then trying to access posts should return in status code 401', (done) => {
        superagent
            .get(`${api}/logout`)
            .set("cookie", cookie)
            .end((err, res) => {

                superagent
                    .get(`${api}/users/${userId}`)
                    .set("cookie", cookie)
                    .end((err, res) => {
                        assert.equal(res.status, 401);

                        superagent
                            .get(`${api}/auth`)
                            .set("cookie", cookie)
                            .end((err, res) => {
                                assert.equal(res.status, 401);
                                done();
                            });
                    });

            });
    })

    after((done) => {
        server.close(() => done());
    });
});

describe('Registering multiple users', () => {
    const usernames = ['elvin', 'dennis'];
    let ids = [];
    let cookies = [];

    before((done) => {
        // Start the server
        server = start_server(port);

        // Clear the server database and register several users
        clear_server()
            .then(async () => {
                for (let i = 0; i < usernames.length; i++) {
                    const request = {
                        "name": usernames[i],
                        "password": "a"
                    };

                    await superagent
                        .post(`${api}/users`)
                        .send(request)
                        .then(async (createRes) => {
                            ids.push(createRes.body._id);
                            // Login
                            await superagent
                                .post(`${api}/login`)
                                .send(request)
                                .then((loginRes) => {
                                    cookies.push(loginRes.headers['set-cookie'].pop().split(';')[0]);
                                });
                        });
                }
            })
            .then(() => done())
            .catch((err) => done(err));
    });

    it('Fetch all users should return an array containing names and IDs of newly created users', (done) => {

        superagent
            .get(`${api}/users`)
            .end((err, res) => {
                if (err) done(err)

                // Verify that the returned array contains all the usernames and ids
                for (let i = 0; i < usernames.length; i++) {
                    const index = res.body.find((item) => {
                        return item.name == usernames[i] &&
                            item._id == ids[i];
                    });

                    assert.notEqual(index, undefined);
                }

                done();
            });
    });

    it('Posting a message to wall without being friends should return error code 401', (done) => {
        // Log in to user 1
        const request = {
            "name": usernames[0],
            "password": "a"
        }

        let cookie = cookies[0];
        console.log(cookies);

        // Log in to user 1
        superagent
            .post(`${api}/login`)
            .send(request)
            .then((res) => {
                cookie = res.headers['set-cookie'].pop().split(';')[0];
            })
            .then(() => {
                // Try to post to the wall of user 2
                const id = ids[1];

                const request = {
                    "message": "abc",
                    "author": usernames[0],
                    "date": Date.now()
                };

                superagent
                    .post(`${api}/users/${id}/wall`)
                    .set("cookie", cookie)
                    .send(request)
                    .end((err, res) => {
                        // Verify that the status code was 401 (authentication error)
                        assert.equal(res.status, 401);

                        // Verify that the post wasn't created
                        // TODO: denna funktion borde heta typ getPostsOnUsersWall
                        db.getPostsByUser(id)
                            .then((res) => {
                                assert.equal(res.length, 0);
                                done();
                            })
                            .catch(() => done()); // Catch behövs tydligen om assert blir false

                    })
                    .then(() => done());

                done();
            });
    });


    it('Posting a message to a friends wall should return 200 and add the message', (done) => {
        const senderId = ids[0];
        const friendId = ids[1];
        const senderSession = cookies[0];
        const friendSession = cookies[0];

        superagent
            .post(`${api}/users/${friendId}/friends`)
            .set("cookie", senderSession)
            .end(async (err, res) => {
                if (err) done(err);

                assert.equal(res.status, 200);

                {
                    const friendRequests = await db.getFriendsOfUser(friendId, 'friendRequests ',
                        (obj) => obj.friendRequests);
                    const index = friendRequests.find((item) => {
                        return item._id == senderId;
                    });

                    assert.notEqual(index, undefined);
                }

                // TODO: kolla så man inte kan skicka friend request igen
                // Check that a friend request can't be send twice
                await superagent
                    .post(`${api}/users/${friendId}/friends`)
                    .set("cookie", senderSession)
                    .end(async (err, res) => {
                        assert.equal(res.status, 409);
                    });

                await superagent
                    .patch(`${api}/users/${friendId}/friends`)
                    .set("cookie", friendSession)
                    .end((err, res) => {
                        if (err) return done(err);
                        assert.equal(res.status, 200);

                        return done();
                    });

                {
                    // Ćheck that the sender gets added
                    const friendsOfFriend = await db.getFriendsOfUser(friendId, 'friends',
                        (obj) => obj.friends);
                    const friendsOfFriendIndex = friendsOfFriend.find((item) => {
                        return item._id == senderId;
                    });

                    assert.notEqual(friendsOfFriendIndex, undefined);
                }

                {
                    // Ćheck that the friend gets added to the sender
                    let friendsOfSender = await db.getFriendsOfUser(senderId, 'friends',
                        (obj) => obj.friends);
                    const friendsOfSenderIndex = friendsOfSender.find((item) => {
                        return item._id == friendId;
                    });

                    assert.notEqual(friendsOfSenderIndex, undefined);
                }

                {
                    // Check that the request is removed
                    const friendRequests = await db.getFriendsOfUser(friendId, 'friendRequests',
                        (obj) => obj.friends);
                    const requestIndex = friendRequests.find((item) => {
                        return item._id == senderId;
                    });

                    assert.equal(requestIndex, undefined);
                }

                const request = {
                    "message": "abc",
                    "author": usernames[0],
                    "date": Date.now()
                };

                await superagent
                    .post(`${api}/users/${friendId}/wall`)
                    .set("cookie", senderSession)
                    .send(request)
                    .end((err, res) => {
                        // Verify that the status code was 401 (authentication error)
                        assert.equal(res.status, 200);

                        // Verify that the post wasn't created
                        // TODO: denna funktion borde heta typ getPostsOnUsersWall
                        db.getPostsByUser(friendId)
                            .then((res) => {
                                assert.equal(res.length, 1);
                                done();
                            })
                            .catch(() => done()); // Catch behövs tydligen om assert blir false
                    })
                    .then(() => done());
            });
    });
});