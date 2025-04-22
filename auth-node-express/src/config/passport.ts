import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../users/user.model';
import config from './config';
import { AuthProviderEnum } from '../users/user.interface';

passport.use(new GoogleStrategy(
  {
    clientID: config.google.clientId,
    clientSecret: config.google.clientSecret,
    callbackURL: `${config.server.url}/api/auth/google/callback`,
  },
  async (accessToken, refreshToken, profile, done) => {
    const email = profile.emails?.[0]?.value;
    const name = profile.displayName;

    try {
      let user = await User.findOne({ email });

      if (user) {
        if (!user.isEmailVerified) {
          user.isEmailVerified = true;
        }

        if (!user.authProvider.includes(AuthProviderEnum.GOOGLE)) {
          user.authProvider.push(AuthProviderEnum.GOOGLE);
        }

        await user.save();
      } else {
        user = await User.create({
          email,
          username: name,
          authProvider: [AuthProviderEnum.GOOGLE],
          isEmailVerified: true,
        });
      }

      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }
));

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
