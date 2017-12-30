const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema at application level
const UserSchema = new Schema({
    googleID:{
        type:String,
        required: true
    },
    email:
    {
        type: String,
        required: true
    },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type:String,
        required:true
     },
    image:{
        type:String,
        
    }
});

//create collection

mongoose.model('users', UserSchema);