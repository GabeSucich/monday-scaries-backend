import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import session from 'express-session'
import './models'
import {config} from "./config"

import "./passport-config"
import api from "./routes"

const mongoUrl = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/volumeBets"

mongoose.connect(mongoUrl)

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json())

// For development: Add latency to routes
// app.use(function(req,res,next){setTimeout(next,2000)})

import passport from 'passport';

// Import to initialize
import models from "./models"

app.use(session({
  secret: process.env.EXPRESS_SECRET_KEY || 'monday-scaries-day-1',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", api)

app.get("/", (req, res, next) => {
  res.send("You hit the api in dev mode!")
})

app.listen(config.server.port, () => {
  console.log(`Server is running on http://localhost:${config.server.port}`);
});