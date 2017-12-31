const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Tale = mongoose.model('tales');
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');

router.get('/',ensureGuest, (req,res)=>{
   res.render('index/welcome');
});
    
router.get('/dashboard', ensureAuthenticated, (req,res)=>{
    Tale.find({user:req.user.id})
    .then(tales=>{
        res.render('index/dashboard',{
            tales: tales
        });
    });    
    
   
});

router.get('/about', (req,res)=>{
    res.render('index/about');

});


module.exports = router;