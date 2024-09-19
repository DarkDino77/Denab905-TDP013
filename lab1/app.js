import express from 'express';
import * as db from "./database.js";
import sanitize from 'mongo-sanitize';
import cors from 'cors';
import { closeDatabaseConnection } from './mongoUtils.js';

const app = express();

/*
    TODO:
        - Returkoder:
            - 200 för POST och PATCH om OK
            - 400 för POST och PATCH om felaktiga parametrar
            - 405 om fel metod
            - 404 om sidan ej finns
            - 500 för alla andra fel
        - Lägg in meddelande
        - Sätt meddelande som läst/oläst
        - Validera meddelanden i backend
        - Krascha inte om felaktig JSON
*/

/*
    curl-kommandon:
    $ curl -H 'Content-Type: application/json' -d '{ "message": "hallå" }' http://localhost:3000/messages -X POST
    $ curl -H 'Content-Type: application/json' -d '{ "read": "false" }' http://localhost:3000/messages/0 -X PATCH
*/

// TODO: flytta dessa till en utils-fil
function invalid_method(res) {
    res.status(405).send("405 - Invalid method");
}

function invalid_parameters(res) {
    res.status(400).send("400 - Invalid parameters");
}

function page_dose_not_exist(res) {
    res.status(404).send("404 - Not found");
}

function server_error(res) {
    res.status(500).send("500 - Internal Server Error");
}

const corsOptions = {
	origin: 'http://localhost:8080',
	optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'PATCH']
};

app.use(cors(corsOptions));

// Behövs för att parsa JSON-requests 
app.use(express.json());

app.get('/messages', async (req, res) => {
    let msgs = await db.get_all_messages();
    if (!msgs) {
       return server_error(res);
    }
    // console.log(res.json(msgs))
    res.send(msgs);
});

app.post('/messages', async (req, res) => {
    //console.log(req.body.message)
    // lägg till try catch här
    let msg = sanitize(req.body);
    
    let clean = msg.message;
    if (clean === undefined || 
        clean.length <= 0 || 
        clean.length > 140 || 
        typeof(clean) !== "string")
    {
        return invalid_parameters(res);

     }
     if (typeof msg.read !== 'string') {
        return invalid_parameters(res);
    }
    // Convert read to a boolean
    if (['true', "false"].includes(msg.read)) {
        msg.read = msg.read === 'true';
        // if (msg.read === "true") {
        //     msg.read = true
        // } else {
        //     msg.read = false
        // }
    } else {
        msg.read = false

    }
   if (msg.time === undefined || msg.author === undefined) {
        return invalid_parameters(res);
    }

    let response = await db.save_message(msg);
    if(response === null)
    {
        return server_error(res);
    }
    console.log(response);
    return res.status(200).send(response);
});

app.all('/messages', async (req, res) => {
    invalid_method(res);
});

app.get('/messages/:id', async (req, res) => {
    // lägg till try catch här

    let id = sanitize(req.params.id);

    if(id.length !== 24)
    {
        return invalid_parameters(res)
    }
    //console.log(id);
    let msg = await db.read_message(id);

    if (!msg) {
       return invalid_parameters(res);
    }
    else {
       return res.status(200).send(msg);
    }

});

app.patch('/messages/:id', async (req, res) => {
    // Validate read parameter
    const read = sanitize(req.body);
    if (typeof read.read !== 'string' || !['true', 'false'].includes(read.read)) {
        return invalid_parameters(res);
    }
    // Convert read to a boolean
    const readStatus = read.read === 'true';
    // Sanitize and validate id
    const cleanId = sanitize(req.params.id);
    
    if(cleanId.length !== 24)
        {
            return invalid_parameters(res)
        }
        
        
        // Set message status in the database
    console.log(readStatus);
    const msg = await db.set_status(cleanId, readStatus);
        
    if (msg.modifiedCount === 0) {
        return invalid_parameters(res);
    }
    // Success response
    res.sendStatus(200);
});


app.all('/messages/:id', async (req, res) => {
    invalid_method(res);
});

// Om denna läggs längst ner kommer den bara anropas om ingen annan funktion matchar
app.use((req, res, next) => {
    page_dose_not_exist(res);
});

function start_server(port, callback) {
    return app.listen(port, () => {
        callback && callback();
        //console.log(`App is running, visit http://localhost:${port}`);
        //db.run();
    });
}

export { start_server }

// checks that the app.js is the main file that is being ran if so it starts a server connection if not it is ignored
if (process.argv[1] === new URL(import.meta.url).pathname) {
    start_server(3000);
}