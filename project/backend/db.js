import mongoose from 'mongoose';
import * as schemes from './scheme.js';
import CryptoJS from 'crypto-js';


// TODO: felhantering så inte allting kraschar så fort något går fel

async function start_database() {
    await mongoose.connect('mongodb://localhost:27017/');
    // const newUser = new User({name: "dennis", password: "hej"});
    // newUser.save();

    // console.log((await User.find({ name: "dennis" })).toString());
    
}

async function postMessageToWall(id, message) {
    let user = await schemes.User.findById(id);
    user.posts.push(message);

    await user.save();
}

async function getFriendsOfUser(id) {
    let requests = await schemes.User.findById(id).select("friends");

    requests = requests.friends

    let result = []
    for (let i = 0; i < requests.length; i++) {
        const reqName = await schemes.User.findById(requests[i].friend);

        const reqIteam = {
            _id: reqName._id.toString(),
            name: reqName.name,
            chat: requests[i].chat
        }
        result.push(reqIteam);
    }
    return result;
}


async function getFriendReqstOfUser(id) {
    let requests = await schemes.User.findById(id).select("friendRequests");
    requests = requests.friendRequests
    let result = []
    for (let i = 0; i < requests.length; i++) {
        const reqName = await schemes.User.findById(requests[i]).select('name');
        result.push(reqName);
    }
    return result;
}

async function addFriend(userAdding, addedUser) {
    
    let user = await schemes.User.findById(addedUser);
    let indexfriendRequests = user.friendRequests.find((element) => {
        return element === userAdding.toString()
    }) 
    
    let indexfriends = user.friends.find((element) => {
        return element === userAdding.toString()})
    
    if (indexfriendRequests === undefined && indexfriends === undefined){
        user.friendRequests.push(userAdding.toString());
        await user.save();

        return true;
    }
    else {
        return false;
    }
    
}

async function acceptRequest(userAccepting, userAccepted) {
    let user = await schemes.User.findById(userAccepting.toString());
   

    let index = user.friendRequests.find((element) => {
        return element === userAccepted;
    }); 

    if (index === undefined){
        return false;
    }

    user.friendRequests.splice(index,1);

    
    let acceptedUser = await schemes.User.findById(userAccepted);
    
    const chat = new schemes.Chat({users: [ userAccepting.toString() , userAccepted ]});
    await chat.save();
    

    user.friends.push({friend: userAccepted.toString(), chat: chat._id.toString()});
    acceptedUser.friends.push({friend: userAccepting.toString(), chat: chat._id.toString()});
    await user.save();
    await acceptedUser.save();

    return true;
}

async function getPostsByUser(id) {
    let user = await schemes.User.findById(id).exec();
    if (user)
        return user.posts;
    else
        return undefined;
}

async function findUser(query) {
    const user = schemes.User.findOne(query).exec();
    return user;
}

async function saveUser(user) {
    user.password = CryptoJS.SHA256(user.password).toString(CryptoJS.enc.Hex);
    return user.save();
}

async function addMessageToChat(chatId, msg) {

    const chat = await schemes.Chat.findById(chatId.id);
    if (chat === null)
        return null;
    chat.posts.push(msg);

    await chat.save();

    return chat.users;
}

async function verifyUserInChat(chatId, userId) {
    const chat = await schemes.Chat.findById(chatId.id);
    if (chat === null)
        return false;
    const index = chat.users.find((item) => {
        return item.toString() === userId.toString();
    });
    if (index === undefined){
        return false;
    }
    return true;

}

export { start_database, saveUser, findUser, getPostsByUser, postMessageToWall,
    getFriendsOfUser, addFriend,acceptRequest, addMessageToChat, getFriendReqstOfUser, verifyUserInChat
 };