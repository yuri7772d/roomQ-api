const repo = require("../repo/room");

exports.create = async (name) => {
  let result;
  try {
    result = await repo.create(name);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      throw new Error(errExep.USER_USED);
    }
    throw err;
  }
  const id = result.insertId;
 return {
    id:id,
    name:name 
 }

};

exports.listing = async () => {
  return await repo.listing();
};

exports.delete = async (roomID) => {
  if (await repo.delete(authenID)) return;
  throw new Error(errExep.DElETE_FAILED);
};
