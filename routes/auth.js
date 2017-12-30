const express = require('express');
const router = express.Router();

//bring passpoirt
const passport = require('passport');

router.get('/google', passport.authenticate('google',{
    scope:['profile', 'email']    //authenticating user profiles
    }));

    router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
(req, res) => {
      res.redirect('/dashboard');
    });

module.exports=router;
