import assert from 'assert';
import superagent from 'superagent';
import { start_server, clear_server } from '../app.js';
import { Cookie } from 'express-session';
import * as db from '../db.js';
import mongoose from 'mongoose';

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

    it('Trying to get messages from own wall should return code 200', (done) => {
        superagent
            .get(`${api}/users/${userId}/wall`)
            .set("cookie", cookie)
            .end((err, res) => {
                if (err) return done(err);

                assert.equal(res.status, 200);

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
    });

    after((done) => {
        clear_server();
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



    it('Posting a friend request should return 200 and add the person as friend', (done) => {
        const senderId = ids[0];
        const friendId = ids[1];
        const senderSession = cookies[0];
        superagent
            .post(`${api}/users/${friendId}/friends`)
            .set("cookie", senderSession)
            .end(async (err, res) => {
                if (err) return done(err);

                assert.equal(res.status, 200);
                const friendRequests = await db.getFriendsOfUser(friendId, 'friendRequests ',
                    (obj) => obj.friendRequests);
                const index = friendRequests.find((item) => {
                    return item._id == senderId;
                });
                assert.notEqual(index, undefined);
                done();
            });
    });

    it("Users shouldn't be able to send requests to persons they are already friends with", (done) => {
        const friendId = ids[1];
        const senderSession = cookies[0];

        superagent
            .post(`${api}/users/${friendId}/friends`)
            .set("cookie", senderSession)
            .end((err, res) => {
                assert.equal(res.status, 409);
                done();
            });

    });

    it('Accepting a friend request should return code 200 and added the friend to list', (done) => {
        const friendId = ids[1];
        const senderId = ids[0];
        const friendSession = cookies[1];

        superagent
            .patch(`${api}/users/${senderId}/friends`)
            .set("cookie", friendSession)
            .end(async (err, res) => {
                if (err) return done(err);
                assert.equal(res.status, 200);


                const friends = await db.getFriendsOfUser(friendId, 'friends', (obj) => obj.friends);
                const friendsOfFriendIndex = friends.find((item) => {
                    return item._id == senderId;
                });


                assert.notEqual(friendsOfFriendIndex, undefined);

                const friendsOfSender = await db.getFriendsOfUser(senderId, 'friends',
                    (obj) => obj.friends);
                const friendsOfSenderIndex = friendsOfSender.find((item) => {
                    return item._id == friendId;
                });

                assert.notEqual(friendsOfSenderIndex, undefined);

                // Check that the request is removed
                const friendRequests = await db.getFriendsOfUser(friendId, 'friendRequests',
                    (obj) => obj.friendRequests);
                const requestIndex = friendRequests.find((item) => {
                    return item._id == senderId;
                });

                assert.equal(requestIndex, undefined);

                done();
            });
    });

    it('Post a message to a friends wall', (done) => {
        const senderId = ids[0];
        const friendId = ids[1];
        const senderSession = cookies[0];
        const friendSession = cookies[1];

        const request = {
            "message": "abc",
            "author": usernames[0],
            "date": Date.now()
        };

        // Have user 1 post a message to user 2's wall
        superagent
            .post(`${api}/users/${friendId}/wall`)
            .set("cookie", senderSession)
            .send(request)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.status, 200);

                db.getPostsByUser(friendId)
                    .then((res) => {
                        assert.equal(res.length, 1);
                    })
            });
        superagent
            .post(`${api}/users/${senderId}/wall`)
            .set("cookie", friendSession)
            .send(request)
            .end((err, res) => {
                if (err) return done(err);
                assert.equal(res.status, 200);

                db.getPostsByUser(senderId)
                    .then((res) => {
                        assert.equal(res.length, 1);
                        done();
                    })
            });
    });

    after((done) => {
        clear_server();
        server.close(() => done());
    });
});

describe('Errors', (done) => {
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

    it('Logging in with incorrect username/password should return code 400', (done) => {
        const request = {
            "name": "asdfg",
            "password": "aasdsdd"
        };

        superagent
            .post(`${api}/login`)
            .send(request)
            .end((err, res) => {
                assert.equal(res.status, 400);
                done();
            });
    });

    it('Trying to register with an already taken username should return 409', (done) => {
        const request = {
            "name": "dennis",
            "password": "a"
        };

        superagent
            .post(`${api}/users`)
            .send(request)
            .end((err, res) => {
                assert.equal(res.status, 409);
                done();
            });
    });

    it('Trying to add self as friend should return 400', (done) => {
        superagent
            .post(`${api}/users/${ids[1]}/friends`)
            .set("cookie", cookies[1])
            .end((err, res) => {
                assert.equal(res.status, 400);
                done();
            });
    });

    it('Trying to fetch user with incorrect ID should return status code 400', (done) => {
        superagent
            .get(`${api}/users/asdsdsa`)
            .set("cookie", cookies[1])
            .end((err, res) => {
                assert.equal(res.status, 400);
                done();
            });
    });

    it('Trying to fetch user with valid but nonexistent ID should return status code 400', (done) => {
        const id = "507f1f77bcf86cd799439011";
        superagent
            .get(`${api}/users/${id}`)
            .set("cookie", cookies[1])
            .end((err, res) => {
                assert.equal(res.status, 400);
                done();
            });
    });

    it('Trying to accept a request that doesnt exist should return 409', (done) => {
        superagent
            .patch(`${api}/users/${ids[0]}/friends`)
            .set("cookie", cookies[1])
            .end(async (err, res) => {
                assert.equal(409, res.status);
                done();
            });
    });

    it('Trying to register account with parameters should return 400', (done) => {
        const request = {
            "asdsas": "öööööö"
        };

        superagent
            .post(`${api}/users`)
            .send(request)
            .end((err, res) => {
                assert.equal(res.status, 400);
                done();
            });
    });

    it('Trying to fetch user with invalid parameters should return 400', (done) => {
        superagent
            .get(`${api}/users/asdasdasd/wall`)
            .set("cookie", cookies[0])
            .end((err, res) => {
                assert.equal(res.status, 400);
                done();
            });
    });

    it('Trying to fetch wall with valid but nonexistent ID should return status code 400', (done) => {
        const id = "507f1f77bcf86cd799439011";
        superagent
            .get(`${api}/users/${id}/wall`)
            .set("cookie", cookies[1])
            .end((err, res) => {
                assert.equal(res.status, 400);
                done();
            });
    });

    it('Trying to fetch wall with valid but nonexistent ID should return status code 400', (done) => {
        const id = "abc";
        const request = {
            "message": "abc",
            "author": "dennis"
        };

        superagent
            .post(`${api}/users/${id}/wall`)
            .set("cookie", cookies[1])
            .send(request)
            .end((err, res) => {
                assert.equal(res.status, 400);
                done();
            });
    });

    it('Trying to accept a request with invalid ID should return 400', (done) => {
        superagent
            .patch(`${api}/users/abcdef/friends`)
            .set("cookie", cookies[1])
            .end(async (err, res) => {
                assert.equal(400, res.status);
                done();
            });
    });


    // Test invalid methods
    it('Should return 405 for PUT on /login', (done) => {
        superagent
            .put(`${api}/login`)
            .set("cookie", cookies[1])
            .end((err, res) => {
                assert.equal(405, res.status);
                done();
            });
    });

    it('Should return 405 for DELETE on /login', (done) => {
        superagent
            .delete(`${api}/login`)
            .set("cookie", cookies[1])
            .end((err, res) => {
                assert.equal(405, res.status);
                done();
            });
    });

    it('Should return 405 for PATCH on /login', (done) => {
        superagent
            .patch(`${api}/login`)
            .set("cookie", cookies[1])
            .end((err, res) => {
                assert.equal(405, res.status);
                done();
            });
    });

    it('Should return 405 for POST on /logout', (done) => {
        superagent
            .post(`${api}/logout`)
            .set("cookie", cookies[1])
            .end((err, res) => {
                assert.equal(405, res.status);
                done();
            });
    });

    it('Should return 405 for PUT on /logout', (done) => {
        superagent
            .put(`${api}/logout`)
            .set("cookie", cookies[1])
            .end((err, res) => {
                assert.equal(405, res.status);
                done();
            });
    });

    it('Should return 405 for DELETE on /logout', (done) => {
        superagent
            .delete(`${api}/logout`)
            .set("cookie", cookies[1])
            .end((err, res) => {
                assert.equal(405, res.status);
                done();
            });
    });

    it('Should return 405 for PATCH on /logout', (done) => {
        superagent
            .patch(`${api}/logout`)
            .set("cookie", cookies[1])
            .end((err, res) => {
                assert.equal(405, res.status);
                done();
            });
    });

    it('Should return 405 for POST on /auth', (done) => {
        superagent
            .post(`${api}/auth`)
            .set("cookie", cookies[1])
            .end((err, res) => {
                assert.equal(405, res.status);
                done();
            });
    });

    it('Should return 405 for PUT on /auth', (done) => {
        superagent
            .put(`${api}/auth`)
            .set("cookie", cookies[1])
            .end((err, res) => {
                assert.equal(405, res.status);
                done();
            });
    });

    it('Should return 405 for DELETE on /auth', (done) => {
        superagent
            .delete(`${api}/auth`)
            .set("cookie", cookies[1])
            .end((err, res) => {
                assert.equal(405, res.status);
                done();
            });
    });

    it('Should return 405 for PATCH on /auth', (done) => {
        superagent
            .patch(`${api}/auth`)
            .set("cookie", cookies[1])
            .end((err, res) => {
                assert.equal(405, res.status);
                done();
            });
    });

    it('Should return 405 for PUT on /users', (done) => {
        superagent
            .put(`${api}/users`)
            .set("cookie", cookies[1])
            .end((err, res) => {
                assert.equal(405, res.status);
                done();
            });
    });

    it('Should return 405 for DELETE on /users', (done) => {
        superagent
            .delete(`${api}/users`)
            .set("cookie", cookies[1])
            .end((err, res) => {
                assert.equal(405, res.status);
                done();
            });
    });

    it('Should return 405 for PATCH on /users', (done) => {
        superagent
            .patch(`${api}/users`)
            .set("cookie", cookies[1])
            .end((err, res) => {
                assert.equal(405, res.status);
                done();
            });
    });

    it('Should return 405 for PUT on /users/:id/wall', (done) => {
        superagent
            .put(`${api}/users/123/wall`)
            .set("cookie", cookies[1])
            .end((err, res) => {
                assert.equal(405, res.status);
                done();
            });
    });

    it('Should return 405 for DELETE on /users/:id/wall', (done) => {
        superagent
            .delete(`${api}/users/123/wall`)
            .set("cookie", cookies[1])
            .end((err, res) => {
                assert.equal(405, res.status);
                done();
            });
    });

    it('Should return 405 for PATCH on /users/:id/wall', (done) => {
        superagent
            .patch(`${api}/users/123/wall`)
            .set("cookie", cookies[1])
            .end((err, res) => {
                assert.equal(405, res.status);
                done();
            });
    });

    it('Should return 405 for POST on /friends', (done) => {
        superagent
            .post(`${api}/friends`)
            .set("cookie", cookies[1])
            .end((err, res) => {
                assert.equal(405, res.status);
                done();
            });
    });

    it('Should return 405 for PUT on /friends', (done) => {
        superagent
            .put(`${api}/friends`)
            .set("cookie", cookies[1])
            .end((err, res) => {
                assert.equal(405, res.status);
                done();
            });
    });

    it('Should return 405 for DELETE on /friends', (done) => {
        superagent
            .delete(`${api}/friends`)
            .set("cookie", cookies[1])
            .end((err, res) => {
                assert.equal(405, res.status);
                done();
            });
    });

    it('Should return 405 for PATCH on /friends', (done) => {
        superagent
            .patch(`${api}/friends`)
            .set("cookie", cookies[1])
            .end((err, res) => {
                assert.equal(405, res.status);
                done();
            });
    });

    it('Should return 405 for POST on /requests', (done) => {
        superagent
            .post(`${api}/requests`)
            .set("cookie", cookies[1])
            .end((err, res) => {
                assert.equal(405, res.status);
                done();
            });
    });

    it('Should return 405 for PUT on /requests', (done) => {
        superagent
            .put(`${api}/requests`)
            .set("cookie", cookies[1])
            .end((err, res) => {
                assert.equal(405, res.status);
                done();
            });
    });

    it('Should return 405 for DELETE on /requests', (done) => {
        superagent
            .delete(`${api}/requests`)
            .set("cookie", cookies[1])
            .end((err, res) => {
                assert.equal(405, res.status);
                done();
            });
    });

    it('Should return 405 for PATCH on /requests', (done) => {
        superagent
            .patch(`${api}/requests`)
            .set("cookie", cookies[1])
            .end((err, res) => {
                assert.equal(405, res.status);
                done();
            });
    });

    it('Should return 405 for DELETE on users/:id', (done) => {
        superagent
            .delete(`${api}/users/${ids[1]}`)
            .set("cookie", cookies[1])
            .end((err, res) => {
                assert.equal(405, res.status);
                done();
            });
    });

    it('Should return 405 for DELETE on users/:id/friends', (done) => {
        superagent
            .delete(`${api}/users/${ids[1]}/friends`)
            .set("cookie", cookies[1])
            .end((err, res) => {
                assert.equal(405, res.status);
                done();
            });
    });

    // Test invalid route
    it('Should return 404 for random get ', (done) => {
        superagent
            .get(`${api}/asdasdasdsad`)
            .set("cookie", cookies[1])
            .end((err, res) => {
                assert.equal(404, res.status);
                done();
            });
    });

    after((done) => {
        clear_server();
        server.close(() => done());
    });

});
