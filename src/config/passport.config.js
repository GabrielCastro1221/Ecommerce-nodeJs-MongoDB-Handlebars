const passport = require("passport");
const jwt = require("passport-jwt");
const User = require("../models/user.model");
const configObject = require("./env.config");

const JWTStrategy = jwt.Strategy;
const Jwt = jwt.ExtractJwt;

const initializePassport = () => {
  passport.use("jwt", new JWTStrategy({
    jwtFromRequest: Jwt.fromExtractors([cookieExtractor]),
    secretOrKey: configObject.auth.jwt_secret,
  },
    async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.user._id);

        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
  );
};

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[configObject.auth.cookie_token];
  }
  return token;
};

module.exports = initializePassport;
