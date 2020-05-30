import passport from 'passport';
import { Strategy as GithubStrategy } from 'passport-github2';
import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const acceptedUsers: Array<string> = JSON.parse(process.env.ACCEPTED_IDs);

export default (app: express.Application) => {
  passport.use(
    new GithubStrategy(
      {
        clientID: 'e929645c814cc93c0d25',
        clientSecret: process.env.GH_CLIENT_SECRET,
        callbackURL: 'https://studio.podcast.gq/auth/github/callback',
      },
      (accessToken: string, refreshToken: string, profile: any, done: Function) => {
        if (acceptedUsers.includes(profile.id)) {
          const token = jwt.sign(
            {
              id: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
            },
            process.env.JWT_KEY,
          );
          done(null, { token: token });
        } else {
          done(new Error('User not allowed to access the app'), null);
        }
      },
    ),
  );

  app.use(passport.initialize());
};
