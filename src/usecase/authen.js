const { root,jwt:jwtConf } = require("../config.load");
const jwt = require("jsonwebtoken");
const errExep = require("../err.exeption");
const repo = require("../repo/authen");

exports.create = async (username, password, roleID) => {
  if (username == root.username) {
    throw new Error(errExep.USER_USED);
  }
  if (!(roleID == 1 || roleID == 2)) {
    throw new Error(errExep.ROLE_NOT_FOUND);
  }

  let result;
  try {
    result = await repo.create(username, password, roleID);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      throw new Error(errExep.USER_USED);
    }
    throw err;
  }

  const userId = result.insertId;

  const payload = { id: userId, username, role: roleID };

  // 5. ส่ง response กลับ
  return {
    payload,
  };
};

exports.login = async (username, password) => {
  let payload;

  if (username == root.username) {
    if (root.password != password) {
      throw new Error(errExep.PASSWORD_INVALID);
    }
        payload = {
      id: -1,
      username: username,
      role: 0,
    };
  } else {
    const authen = await repo.getbyUsername(username);
    console.log(authen);
    if (authen.length == 0) {
      throw new Error(errExep.USERNAME_NOT_FOUND);
    }
    if (authen[0].password != password) {
      throw new Error(errExep.PASSWORD_INVALID);
    }

    payload = {
      id: authen[0].id,
      username: authen[0].username,
      role: authen[0].role_id,
    };
  }

  // 4. สร้าง access token + refresh token
  const token = jwt.sign(payload, jwtConf.secret, { expiresIn: "1d" });
  const refreshToken = jwt.sign(payload, jwtConf.refreshSecret, {
    expiresIn: "7d",
  });

  return {
    payload,
    token,
    refreshToken,
  };
};

exports.refreshToken = async (refreshToken) => {
  const decoded = jwt.verify(refreshToken, jwtConf.refreshSecret);
  const payload = {
    id: decoded.id,
    username: decoded.username,
    role: decoded.role,
  };
  const token = jwt.sign(payload, jwtConf.secret, { expiresIn: "1d" });

  return {
    payload,
    token,
    refreshToken,
  };
};

exports.listing = async () => {
  return await repo.listing() ;
};

exports.delete = async (authenID) => {
    if ( await repo.delete(authenID)) return ;
    throw new Error(errExep.DElETE_FAILED);
     
}