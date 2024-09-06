import express from 'express';
import * as db from "./database.js";
import sanitize from 'mongo-sanitize';

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
app.use((err, req, res, next) => {
    invalid_parameters(res)
});

app.get('/messages', async (req, res) => {
    let msgs = await db.get_all_messages();
    res.send(msgs);
});

app.post('/messages', async (req, res) => {
    //console.log(req.body.message)
    // lägg till try catch här
    let clean = sanitize(req.body.message);
    if (clean === undefined || clean.length <= 0 || clean.length > 140)
    {
        invalid_parameters(res)
    }
    else
    {
        await db.save_message(clean)

        res.sendStatus(200);
    }

});

app.all('/messages', async (req, res) => {
    invalid_method(res);
});

app.get('/messages/:id', async (req, res) => {
    // lägg till try catch här
    let clean = sanitize(req.params.id);
    let id = parseInt(clean);
    if(isNaN(id) || await db.id_exists(id) === false) {
        invalid_parameters(res);
    } else {
        let msg = await db.read_message(id);
        res.send(msg)
    }
    
});

app.patch('/messages/:id', async (req, res) => {
    // lägg till try catch här
    try{
        if (req.body.read === undefined){throw new Error("");
        }
        let read = false
        if (req.body.read === "true") {
            read = true;
        } else if (req.body.read === "false") {
            read = false;
        } else {
           throw errror;
        } 
        let clean = sanitize(req.params.id);
        let id = parseInt(clean)

        if(isNaN(id) || await db.id_exists(id) === false){throw error;}
        await db.set_status(id, read);
        res.sendStatus(200);
    } 
    catch(error)
    {
        invalid_parameters(res)
    }
});

app.all('/messages/:id', async (req, res) => {
    invalid_method(res);
});

// Om denna läggs längst ner kommer den bara anropas om ingen annan funktion matchar
app.use((req, res, next) => {
    res.status(404).send("404 - Not found");
});

function start_server(port, callback)
{
    return app.listen(port, () => {
        callback && callback();
        //console.log(`App is running, visit http://localhost:${port}`);
        //db.run();
    });
}

start_server(3000);

export {start_server}