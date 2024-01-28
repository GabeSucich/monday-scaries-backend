import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from './models/User';

passport.use(User.createStrategy())
passport.serializeUser((User as any).serializeUser())
passport.deserializeUser(User.deserializeUser())