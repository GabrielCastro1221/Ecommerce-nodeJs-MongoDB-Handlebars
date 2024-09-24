const jwt = require("jsonwebtoken");
const configObject = require("../config/env.config");

const checkUserRole = (allowedRoles) => (req, res, next) => {
  const token = req.cookies[configObject.auth.cookie_token];

  if (token) {
    jwt.verify(token, configObject.auth.jwt_secret, (err, decoded) => {
      if (err) {
        res.redirect("/access-denied");
      } else {
        const userRole = decoded.user.role;
        if (allowedRoles.includes(userRole)) {
          next();
        } else {
          res.redirect("/access-denied");
        }
      }
    });
  } else {
    res.redirect("/access-denied");
  }
};

module.exports = checkUserRole;
