const db = require("./connector");

exports.listing = async (year, month, roomID, statusIDs) => {
  const [rows] = await db.execute(
    `
    SELECT id, at, status_id FROM queue
    WHERE MONTH(at) = ?
      AND YEAR(at) = ?
      AND room_id = ?
      AND status_id IN (${statusIDs})
      ORDER BY at ASC;
  `,
    [month, year, roomID]
  );
  return rows;
};

exports.getbyDateAndRoomID = async (date, roomID, statusIDs) => {
  const [rows] = await db.execute(
    `
 SELECT 
    q.id,
    a.username,
    q.reason,
    q.status_id,
    q.at
  FROM queue q
  JOIN authen a ON q.authen_id = a.id
  WHERE DATE(q.at) =?
  AND q.room_id = ?
  AND q.status_id IN (${statusIDs})
  ORDER BY q.at ASC;`,
    [date, roomID]
  );

  return rows;
};

exports.getbyID = async (queueID, statusIDs) => {
  const [rows] = await db.execute(
    `
    SELECT 
    q.id,
    a.username,
    q.reason,
    q.status_id,
    q.at
    FROM queue q
    JOIN authen a ON q.authen_id = a.id
    WHERE q.id =?
    AND q.status_id IN (${statusIDs});`,
    [queueID]
  );
  return rows;
};

exports.create = async (reason, roomID, authenID, statusID, date) => {
  const [rows] = await db.execute(
    "INSERT INTO queue (reason,room_id,authen_id,status_id,at) VALUES (?,?,?,?,?);",
    [reason, roomID, authenID, statusID, date]
  );
  return rows;
};

exports.delete = async (queueID) => {
  const [result] = await db.execute("DELETE FROM queue WHERE id = ? ;", [
    queueID,
  ]);
  return result.affectedRows > 0;
};

exports.upDateStatus = async (queueId, statusID) => {
  const [rows] = await db.execute(
    "UPDATE queue SET status_id = ? WHERE id = ?;",
    [statusID, queueId]
  );
  return rows;
};
