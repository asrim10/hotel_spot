import { UserService } from "../../../services/user.service";
import { UserRepository } from "../../../repositories/user.repositories";
import { HttpError } from "../../../errors/http-error";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// --- Mocks ---
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../../../config/email");

describe("UserService", () => {
  let service: UserService;

  const fakeUser = {
    _id: "user123",
    email: "test@example.com",
    username: "testuser",
    password: "hashed_pw",
    fullName: "Test User",
    role: "user",
  };

  // Spy on prototype so we intercept the module-level instance
  const repo = {
    getUserByEmail: jest.spyOn(UserRepository.prototype, "getUserByEmail"),
    getUserByUsername: jest.spyOn(
      UserRepository.prototype,
      "getUserByUsername",
    ),
    getUserByID: jest.spyOn(UserRepository.prototype, "getUserByID"),
    createUser: jest.spyOn(UserRepository.prototype, "createUser"),
    updateUser: jest.spyOn(UserRepository.prototype, "updateUser"),
    deleteUserById: jest.spyOn(UserRepository.prototype, "deleteUserById"),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UserService();
  });

  // 1. createUser: throws if email already in use
  it("1. createUser throws 403 if email is already in use", async () => {
    repo.getUserByEmail.mockResolvedValue(fakeUser as any);

    await expect(
      service.createUser({
        email: "test@example.com",
        username: "new",
        password: "pw",
        confirmPassword: "pw",
      }),
    ).rejects.toThrow(new HttpError(403, "Email already in use"));
  });

  // 2. createUser: throws if username already in use
  it("2. createUser throws 403 if username is already in use", async () => {
    repo.getUserByEmail.mockResolvedValue(null);
    repo.getUserByUsername.mockResolvedValue(fakeUser as any);

    await expect(
      service.createUser({
        email: "new@example.com",
        username: "testuser",
        password: "pw",
        confirmPassword: "pw",
      }),
    ).rejects.toThrow(new HttpError(403, "Username already in use"));
  });

  // 3. createUser: hashes password and creates user
  it("3. createUser hashes password and calls repository", async () => {
    repo.getUserByEmail.mockResolvedValue(null);
    repo.getUserByUsername.mockResolvedValue(null);
    (bcryptjs.hash as jest.Mock).mockResolvedValue("hashed_pw");
    repo.createUser.mockResolvedValue(fakeUser as any);

    const result = await service.createUser({
      email: "new@example.com",
      username: "newuser",
      password: "plain_pw",
      confirmPassword: "plain_pw",
    });

    expect(bcryptjs.hash).toHaveBeenCalledWith("plain_pw", 10);
    expect(repo.createUser).toHaveBeenCalledWith(
      expect.objectContaining({ password: "hashed_pw" }),
    );
    expect(result).toEqual(fakeUser);
  });

  // 4. loginUser: throws 404 if user not found
  it("4. loginUser throws 404 if user not found", async () => {
    repo.getUserByEmail.mockResolvedValue(null);

    await expect(
      service.loginUser({ email: "ghost@example.com", password: "pw" }),
    ).rejects.toThrow(new HttpError(404, "User not found"));
  });

  // 5. loginUser: throws 401 on wrong password
  it("5. loginUser throws 401 on invalid password", async () => {
    repo.getUserByEmail.mockResolvedValue(fakeUser as any);
    (bcryptjs.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      service.loginUser({ email: "test@example.com", password: "wrong" }),
    ).rejects.toThrow(new HttpError(401, "Invalid credentials"));
  });

  // 6. loginUser: returns token and user on success
  it("6. loginUser returns token and user on success", async () => {
    repo.getUserByEmail.mockResolvedValue(fakeUser as any);
    (bcryptjs.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("mock_token");

    const result = await service.loginUser({
      email: "test@example.com",
      password: "correct",
    });

    expect(result).toEqual({ token: "mock_token", user: fakeUser });
  });

  // 7. getUserById: throws 404 if user not found
  it("7. getUserById throws 404 if user does not exist", async () => {
    repo.getUserByID.mockResolvedValue(null);

    await expect(service.getUserById("nonexistent")).rejects.toThrow(
      new HttpError(404, "User not found"),
    );
  });

  // 8. deleteUser: throws 404 if user not found
  it("8. deleteUser throws 404 if user does not exist", async () => {
    repo.getUserByID.mockResolvedValue(null);

    await expect(service.deleteUser("nonexistent")).rejects.toThrow(
      new HttpError(404, "User not found"),
    );
  });

  // 9. sendResetPasswordEmail: throws 400 if email missing
  it("9. sendResetPasswordEmail throws 400 if no email provided", async () => {
    await expect(service.sendResetPasswordEmail(undefined)).rejects.toThrow(
      new HttpError(400, "Email is required"),
    );
  });

  // 10. resetPassword: throws 400 on invalid/expired token
  it("10. resetPassword throws 400 on invalid token", async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("jwt expired");
    });

    await expect(service.resetPassword("bad_token", "newpass")).rejects.toThrow(
      new HttpError(400, "Invalid or expired token"),
    );
  });
});
