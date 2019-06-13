const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const TwitterStrategy = require('passport-twitter');
const FacebookStrategy = require('passport-facebook');
const User = require('../../models/user');
const mongoose = require('mongoose');

passport.serializeUser((user, done) => {
    done(null, user.id)
});

passport.deserializeUser((id, done) => {
    User.findById(id, function (err, user) {
        done(null, user)
    })
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    const googleData = profile._json;
    const conditions = {email: googleData.email, username: googleData.name, _id: new mongoose.Types.ObjectId()};
    User.findOne({email: googleData.email}, (err, user) => {
        if (err || !user) {
            newUser = new User(conditions);
            newUser.save()
                .then(result => done(null, result))
                .catch(err => console.log(err))
        }
        if (user) {
            done(null, user);
        }
    })
}));

passport.use(new FacebookStrategy({
    clientID: process.env.FB_APPID,
    clientSecret: process.env.FB_APP_SECRET,
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'emails']
}, (accessToken, refreshToken, profile, done) => {
    const facebookData = profile._json;
    const conditions = {email: facebookData.email, username: facebookData.name, _id: new mongoose.Types.ObjectId()};
    User.findOne({email: facebookData.email}, (err, user) => {
        if (err || !user) {
            newUser = new User(conditions);
            newUser.save()
                .then(result => done(null, result))
                .catch(err => console.log(err))
        }
        if (user) {
            done(null, user);
        }
    })
}));

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_API_KEY,
    consumerSecret: process.env.TWITTER_SECRET_KEY,
    callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback'
}, (token, tokenSecret, profile, done) => {
    const twitterData = profile._json;
    console.log(twitterData);
    // const conditions = {email: facebookData.email, username: facebookData.name, _id: new mongoose.Types.ObjectId()};
    // User.findOne({email: facebookData.email}, (err, user) => {
    //     if (err || !user) {
    //         newUser = new User(conditions);
    //         newUser.save()
    //             .then(result => done(null, result))
    //             .catch(err => console.log(err))
    //     }
    //     if (user) {
    //         done(null, user);
    //     }
    // })
}));
