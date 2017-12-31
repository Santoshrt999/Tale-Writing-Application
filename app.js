const express =require('express');
const mongoose = require('mongoose');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');


//load  DATABASE model-> NOsql

require('./models/User');
require('./models/Tale');
//passport coni

require('./config/passport')(passport);
//load routes from the folder..
const index = require('./routes/index');
const auth = require('./routes/auth');
const tales = require('./routes/tales');
//load keys
const keys = require('./config/keys');

//handlebars helpers
const{
    truncate,
    stripTags,
    formatDate,
    select,
    editIcon
} = require('./helpers/hbs');

mongoose.Promise = global.Promise; //handling unhandled promsie exceptions
//mongoose connect
mongoose.connect(keys.mongoURI, {
useMongoClient: true
})

//promise starts
.then(()=>{
    console.log('MongDB Database Connected');
}).catch(err => console.log(err));

const app=express(); //creating an express instance => app


//global promise

//bodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Mthod-overrdie middleware
app.use(methodOverride('_method'));

//express-session 
app.use(cookieParser()); //parsi
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));


//passport midleware
app.use(passport.initialize());
app.use(passport.session());


//handlebars
app.engine('handlebars', exphbs({
    helpers: {
        truncate: truncate,
        stripTags: stripTags,
        formatDate: formatDate,
        select: select,
        editIcon: editIcon
    },
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');



//global vars middleware
app.use((req,res,next)=>{
    res.locals.user = req.user || null;
    next();
})

//paths
app.use(express.static(path.join(__dirname, 'public')));



//use route and connnecting it
app.use('/', index);
app.use('/auth', auth);
app.use('/tales', tales);



const port = process.env.PORT ||5000;
app.listen(port, ()=>{
    console.log("App is listening");
});


