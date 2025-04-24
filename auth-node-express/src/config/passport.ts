import passport from 'passport';
import { Strategy as GoogleStrategy, VerifyCallback } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy, Profile as GitHubProfile } from 'passport-github2';
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

passport.use(
  new GitHubStrategy(
    {
      clientID: config.github.clientId,
      clientSecret: config.github.clientSecret,
      callbackURL: `${config.server.url}/api/auth/github/callback`,
    },
    async (accessToken: string,
      refreshToken: string,
      profile: GitHubProfile,
      done: VerifyCallback) => {
      try {
        const email = profile.emails?.[0]?.value;
        const username = profile.username;

        if (!email) {
          return done(new Error('GitHub account has no public email'), false);
        }

        let user = await User.findOne({ email });

        if (user) {
          if (!user.isEmailVerified) user.isEmailVerified = true;
          if (!user.authProvider.includes(AuthProviderEnum.GITHUB)) user.authProvider.push(AuthProviderEnum.GITHUB);

          await user.save();
        } else {
          user = await User.create({
            email,
            username,
            authProvider: [AuthProviderEnum.GITHUB],
            isEmailVerified: true,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
