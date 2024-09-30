import mongoose from 'mongoose';
import * as schemes from './scheme.js';

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
    let user = await schemes.User.findById(id);
    console.log(user.friends);
    return user.friends;
}

async function addFriend(userAdding, addedUser) {
    let user = await schemes.User.findById(addedUser);
    user.friendRequests.push(userAdding);
    
    user.save();
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
    getFriendsOfUser, addFriend
 };