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

function page_dose_not_exist(res) {
    res.status(404).send("404 - Not found");
}

function server_error(res) {
    res.status(500).json({ error: "Internal Server Error" });
}

// Behövs för att parsa JSON-requests 
app.use(express.json());

//ska vi ta bort denna används ej
app.use((err, req, res, next) => {
    invalid_parameters(res)
});

app.get('/messages', async (req, res) => {

    try {

        let msgs = await db.get_all_messages();
        res.send(msgs);

    } catch (error) {
        server_error(res);
    }

});

app.post('/messages', async (req, res) => {
    //console.log(req.body.message)
    // lägg till try catch här

    try {
        let clean = sanitize(req.body.message);
        if (clean === undefined || 
            clean.length <= 0 || 
            clean.length > 140 || 
            typeof(clean) !== "string")
        {
            throw new Error("Invalid parameters");
        }
        else
        {
            await db.save_message(clean);
            res.sendStatus(200);
        }
    } catch (error) {
         // Handle different error types
         if (error.message === "Invalid parameters") {
            // console.error("TypeError:", error.message);
                invalid_parameters(res);
            } else {
            // console.error("General Error:", error.message);
                server_error(res);
            }
    }
});

app.all('/messages', async (req, res) => {
    invalid_method(res);
});

app.get('/messages/:id', async (req, res) => {
    // lägg till try catch här
    try {
        let clean = sanitize(req.params.id);
        let id = parseInt(clean);
        
        if(isNaN(id) || await db.id_exists(id) === false ) {
            throw new Error("Invalid id");
        }
        else {
            let msg = await db.read_message(id);
            res.send(msg)
        }
    } catch (error) {
        // Handle different error types
             if (error.message === "Invalid id") {
            // console.error("Database Error:", error.message);
                page_dose_not_exist(res);
            } else {
            // console.error("General Error:", error.message);
            server_error(res);
            }
    }
    

});

app.patch('/messages/:id', async (req, res) => {
    // Testing for valid parameters
    try{
        if (req.body.read === undefined || 
            typeof(req.body.read) !== "string") {
                throw new Error("Invalid parameters");
            }

        let read = false
        if (req.body.read === "true") {
            read = true;
        } else if (req.body.read === "false") {
            read = false;
        } else {
            throw new Error("Invalid parameters");
        }

        let clean = sanitize(req.params.id);
        let id = parseInt(clean);

        // Testing for valid parameters
        if(isNaN(id) || await db.id_exists(id) === false){
            throw new Error("Invalid id");
        }

      //  console.log(read)
        await db.set_status(id, read);
        res.sendStatus(200);
    } catch (error) {
        // Handle different error types
        if (error.message === "Invalid parameters") {
           // console.error("TypeError:", error.message);
            invalid_parameters(res);
        } else if (error.message === "Invalid id") {
           // console.error("Database Error:", error.message);
            page_dose_not_exist(res);
        } else {
           // console.error("General Error:", error.message);
           server_error(res);
        }
    }    
});

app.all('/messages/:id', async (req, res) => {
    invalid_method(res);
});

// Om denna läggs längst ner kommer den bara anropas om ingen annan funktion matchar
app.use((req, res, next) => {
    page_dose_not_exist(res);
});

function start_server(port, callback)
{
    return app.listen(port, () => {
        callback && callback();
        //console.log(`App is running, visit http://localhost:${port}`);
        //db.run();
    });
}

export {start_server}
// checks that the app.js is the main file that is being ran if so it starts a server connection if not it is ignored
if (process.argv[1] === new URL(import.meta.url).pathname) {
    start_server(3000);
}