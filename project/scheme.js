import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    posts: {type: Array},  // lista av Post-schemas
    friends: {type: Array}, // lista av idn
    friendRequests: {type: Array}
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
    }
    
});

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Message', postSchema);

export { User, Post }