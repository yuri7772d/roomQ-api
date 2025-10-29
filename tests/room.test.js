// __tests__/room.service.test.js
const repo = require("../src/repo/room");
const errExep = require("../src/err.exeption");
const service = require("../src/usecase/room");

// Mock repo ทั้งหมด
jest.mock("../src/repo/room");

describe("Room Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---------- TEST: CREATE ----------
  describe("create()", () => {
    it("ควรสร้างห้องใหม่และคืนค่า id, name", async () => {
      repo.create.mockResolvedValueOnce({ insertId: 10 });

      const result = await service.create("TestRoom");

      expect(repo.create).toHaveBeenCalledWith("TestRoom");
      expect(result).toEqual({
        id: 10,
        name: "TestRoom",
      });
    });

    it("ควรโยน error ถ้าชื่อซ้ำ (ER_DUP_ENTRY)", async () => {
      const err = new Error();
      err.code = "ER_DUP_ENTRY";
      repo.create.mockRejectedValueOnce(err);

      await expect(service.create("DupRoom")).rejects.toThrow(errExep.ROOM_USED);
    });

    it("ควรโยน error อื่นๆ ถ้าเกิดข้อผิดพลาดที่ไม่รู้จัก", async () => {
      const err = new Error("Unknown");
      repo.create.mockRejectedValueOnce(err);

      await expect(service.create("FailRoom")).rejects.toThrow("Unknown");
    });
  });

  // ---------- TEST: LISTING ----------
  describe("listing()", () => {
    it("ควรเรียก repo.listing() และคืนค่ารายการห้อง", async () => {
      const mockRooms = [{ id: 1, name: "Room1" }];
      repo.listing.mockResolvedValueOnce(mockRooms);

      const result = await service.listing();

      expect(repo.listing).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockRooms);
    });
  });

  // ---------- TEST: DELETE ----------
  describe("delete()", () => {
    it("ควรลบห้องสำเร็จเมื่อ repo.delete คืนค่า true", async () => {
      repo.delete.mockResolvedValueOnce(true);

      await expect(service.delete(1)).resolves.toBeUndefined();
      expect(repo.delete).toHaveBeenCalledWith(1);
    });

    it("ควรโยน error เมื่อ roomID ไม่ถูกส่งมา", async () => {
      await expect(service.delete()).rejects.toThrow(errExep.INVALID_INPUT);
    });

    it("ควรโยน error เมื่อ repo.delete คืนค่า false", async () => {
      repo.delete.mockResolvedValueOnce(false);

      await expect(service.delete(2)).rejects.toThrow(errExep.DELETE_FAILED);
    });
  });
});