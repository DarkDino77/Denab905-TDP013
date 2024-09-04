import express from 'express';
import * as db from "./database.js";

const app = express();

app.use((req, res, next) => {
    console.log("hej");
    next();
});

app.get('/messages/:id', async (req, res) => {
    let id = parseInt(req.params.id);
    let msg = await db.read_message(id);
    console.log(msg)
    res.send(msg)
});

app.get('/messages', async (req, res) => {
    let msgs = await db.get_all_messages();
    //msgs.forEach((e) => (e));
    res.send(msgs);
});

const port = 3000;
app.listen(port, () => {
    console.log(`App is running, visit http://localhost:${port}`);
    db.run();
});
