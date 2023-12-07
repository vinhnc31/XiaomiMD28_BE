const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const { Account_google } = require("../models/index");
const { User } = require("../models/index");

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "112355187039-uk6vangrfjt6ec5cbjj1d7p3ri54f5ns.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "/api/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      console.log(profile.displayName);
      if (profile?.id) {
        await User.findOrCreate({
          where: { idUser: profile.id },
          defaults: {
            idUser: profile.id,
            name: profile.displayName,
          },
        });

        const response = await Account_google.findOrCreate({
          where: { idUser: profile.id },
          defaults: {
            idUser: profile.id,
            email: profile.emails[0]?.value,
          },
        });
      }
      return cb(null, profile);
    }
  )
);
