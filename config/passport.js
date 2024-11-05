// config/passport.js
import passport from "passport";
import OAuth2Strategy from 'passport-google-oauth2'
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

// passport.use(
//   new OAuth2Strategy.Strategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: '/auth/google/callback',
//       passReqToCallback:true,
//       scope: ["profile", "email"],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         console.log("profilr ",profile)
//         let user = await User.findOne({ googleId: profile.id });

//         if (!user) {
//           user = new User({
//             googleId: profile.id,
//             name: profile.displayName,
//             email: profile.emails[0].value,
//             image: profile.photos[0].value,
//           });

//           await user.save();
//         }
//         return done(null, user);
//       } catch (err) {
//         return done(err, null);
//       }
//     }
//   )
// );
// import { OAuth2Strategy } from 'passport-google-oauth2';

// Assuming you have already set up passport
passport.use(
  new OAuth2Strategy.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    // passReqToCallback: true, // This allows you to access the request in your callback
    scope: ["profile", "email"],
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      console.log("profile", profile ,"hea::",req.headers.origin);
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        user = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          image: profile.photos[0].value,
        });

        await user.save();
      }
      return done(null, user); // Call done with the user object
    } catch (err) {
      return done(err, null); // Call done with the error
    }
  })
);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser(async (user, done) => {
//   const user = await User.findById(id);
  done(null, user);
});
