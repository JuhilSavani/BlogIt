import dotenv from "dotenv";
import passport from "passport";
import passportJWT from "passport-jwt";
import { User } from "../models/user.model.js";

// Load environmental variables
dotenv.config();

const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};

export const configurePassport = () => {
  passport.use(
    new JwtStrategy(jwtOptions, async (jwtPayload, callback) => {
      try {
        const user = await User.findById(jwtPayload.sub).select("_id username");
        if (user) {
          callback(null, user);
        } else {
          callback(null, false);
        }
      } catch (error) {
        callback(error, false);
      }
    })
  );
};