// __tests__/authen.test.js
const jwt = require("jsonwebtoken");

// mock module ที่ import ในไฟล์หลัก

const mockCreate = jest.fn();
const mockGetbyUsername = jest.fn();
const mockListing = jest.fn();
const mockDelete = jest.fn();
jest.mock("../src/repo/authen", () => ({
  create: jest.fn(),
  getbyUsername: jest.fn(),
  listing: jest.fn(),
  delete: jest.fn(),
}));


jest.mock("../src/config.load", () => ({
  root: { username: "admin", password: "1234" },
  jwt: { secret: "test-secret", refreshSecret: "test-refresh-secret" },
}));

jest.mock("../src/err.exeption", () => ({
  USER_USED: "User already exists",
  ROLE_NOT_FOUND: "Role not found",
  PASSWORD_INVALID: "Password invalid",
  USERNAME_NOT_FOUND: "Username not found",
}));

const repo = require("../src/repo/authen");
const authen = require("../src/usecase/authen");

describe("Authen Usecase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ----------- CREATE -----------
  test("should throw error if username = root.username", async () => {
   
    await expect(authen.create("admin", "1234", 1))
      .rejects
      .toThrow("User already exists");
  });

  test("should throw error if roleID is not 1 or 2", async () => {
    await expect(authen.create("user", "pass", 3))
      .rejects
      .toThrow("Role not found");
  });

  test("should create user successfully", async () => {
    repo.create.mockResolvedValue({ insertId: 10 });

    const result = await authen.create("user1", "pass", 1);

    expect(repo.create).toHaveBeenCalledWith("user1", "pass", 1);
    expect(result.payload).toEqual({
      id: 10,
      username: "user1",
      role: 1,
    });
  });

  // ----------- LOGIN -----------
  test("should login as root successfully", async () => {
    const res = await authen.login("admin", "1234");
    expect(res.payload.username).toBe("admin");
    expect(res.token).toBeDefined();
  });

  test("should throw PASSWORD_INVALID if root password wrong", async () => {
    await expect(authen.login("admin", "wrong"))
      .rejects
      .toThrow("Password invalid");
  });

  test("should login with repo user successfully", async () => {
    repo.getbyUsername.mockResolvedValue([
      { id: 1, username: "user1", password: "pass", role_id: 2 },
    ]);

    const result = await authen.login("user1", "pass");

    expect(repo.getbyUsername).toHaveBeenCalledWith("user1");
    expect(result.payload.username).toBe("user1");
  });

  test("should throw USERNAME_NOT_FOUND if user not exist", async () => {
    repo.getbyUsername.mockResolvedValue([]);
    await expect(authen.login("notfound", "123"))
      .rejects
      .toThrow("Username not found");
  });

  test("should throw PASSWORD_INVALID if password wrong", async () => {
    repo.getbyUsername.mockResolvedValue([
      { id: 1, username: "user1", password: "correct", role_id: 1 },
    ]);
    await expect(authen.login("user1", "wrong"))
      .rejects
      .toThrow("Password invalid");
  });

  // ----------- REFRESH TOKEN -----------
  test("should generate new token from refreshToken", async () => {
    const refreshToken = jwt.sign({ id: 1, username: "user1", role: 2 }, "test-refresh-secret");
    const result = await authen.refreshToken(refreshToken);
    expect(result.token).toBeDefined();
    expect(result.payload.username).toBe("user1");
  });

  // ----------- LISTING -----------
  test("should call repo.listing()", async () => {
    repo.listing.mockResolvedValue([{ id: 1, username: "a" }]);
    const data = await authen.listing();
    expect(data).toEqual([{ id: 1, username: "a" }]);
  });
});
