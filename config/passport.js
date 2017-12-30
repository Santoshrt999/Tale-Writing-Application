const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

const User = mongoose.model('users');

module.exports = function(passport){
  passport.use(
    new GoogleStrategy({
      clientID: keys.googleClientID,
      clientSecret:keys.googleClientSecret,
      callbackURL:'/auth/google/callback',
      proxy: true
    }, (accessToken, refreshToken, profile, done) => {
      console.log(accessToken);
      console.log(profile);

      const image = profile.photos[0].value.substring(0,
    profile.photos[0].value.indexOf('?'));
    const newUser = {
        googleID: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        image: image
    }
    User.findOne({
        googleID: profile.id
    }).then(user=>{
        if(user){   //if user we return null and that user
        done(null,user);
        }else{
            //else we create user and return null
            new User(newUser)
            .save()
            .then(user=>{
                done(null,user);
            })
        }
    })
    })
  );
  passport.serializeUser((user,done)=>{
      done(null, user.id);
  });
  passport.deserializeUser((id,done)=>{   //id for deserializing the elements
User.findById(id).then(user=> done(null, user));
  });

}