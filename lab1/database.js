import { connectToDatabase, closeDatabaseConnection, getDatabaseConnection } from './mongoUtils.js'

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
   await db.dropCollection("enteris");

   await save_message('dennis', 'hej');
   await save_message('elvin', 'då');

   //await read_message(0);
   //await set_status(0,true)
   //await read_message(0);
   //await get_all_messages();
}

let id_counter = 0;
function get_id()
{
    let id = id_counter;
    id_counter++;
    return id;
}

async function save_message(author, msg) {
    let entry = { id : get_id(),
        "author": author,
        "message": msg,
        "time": 0,
        "read": false
    };
    //console.log("Saved message ");
    await db.collection("enteris").insertOne(entry);
    //console.log(await db.collection("enteris").countDocuments());
}

async function read_message(id)
{
    let msg = await db.collection("enteris").findOne({"id" : id});   
    //console.log(`Found ${JSON.stringify(msg, null, 2)}` );
    return msg
}

async function get_all_messages()
{
    let msgs = await db.collection("enteris").find({}).toArray();

    return msgs;

}

async function set_status(id, status) {
    await db.collection("enteris").updateOne({"id":id}, {$set: {"read": status}});
    
}

// Close the database connection after 2 seconds.
export { run, set_status, get_all_messages, read_message, save_message }