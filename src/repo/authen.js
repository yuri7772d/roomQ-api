const db = require("./connector");

exports.listing = async () => {
  const [rows] = await db.execute("SELECT * FROM authen ;");
  return rows;
};

exports.getbyID = async (authenID) => {
  const [rows] = await db.execute("SELECT * FROM authen WHERE id = ? ;", [
    authenID,
  ]);
  return rows;
};

exports.getbyUsername = async (username) => {
  const [rows] = await db.execute("SELECT * FROM authen WHERE username = ? ;", [
    username,
  ]);
  return rows;
};

exports.create = async (username, password, roleID) => {
  const [rows] = await db.execute(
    "INSERT INTO authen (username,password,role_id) VALUES (?,?,?);",
    [username, password, roleID]
  );
  return rows;
};

exports.delete = async (authenID) => {
  const [result] = await db.execute("DELETE FROM authen WHERE id = ? ;", [
    authenID,
  ]);
  return result.affectedRows > 0;
};
