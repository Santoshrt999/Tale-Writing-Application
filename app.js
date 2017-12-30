const express =require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');


//load model

require('./models/User');
//passport coni
require('./config/passport')(passport);


const app=express(); //adding express to the app
//load routes from the folder..
const index = require('./routes/index');
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
//handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//express-session 
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

//passport midleware
app.use(passport.initialize());
app.use(passport.session());

//global vars
app.use((req,res,next)=>{
    res.locals.user = req.user || null;
    next();
})


//use route and connnecting it
app.use('/', index);
app.use('/auth', auth);



const port = process.env.PORT ||5000;
app.listen(port, ()=>{
    console.log("App is listening");
});


