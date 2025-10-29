const jwt = require("jsonwebtoken");
const { jwt: jwtConf } = require("../../config.load");
const errExep = require("../../err.exeption");
module.exports = (allowRoles) => {
  return (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ mesage: errExep.TOKEN_NOT_FOUND });
    }
    try {
      const payload = jwt.verify(token, jwtConf.secret);
      req.payload = payload;

      const role = payload.role;
      let is_used = false;
      for (const allowRole of allowRoles) {
        if (role == allowRole) {
          is_used = true;
          break;
        }
      }
      if (!is_used) {
        return res.status(401).json({ mesage: errExep.ROLE_INVALID });
      }
      next();
    } catch (error) {
      return res.status(401).json({ mesage: errExep.TOKEN_INVALID });
    }
  };
};
