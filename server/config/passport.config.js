import passport from "passport";
import passportJWT from "passport-jwt";
import { User } from "../models/user.model";

const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, callback) => {
    try{
      const user = await User.findById(jwtPayload.sub);
      if(user){
        callback(null, user);
      }else{
        callback(null, false);
      }
    }catch(error){
      callback(error, false);
    }
  })
);

export default passport;