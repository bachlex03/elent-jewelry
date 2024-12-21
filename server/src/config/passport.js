const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const authService = require('../services/auth.service')
require('dotenv').config({ path: '.env.development' });
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(456)
        const user = await authService.findOrCreateUser(profile);
        return done(null, user); // Trả user vào passport
      } catch (error) {
        console.log("error",error)
        done(error, null);
      }
    }
  )
);

passport.authenticate('google', {
  scope: ['profile', 'email'],
});

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
module.exports = passport;