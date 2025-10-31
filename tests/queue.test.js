const queueUsecase = require("../src/usecase/queue");
const repo = require("../src/repo/queue");
const errExep = require("../src/err.exeption");

// Mock repo functions ทั้งหมด
jest.mock("../src/repo/queue");

describe("Queue Usecase Unit Tests", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ------------------------
  // booking()
  // ------------------------
  describe("booking()", () => {
    it("ควรโยน error ถ้าจองวันก่อนวันนี้", async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      await expect(
        queueUsecase.booking("test", 1, 1, pastDate)
      ).rejects.toThrow(errExep.CANNOT_BOOKING_DAY);
    });

    it("ควรสร้างการจองสำเร็จ", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      repo.create.mockResolvedValue({ insertId: 100 });

      const result = await queueUsecase.booking("Meeting", 2, 10, futureDate);

      expect(repo.create).toHaveBeenCalledWith("Meeting", 2, 10, 0, futureDate);
      expect(result).toEqual({
        id: 100,
        reason: "Meeting",
        authenID: 10,
        at: futureDate,
      });
    });
  });

  // ------------------------
  // listingAll()
  // ------------------------
  describe("listingAll()", () => {
    it("ควรรวมสถานะถูกต้องจากหลายวัน", async () => {
      const date1 = new Date("2025-10-01");
      const date2 = new Date("2025-10-02");

      repo.listing.mockResolvedValue([
        { at: date1, status_id: 1 },
        { at: date1, status_id: 0 },
        { at: date2, status_id: 0 },
      ]);

      const result = await queueUsecase.listingAll(2025, 10, 1);

      expect(result).toEqual([
        { date: date1, statusID: 1 },
        { date: date2, statusID: 0 },
      ]);
      expect(repo.listing).toHaveBeenCalledWith(2025, 10, 1, [0, 1]);
    });
  });

  // ------------------------
  // approve()
  // ------------------------
  describe("approve()", () => {
    it("ควรโยน error ถ้าไม่มี queue ในวันนั้น", async () => {
      repo.getbyDateAndRoomID.mockResolvedValue([]);

      await expect(queueUsecase.approve(1, new Date(), 1))
        .rejects.toThrow(errExep.NOT_DATE);
    });

    it("ควรโยน error ถ้าไม่พบ queueID ที่ต้องการอนุมัติ", async () => {
      const date = new Date();
      repo.getbyDateAndRoomID.mockResolvedValue([{ id: 2 }]);

      await expect(queueUsecase.approve(1, date, 1))
        .rejects.toThrow(errExep.Q_NOT_FOUND);
    });

    it("ควรอัปเดตสถานะถูกต้องเมื่ออนุมัติสำเร็จ", async () => {
      const date = new Date();
      const queues = [{ id: 1 }, { id: 2 }];
      repo.getbyDateAndRoomID.mockResolvedValue(queues);
      repo.upDateStatus.mockResolvedValue(true);

      await queueUsecase.approve(1, date, 1);

      expect(repo.upDateStatus).toHaveBeenCalledWith(1, 1); // อนุมัติ
      expect(repo.upDateStatus).toHaveBeenCalledWith(2, 2); // ปฏิเสธ
    });
  });

  // ------------------------
  // delete()
  // ------------------------
  describe("delete()", () => {
    it("ควรลบสำเร็จโดยไม่โยน error", async () => {
      repo.delete.mockResolvedValue(true);
      await expect(queueUsecase.delete(1)).resolves.not.toThrow();
    });

    it("ควรโยน error ถ้าลบไม่สำเร็จ", async () => {
      repo.delete.mockResolvedValue(false);
      await expect(queueUsecase.delete(1))
        .rejects.toThrow(errExep.DElETE_FAILED);
    });
  });
});