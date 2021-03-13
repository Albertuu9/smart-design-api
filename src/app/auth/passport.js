const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
require('dotenv').config();

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});
// github login
passport.use(new GitHubStrategy({
  // clientID: process.env.DEV_GITHUB_CLIENT_ID,
  // clientSecret: process.env.DEV_GITHUB_CLIENT_SECRET,
  // callbackURL: process.env.DEV_GITHUB_CALLBACK_URL
  clientID: process.env.PROD_GITHUB_CLIENT_ID,
  clientSecret: process.env.PROD_GITHUB_CLIENT_SECRET,
  callbackURL: process.env.PROD_GITHUB_CALLBACK_URL
},
function(accessToken, refreshToken, profile, done) {
  return done(null, profile);
}
));
// google login
passport.use(new GoogleStrategy({
  // clientID: process.env.DEV_GOOGLE_CLIENT_ID,
  // clientSecret: process.env.DEV_GOOGLE_CLIENT_SECRET,
  // callbackURL: process.env.DEV_GOOGLE_CALLBACK_URL
    clientID: process.env.PROD_GOOGLE_CLIENT_ID,
    clientSecret: process.env.PROD_GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.PROD_GOOGLE_CALLBACK_URL
},
function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
}
));
