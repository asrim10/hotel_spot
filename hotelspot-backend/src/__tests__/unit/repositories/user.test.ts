import { UserModel } from "../../../models/user.model";
import mongoose from "mongoose";
import { UserRepository } from "../../../repositories/user.repositories";

describe("User Repository Unit Tests", () => {
  let userRepository: UserRepository;

  const userData = {
    username: "testuser",
    email: "test@example.com",
    password: "Password123!",
    fullName: "Test User",
    role: "user" as const,
  };

  beforeAll(() => {
    userRepository = new UserRepository();
  });

  afterEach(async () => {
    await UserModel.deleteMany({ email: userData.email });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // 1. Create User
  test("should create a new user", async () => {
    const newUser = await userRepository.createUser(userData);
    expect(newUser).toBeDefined();
    expect(newUser.username).toBe(userData.username);
    expect(newUser.email).toBe(userData.email);
  });

  // 2. Get User By Email
  test("should get a user by email", async () => {
    await userRepository.createUser(userData);
    const user = await userRepository.getUserByEmail(userData.email);
    expect(user).toBeDefined();
    expect(user?.email).toBe(userData.email);
  });

  // 3. Get User By Email - Not Found
  test("should return null when getting a user by non-existent email", async () => {
    const user = await userRepository.getUserByEmail("nonexistent@example.com");
    expect(user).toBeNull();
  });

  // 4. Get User By Username
  test("should get a user by username", async () => {
    await userRepository.createUser(userData);
    const user = await userRepository.getUserByUsername(userData.username);
    expect(user).toBeDefined();
    expect(user?.username).toBe(userData.username);
  });

  // 5. Get User By Username - Not Found
  test("should return null when getting a user by non-existent username", async () => {
    const user = await userRepository.getUserByUsername("nonexistentuser");
    expect(user).toBeNull();
  });

  // 6. Get User By ID
  test("should get a user by ID", async () => {
    const newUser = await userRepository.createUser(userData);
    const user = await userRepository.getUserByID(newUser._id.toString());
    expect(user).toBeDefined();
    expect(user?._id.toString()).toBe(newUser._id.toString());
  });

  // 7. Get User By ID - Not Found
  test("should return null when getting a user by non-existent ID", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const user = await userRepository.getUserByID(fakeId);
    expect(user).toBeNull();
  });

  // 8. Get All Users with Pagination
  test("should get all users with pagination", async () => {
    await userRepository.createUser(userData);
    const result = await userRepository.getAllUsers(1, 10);
    expect(result).toBeDefined();
    expect(Array.isArray(result.users)).toBe(true);
    expect(result.total).toBeGreaterThan(0);
  });

  // 9. Update User
  test("should update a user", async () => {
    const newUser = await userRepository.createUser(userData);
    const updatedUser = await userRepository.updateUser(
      newUser._id.toString(),
      { fullName: "Updated User" },
    );
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.fullName).toBe("Updated User");
  });

  // 10. Delete User By ID
  test("should delete a user by ID", async () => {
    const newUser = await userRepository.createUser(userData);
    const result = await userRepository.deleteUserById(newUser._id.toString());
    expect(result).toBe(true);

    // Verify user is deleted
    const deletedUser = await userRepository.getUserByID(
      newUser._id.toString(),
    );
    expect(deletedUser).toBeNull();
  });
});
