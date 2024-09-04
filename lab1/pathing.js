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

// Behövs för att parsa JSON-requests 
app.use(express.json());

app.use((req, res, next) => {
    next();
});

app.get('/messages', async (req, res) => {
    let msgs = await db.get_all_messages();
    res.send(msgs);
});

app.get('/messages/:id', async (req, res) => {
    let id = parseInt(req.params.id);
    let msg = await db.read_message(id);
    res.send(msg)
});

app.post('/messages', (req, res) => {
    console.log(req.body.message)
    res.status(200).send();
});

app.patch('/messages/:id', async (req, res) => {
    console.log(req.body.read);
    res.status(200).send();
});

const port = 3000;
app.listen(port, () => {
    console.log(`App is running, visit http://localhost:${port}`);
    db.run();
});
