const errExep = require("../err.exeption");
const repo = require("../repo/queue");

// status 1 = approved 0 = paqing

exports.booking = async (reason, roomID, authenID, date) => {
  // สร้างวันที่จาก object at
  const today = new Date();
  today.setHours(0, 0, 0, 0); // ตัดเวลาออก เหลือแค่วันที่
 // date.setHours(0, 0, 0, 0);
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

  const queues = await repo.listing(year, month, roomID, [1]);
  if (queues.length == 0) return [];
  console.log(queues);
  let preQueue = queues[0];
  let result = [];
  let SomeDate = [];

  for (const queue of queues) {
    if (preQueue.at.getTime() !== queue.at.getTime()) {
      result.push(SomeDate[0]);
      SomeDate = [];
      preQueue = queue
    }
    SomeDate.push(queue)

  }
  result.push(SomeDate[0]);

  return result
};
exports.listingAll = async (year, month, roomID) => {

  const queues = await repo.listing(year, month, roomID, [0, 1]);
  if (queues.length == 0) return [];
  let preQueue = queues[0];
  let result = [];
  let SomeDate = [];
  let cutedDates = [];
  for (const queue of queues) {
    if (preQueue.at.getTime() !== queue.at.getTime()) {
      cutedDates.push(SomeDate);
      SomeDate = [];
      preQueue = queue
    }
    SomeDate.push(queue)

  }
  cutedDates.push(SomeDate);

  for (const dates of cutedDates) {
    let isPush = false;
    let q ;
    for ( q of dates) {
      if (q.status_id == 1 && !isPush) {
        result.push({id: q.id, date: q.at, statusID: 1 })
        isPush = true
      }
    }
    if (!isPush) result.push({id:q.id, date: dates[0].at, statusID: 0 });
  }
  return result

};

exports.getCurrentByID = async (queueID) => {

  return await repo.getbyID(queueID, [1]);
};
//status 0 = pading 1 = aproved 
exports.getAllByDate = async (date, roomID) => {
  return await repo.getbyDateAndRoomID(date, roomID, [0, 1]);
};

exports.approve = async (queueID, date, roomID) => {
  const queues = await repo.getbyDateAndRoomID(date, roomID, [0, 1]);
  if (queues.length == 0) {
    throw new Error(errExep.NOT_DATE);
  }
  let isHave = false;
  for (const queue of queues) {
    if (queue.id == queueID) {
      isHave = true;
      break;
    }
  }
  if (!isHave) {
    throw new Error(errExep.Q_NOT_FOUND);
  }
  for (const queue of queues) {
    if (queue.id == queueID) {
      await repo.upDateStatus(queueID, 1)
      continue;
    }
    await repo.upDateStatus(queue.id, 2)
  }
  return;
};

exports.delete = async (queueID) => {
  if (await repo.delete(queueID)) return;
  throw new Error(errExep.DElETE_FAILED);
};
