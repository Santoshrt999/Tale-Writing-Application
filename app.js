const express =require('express');
const mongoose = require('mongoose');
const passport = require('passport');
//load model

reuire('./models/User');
//passport coni
require('./config/passport')(passport);


const app=express(); //adding express to the app
//load routes from the folder..
const auth = require('./routes/auth');
//load keys
const keys = require('./config/keys');

//global promise
mongoose.Promise = global.Promise;
//mongoose connect
mongoose.connect(keys.mongoURI, {
useMongoClient: true

})
//promise starts
.then(()=>{
    console.log('MongDB Database Connected');
}).catch(err => console.log(err));




app.get('/', (req,res)=>{
    res.send('Hi');
});

//use route and connnecting it
app.use('/auth', auth);

const port = process.env.PORT ||5000;
app.listen(port, ()=>{
    console.log("App is listening");
});


