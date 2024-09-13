//import { resolve } from 'superagent/lib/request-base.js';
import { connectToDatabase, getDatabaseConnection } from './mongoUtils.js'
//closeDatabaseConnection, 
let config = {
    host: 'localhost:27017',
    db: 'mongo-example-db'
}

let db
connectToDatabase(config, () => {
    // Call the function 'run' as soon as the connection has been established.
    console.log('Connected!')
    db = getDatabaseConnection()
    
});



async function run(){


   await drop_all_collections();
   //await save_message('hej');
   //await save_message('då');

   //await read_message(0);
   //await set_status(0,true)
   //await read_message(0);
   //await get_all_messages();
}

async function drop_all_collections() {
    await db.dropCollection("enteris");
    // await db.dropCollection("id");
}

// async function get_id()
// {
//     if (await db.collection("id").countDocuments() === 0){
//         let id = {"id": 0};
//         await db.collection("id").insertOne(id);
//         return 0;
//     }
//     else{
//         let id = await db.collection("id").findOne({});
//         id.id++;
//         await db.collection("id").updateOne({}, {$set: {"_id": id.id}})
//         return id.id;
//     }
// }

async function id_exists(id)
{
    let test = await db.collection("enteris").findOne({"_id":id});
    return !test;

}

async function save_message(msg) {
    /*let entry = { 
        "author":msg,
        "message": msg,
        "time": Date.now(),
        "read": false
    };*/
    msg.time = Date.now();
    let msg_insert = await db.collection("enteris").insertOne(msg);
    let msg_complete = await db.collection("enteris").findOne({"_id" : msg_insert.insertedId})
    return msg_complete;
    //console.log("Saved message ");
    //console.log(await db.collection("enteris").countDocuments());
}

async function read_message(id)
{
    let msg = await db.collection("enteris").findOne({"_id" : id});   
    //console.log(`Found ${JSON.stringify(msg, null, 2)}` );
    return msg
}

async function get_all_messages()
{
    let msgs = await db.collection("enteris").find({}).toArray();
    if (msgs.length == 0)
    {
        msgs = {};
    }
    //console.log(msgsObject)
    return msgs;

}

async function set_status(id, status) {
    await db.collection("enteris").updateOne({"_id":id}, {$set: {"read": status}});
    
}

// Close the database connection after 2 seconds.
export { run, set_status, get_all_messages, read_message, save_message, id_exists }