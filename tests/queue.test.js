const queueService = require('../src/usecase/queue'); // ปรับ path ตามจริง
const repo = require('../src/repo/queue');

jest.mock('../src/repo/queue'); // mock repo ทั้งหมด

describe('Queue Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('booking', () => {
    it('should create a booking for valid date', async () => {
      const mockResult = { insertId: 123 };
      repo.create.mockResolvedValue(mockResult);

      const bookingDate = new Date();
      bookingDate.setDate(bookingDate.getDate() + 1); // วันพรุ่งนี้
      const dateObj = {
        year: bookingDate.getFullYear(),
        month: bookingDate.getMonth() + 1,
        day: bookingDate.getDate()
      };

      const result = await queueService.booking(
        'Test reason',
        1, // roomID
        42, // authenID
        dateObj
      );

      expect(result).toEqual({
        id: 123,
        reason: 'Test reason',
        authenID: 42,
        at: new Date(dateObj.year, dateObj.month - 1, dateObj.day),
      });

      expect(repo.create).toHaveBeenCalledWith(
        'Test reason',
        1,
        42,
        0,
        new Date(dateObj.year, dateObj.month - 1, dateObj.day)
      );
    });

    it('should throw error if date is before today', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const dateObj = {
        year: pastDate.getFullYear(),
        month: pastDate.getMonth() + 1,
        day: pastDate.getDate(),
      };

      await expect(
        queueService.booking('Test reason', 1, 42, dateObj)
      ).rejects.toThrow("❌ ไม่สามารถจองก่อนวันปัจจุบันได้");
    });
  });

  describe('listingCurrent', () => {
    it('should call repo.listing with status [1]', async () => {
      repo.listing.mockResolvedValue([1,2,3]);
      const res = await queueService.listingCurrent(10, 2025);
      expect(res).toEqual([1,2,3]);
      expect(repo.listing).toHaveBeenCalledWith(10, 2025, [1]);
    });
  });

  describe('listingAll', () => {
    it('should call repo.listing with status [0,1]', async () => {
      repo.listing.mockResolvedValue([4,5,6]);
      const res = await queueService.listingAll(10, 2025);
      expect(res).toEqual([4,5,6]);
      expect(repo.listing).toHaveBeenCalledWith(10, 2025, [0,1]);
    });
  });

  describe('getCurrentByID', () => {
    it('should call repo.getbyID with status [1]', async () => {
      repo.getbyID.mockResolvedValue({ id: 1 });
      const res = await queueService.getCurrentByID(1);
      expect(res).toEqual({ id: 1 });
      expect(repo.getbyID).toHaveBeenCalledWith(1, [1]);
    });
  });

  describe('getAllByDate', () => {
    it('should call repo.getbyDate with status [0,1]', async () => {
      repo.getbyDate.mockResolvedValue([{ id: 1 }]);
      const dateObj = { year: 2025, month: 10, day: 29 };
      const res = await queueService.getAllByDate(dateObj);
      expect(res).toEqual([{ id: 1 }]);
      expect(repo.getbyDate).toHaveBeenCalledWith(dateObj, [0,1]);
    });
  });

  describe('delete', () => {
    const errExep = { DElETE_FAILED: 'delete failed' };
    beforeAll(() => {
      global.errExep = errExep;
    });

    it('should delete queue successfully', async () => {
      repo.delete.mockResolvedValue(true);
      await expect(queueService.delete(1)).resolves.toBeUndefined();
      expect(repo.delete).toHaveBeenCalledWith(1);
    });

    it('should throw error if delete failed', async () => {
      repo.delete.mockResolvedValue(false);
      await expect(queueService.delete(1)).rejects.toThrow(errExep.DElETE_FAILED);
    });
  });
});