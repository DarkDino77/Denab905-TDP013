import mongoose from 'mongoose';
import * as schemes from './scheme.js';

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

async function getFriendsOfUser(id, search, lambda) {
    let requests = await schemes.User.findById(id).select(search);
    requests = lambda(requests)
    let result = []
    for (let i = 0; i < requests.length; i++) {
        // TODO: flytta till db
        const reqName = await schemes.User.findById(requests[i]).select('name');
        result.push(reqName);
    }
    return result;
}

async function addFriend(userAdding, addedUser) {
    
    let user = await schemes.User.findById(addedUser);
    let indexfriendRequests = user.friendRequests.find((element) => {
        return element === userAdding
    }) 
    let indexfriends = user.friends.find((element) => element === userAdding)
    
    if (indexfriendRequests === undefined && indexfriends === undefined){
        user.friendRequests.push(userAdding);
    }
    else {
        return;
    }
    
    user.save();
}

async function acceptRequest(userAccepting, userAccepted) {
    let user = await schemes.User.findById(userAccepting);
    
    let index = user.friendRequests.find((element) => {
        return element.toString() === userAccepted;
    }); 

    if (index === undefined){
        return false;
    }


    user.friends.push(userAccepted);
    user.friendRequests.splice(index,1);
    user.save();

    let acceptedUser = await schemes.User.findById(userAccepted);
    acceptedUser.friends.push(userAccepting);
    acceptedUser.save();

    return true;
}

async function getPostsByUser(id) {
    let user = await schemes.User.findById(id);
    return user.posts;
}

async function findUser(query) {
    return schemes.User.findOne(query).exec();
}

async function saveUser(user) {
    return user.save();
}

export { start_database, saveUser, findUser, getPostsByUser, postMessageToWall,
    getFriendsOfUser, addFriend,acceptRequest
 };