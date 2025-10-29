const db = require("./connector");

exports.listing = async () => {
  const [rows] = await db.execute("SELECT * FROM room ;");
  return rows;
};

exports.create = async (name) => {
  const [rows] = await db.execute(
    "INSERT INTO room (name) VALUES (?);",
    [name]
  );
  return rows;
};

exports.delete = async (roomID) => {
  const [result] = await db.execute("DELETE FROM room WHERE id = ? ;", [
    roomID,
  ]);
  return result.affectedRows > 0;
};
