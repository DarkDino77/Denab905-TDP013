import express from 'express';
import * as db from "./database.js";

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
function invalid_method(res)
{
    res.status(405).send("405 - Invalid method");
}

function invalid_parameters(res)
{
    res.status(400).send("400 - Invalid parameters");
}

// Behövs för att parsa JSON-requests 
app.use(express.json());

app.get('/messages', async (req, res) => {
    let msgs = await db.get_all_messages();
    res.send(msgs);
});

app.post('/messages', (req, res) => {
    console.log(req.body.message)
    res.sendStatus(200);
});

app.all('/messages', async (req, res) => {
    invalid_method(res);
});

app.get('/messages/:id', async (req, res) => {
    let id = parseInt(req.params.id);
    let msg = await db.read_message(id);
    res.send(msg)
});

app.patch('/messages/:id', async (req, res) => {
    console.log(req.body.read);
    res.sendStatus(200);
});

app.all('/messages/:id', async (req, res) => {
    invalid_method(res);
});

// Om denna läggs längst ner kommer den bara anropas om ingen annan funktion matchar
app.use((req, res, next) => {
    res.status(404).send("404 - Not found");
});

const port = 3000;
app.listen(port, () => {
    console.log(`App is running, visit http://localhost:${port}`);
    db.run();
});
