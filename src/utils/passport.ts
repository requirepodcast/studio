import passport from 'passport';
import { Strategy as GithubStrategy } from 'passport-github2';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const acceptedUsers: Array<string> = JSON.parse(process.env.ACCEPTED_IDs);

export default (app: express.Application) => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  passport.use(
    new GithubStrategy(
      {
        clientID: 'e929645c814cc93c0d25',
        clientSecret: process.env.GH_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/auth/callback',
      },
      (accessToken: string, refreshToken: string, profile: any, done: Function) => {
        if (acceptedUsers.includes(profile.id)) {
          done(null, profile);
        } else {
          done(new Error('User not allowed to access the app'));
        }
      },
    ),
  );

  app.use(passport.initialize());
  app.use(passport.session());
};
