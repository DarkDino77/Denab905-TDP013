import express from 'express';
import * as db from './db.js';
import * as schemes from './scheme.js';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import cors from 'cors';
import cookie from 'express-session/session/cookie.js';

const app = express();
const port = 8080;

//curl -H 'Content-Type: application/json' -d '{ "name": "dennis", "password": "mellon" }' http://localhost:8080/users -X POST;

console.log("Connected");

const corsOptions = {
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],  // Allow both
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true
};

const authenticate = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.sendStatus(401);
    }
}

app.use(cors(corsOptions));
app.use(express.json());

await db.start_database();

app.listen(port);

app.use(session({
    secret: 'bla',
    resave: false,
    saveUninitialized: false,
    // store: MongoStore.create({
    //     client: mongoose.connection.getClient(),
    //     dbName: process.env.MONGO_DB_NAME,
    //     collectionName: "sessions",
    //     stringify: false,
    //     autoRemove: "interval",
    //     autoRemoveInterval: 1
    // })
}));

app.use((req, res, next) => {
    next();
});

app.post('/login', async (req, res) => {
    const login = new schemes.LoginRequest(req.body);
    let result = await db.findUser(login);

    if (result === null) {
        res.sendStatus(400);
        return;
    }

    //console.log("found");
    req.session.userId = result._id;

    res.status(200).send(result._id);
});

app.post('/users', async (req, res) => {
    const body = req.body
    console.log(req.body)
    body.posts = [];
    const newUser = new schemes.User(body)

    let error = newUser.validateSync();
    let find = await db.findUser({name: newUser.name});
    //console.log(find);

    if (find !== null) {
        console.log("already exists");
        res.sendStatus(500);
        return;
    }

    if (error) {
        res.status(500).send(error.message)
        return;
    }

    let response = await db.saveUser(newUser);

    //const users = await schemes.User.findById(id).exec();

    res.status(200).send(response);
});

app.get('/users/:id/wall', async (req, res) => {
    let posts = await db.getPostsByUser(req.params.id);
    res.status(200).send(posts);
});

app.post('/users/:id/wall', async (req, res) => {
    const message = new schemes.Post(req.body);

    let error = message.validateSync();
    if (error) {
        //console.log(error);
        res.status(500).send(error);
    } else {
        console.log(req.params.id)
        db.postMessageToWall(req.params.id, message);
        res.sendStatus(200);
    }
});

app.get('/users/:id/friends', async (req, res) => {
    let friends = await db.getFriendsOfUser(req.params.id);
    res.status(200).send(friends);
});

app.post('/users/:id/friends', authenticate, async (req, res) => {
    // {id: "12314"}
    if (req.session.userId !== req.params.id) {
        db.addFriend(req.session.userId, req.params.id);
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

app.patch('/users/:id/friends', async (req, res) => {
    // {id: "12314"}
    db.acceptRequest(req.session.userId, req.params.id);
    res.sendStatus(200);
});

app.get('/users/:id', authenticate, async (req, res) => {
    const id = req.params.id
    const users = await schemes.User.findById(id).exec();
    if (id !== req.session.userId ) {
        console.log("No access");
        res.sendStatus(401);
        return;
    }

    res.status(200).send(users);
});

app.get('/users', async (req, res) => {
    //console.log(req.session.user);

    const users = await schemes.User.find().exec();

    res.status(200).send(users);
});

app.get('/delete', async (req, res) => {
    mongoose.connection.db.dropDatabase();
    res.sendStatus(200);
});