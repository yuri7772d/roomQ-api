const errExep = require("../err.exeption");
const repo = require("../repo/queue");

// status 1 = approved 0 = paqing

exports.booking = async (reason, roomID, authenID, date) => {
  // สร้างวันที่จาก object at
  const today = new Date();
  today.setHours(0, 0, 0, 0); // ตัดเวลาออก เหลือแค่วันที่
  date.setHours(0, 0, 0, 0);
  // ตรวจว่าจองวันไม่ก่อนวันนี้
  if (date < today) {
    throw new Error(errExep.CANNOT_BOOKING_DAY);
  }

  // สมมุติเรียก repo เพื่อบันทึก
  const result = await repo.create(reason, roomID, authenID, 0, date);

  return {
    id: result.insertId,
    reason,
    authenID,
    at: date,
  };
};

exports.listingCurrent = async (year, month, roomID) => {
  return await repo.listing(year, month, roomID, [1]);
};
exports.listingAll = async (year, month, roomID) => {
  return await repo.listing(year, month, roomID, [0, 1]);
};

exports.getCurrentByID = async (queueID) => {
  return await repo.getbyID(queueID, [1]);
};

exports.getAllByDate = async (date, roomID) => {
  return await repo.getbyDateAndRoomID(date, roomID, [0, 1]);
};

exports.approve = async (queueID, date, roomID) => {
  const queues = await repo.getbyDateAndRoomID(date, roomID, [0, 1]);
  if (queues.length == 0) {
    throw new Error("");
  }
  let isHave = false;
  for (const queue of queues) {
    if (queue.id == queueID) {
      isHave = true;
      break;
    }
  }
  if (!isHave) {
    throw new Error("");
  }
  for (const queue of queues) {
    if (queue.id == queueID) {
      await repo.upDateStatus(queueID,1)
      continue;
    }
    await repo.upDateStatus(queue.id,2)
  }
  return;
};

exports.delete = async (queueID) => {
  if (await repo.delete(queueID)) return;
  throw new Error(errExep.DElETE_FAILED);
};
