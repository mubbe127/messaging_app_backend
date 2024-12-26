import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import prisma from "../model/prismaClient.js";

const jwt = require("jsonwebtoken");


var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "fluoguide";
passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      console.log("användare");
      const user = await prisma.user.findUnique({
        where: { id: jwt_payload.sub },
      });

      console.log(user);
      if (!user) {
        console.log("token user not found");
        return done(null, false, { message: "Incorrect username" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);



// Mock database for storing refresh tokens (use a real database in production)


export default passport;
