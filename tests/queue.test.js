const queueService = require('../src/usecase/queue'); // ปรับ path ตามจริง
const repo = require('../src/repo/queue');

jest.mock('../src/repo/queue'); // mock repo ทั้งหมด

describe('Queue Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('booking', () => {
    let date = new Date()
    date.setFullYear(2025, 12 - 1, 7 + 1)
    it('approve', async () => {
      const mockResult = [
        { id: 4, at: date, status_id: 0 },
        { id: 5, at: date, status_id: 0 },
        { id: 6, at: date, status_id: 0 },
        { id: 7, at: date, status_id: 0 },
        { id: 8, at: date, status_id: 0 }];
      repo.getbyDateAndRoomID.mockResolvedValue(mockResult);

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

    });
  })
});