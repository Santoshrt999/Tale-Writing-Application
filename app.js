const express =require('express');
const mongoose = require('mongoose');
const passport = require('passport');

//passport coni
require('./config/passport')(passport);


const app=express(); //adding express to the app


//load routes from the folder..
const auth = require('./routes/auth');


app.get('/', (req,res)=>{
    res.send('Hi');
});

//use route and connnecting it
app.use('/auth', auth);

const port =5000;
app.listen(port, ()=>{
    console.log("App is listening");
});


