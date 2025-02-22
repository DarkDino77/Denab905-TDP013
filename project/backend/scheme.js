import mongoose, { mongo, set } from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    posts: {type: Array},  // lista av Post-schemas
    friends: {type: Array}, // lista av idn
    friendRequests: {type:Array},
});

// TODO: kolla om vi faktiskt vill ha ett id på denna
const postSchema = new mongoose.Schema({
    message: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: 140
    },
    date: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    author: {
        type: String,
    }
    
},{_id: false});

const loginRequest = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, {_id: false});

const idSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    }
}, {_id: false});

const chatSchema = new mongoose.Schema({
    users: {type: Array},
    posts: {type: Array},
});

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Message', postSchema);
const LoginRequest = mongoose.model('LoginRequest', loginRequest);
const ID = mongoose.model('ID', idSchema);
const Chat = mongoose.model('Chat', chatSchema);

export { User, Post, LoginRequest, ID, Chat }