const express =require('express');
const mongoose = require('mongoose');

const app=express(); //adding express to the app



app.get('/', (req,res)=>{
    res.send('Hi');
})

const port =5000;
app.listen(port, ()=>{
    console.log("App is listening");
});


