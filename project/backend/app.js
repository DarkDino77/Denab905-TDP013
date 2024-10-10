import express from 'express';
import * as db from './db.js';
import * as schemes from './scheme.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import cors from 'cors';


const app = express();
const port = 8080;

//curl -H 'Content-Type: application/json' -d '{ "name": "dennis", "password": "mellon" }' http://localhost:8080/users -X POST;

const corsOptions = {
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],  // Allow both
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true
};

function isValidId(id) {
    return mongoose.isValidObjectId(id);
}

const authenticate = (req, res, next) => {
    if (req.session.userId && isValidId(req.session.userId)) {
        next();
    } else {
        res.sendStatus(401);
    }
}

app.use(cors(corsOptions));
app.use(express.json());

await db.start_database();

app.use(session({
    secret: 'bla',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        client: mongoose.connection.getClient(),
        dbName: process.env.MONGO_DB_NAME,
        collectionName: "sessions",
        stringify: false,
        autoRemove: "interval",
        autoRemoveInterval: 1
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
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

    req.session.userId = result._id;
    req.session.name = result.name;

    res.status(200).send({ id: req.session.userId, name: req.session.name });
});

app.get('/logout', authenticate, async (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
});

app.get('/auth', authenticate, async (req, res) => {
    const id = req.session.userId;
    const name = req.session.name;
    res.status(200).send({ id: id, name: name });
});

app.post('/users', async (req, res) => {
    const body = req.body

    body.posts = [];
    body.friendRequests = [];
    body.friends = [];

    const newUser = new schemes.User(body)

    let error = newUser.validateSync();

    if (error) {
        res.status(400).send(error.message)
        return;
    }

    let find = await db.findUser({ name: newUser.name });

    if (find !== null) {
        res.sendStatus(409);
        return;
    }



    let response = await db.saveUser(newUser);

    res.status(200).send(response);
});

app.get('/users/:id/wall', authenticate, async (req, res) => {
    if (!isValidId(req.params.id)) 
        return res.sendStatus(400);
    let posts = await db.getPostsByUser(req.params.id);
    
    if (posts !== undefined) {
        res.status(200).send(posts);
    } else {
        res.sendStatus(400);
    }
});

/*
    TODO:
        - Returkoder:
            - 200 för POST och PATCH om OK
            - 400 för POST och PATCH om felaktiga parametrar
            - 401 för authentication errors
            - 405 om fel metod
            - 404 om sidan ej finns
            - 409 conflict
            - 500 för alla andra fel
*/

app.post('/users/:id/wall', authenticate, async (req, res) => {
    if (!isValidId(req.params.id)) {
        res.sendStatus(400);
        return;
    }

    const message = new schemes.Post(req.body);
    message.author = req.session.name;

    let error = message.validateSync();
    if (error !== undefined) {
        res.status(400).send(error);
        return;
    }

    let friends = await db.getFriendsOfUser(req.session.userId, 'friends ',
        (obj) => obj.friends
    );

    let indexfriends = friends.find((element) => element._id.toString() === req.params.id)

    if (req.params.id !== req.session.userId.toString() && indexfriends === undefined) {
        res.sendStatus(401);
    } else {
        await db.postMessageToWall(req.params.id, message);

        res.sendStatus(200);
    }
});

app.get('/friends', authenticate, async (req, res) => {
    let friends = await db.getFriendsOfUser(req.session.userId, 'friends ',
        (obj) => obj.friends
    );
    res.status(200).send(friends);
});

app.get('/requests', authenticate, async (req, res) => {
    let friends = await db.getFriendsOfUser(req.session.userId, 'friendRequests ',
        (obj) => obj.friendRequests
    );
    res.status(200).send(friends);
});

app.post('/users/:id/friends', authenticate, async (req, res) => {
    if (isValidId(req.params.id) && req.session.userId.toString() !== req.params.id) {
        const result = await db.addFriend(req.session.userId, req.params.id);
        if (result)
            res.sendStatus(200);
        else
            res.sendStatus(409);

    } else {
        res.sendStatus(400);
    }
});

app.patch('/users/:id/friends', authenticate, async (req, res) => {
    if (!isValidId(req.params.id)) {
        res.sendStatus(400);
        return;
    }

    const result = await db.acceptRequest(req.session.userId, req.params.id);
    if (result)
        res.sendStatus(200);
    else
        res.sendStatus(409);
});

app.get('/users/:id', authenticate, async (req, res) => {
    const id = req.params.id

    if (isValidId(req.params.id)) {
        const users = await schemes.User.findById(id).exec();

        if (users) {
            res.status(200).send(users);
        } else {
            res.sendStatus(400);
        }
    } else {
        res.sendStatus(400);
    }
});

app.get('/users', async (req, res) => {
    const users = await schemes.User.find().select('name');

    res.status(200).send(users);
});

// app.get('/delete', async (req, res) => {
//     mongoose.connection.db.dropDatabase();
//     res.sendStatus(200);
// });

function start_server(port, callback) {
    console.log('Starting server...');
    return app.listen(port, () => {
        callback && callback();
    });
}

// async function close_server() {
//     db.closeDatabase();
// }

async function clear_server() {
    await mongoose.connection.db.dropDatabase();
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
    start_server(port);
}

export { start_server, clear_server }