import { NotificationModel } from "../../../models/notification.model";
import { UserModel } from "../../../models/user.model";
import mongoose from "mongoose";
import { NotificationRepository } from "../../../repositories/notification.repositories";

describe("Notification Repository Unit Tests", () => {
  let notificationRepository: NotificationRepository;
  let testUserId: string;

  beforeAll(async () => {
    notificationRepository = new NotificationRepository();

    const user = await UserModel.create({
      username: "notifuser",
      email: "notifuser@example.com",
      password: "Password123!",
      fullName: "Notif User",
      role: "user" as const,
    });
    testUserId = user._id.toString();
  });

  afterEach(async () => {
    await NotificationModel.deleteMany({ userId: testUserId });
  });

  afterAll(async () => {
    await UserModel.deleteMany({ email: "notifuser@example.com" });
    await mongoose.connection.close();
  });

  const getNotificationData = (overrides = {}) => ({
    userId: testUserId,
    title: "Test Notification",
    message: "This is a test notification",
    type: "general",
    isRead: false,
    ...overrides,
  });

  // 1. Create Notification
  test("should create a new notification", async () => {
    const newNotif = await notificationRepository.create(getNotificationData());
    expect(newNotif).toBeDefined();
    expect(newNotif.title).toBe("Test Notification");
    expect(newNotif.isRead).toBe(false);
  });

  // 2. Get Notification By ID
  test("should get a notification by ID", async () => {
    const newNotif = await notificationRepository.create(getNotificationData());
    const found = await notificationRepository.getById(newNotif._id.toString());
    expect(found).toBeDefined();
    expect(found?._id.toString()).toBe(newNotif._id.toString());
  });

  // 3. Get Notification By ID - Not Found
  test("should return null when getting a notification by non-existent ID", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const found = await notificationRepository.getById(fakeId);
    expect(found).toBeNull();
  });

  // 4. Get Notifications By User ID
  test("should get all notifications by user ID", async () => {
    await notificationRepository.create(getNotificationData());
    await notificationRepository.create(
      getNotificationData({ title: "Second Notification" }),
    );
    const notifications = await notificationRepository.getByUserId(testUserId);
    expect(Array.isArray(notifications)).toBe(true);
    expect(notifications.length).toBe(2);
  });

  // 5. Get Unread Count
  test("should get unread notification count for a user", async () => {
    await notificationRepository.create(getNotificationData());
    await notificationRepository.create(getNotificationData({ isRead: true }));
    const count = await notificationRepository.getUnreadCount(testUserId);
    expect(count).toBe(1);
  });

  // 6. Mark As Read
  test("should mark a notification as read", async () => {
    const newNotif = await notificationRepository.create(getNotificationData());
    expect(newNotif.isRead).toBe(false);
    const updated = await notificationRepository.markAsRead(
      newNotif._id.toString(),
    );
    expect(updated).toBeDefined();
    expect(updated?.isRead).toBe(true);
  });

  // 7. Mark All As Read
  test("should mark all notifications as read for a user", async () => {
    await notificationRepository.create(getNotificationData());
    await notificationRepository.create(getNotificationData());
    await notificationRepository.markAllAsRead(testUserId);
    const unreadCount = await notificationRepository.getUnreadCount(testUserId);
    expect(unreadCount).toBe(0);
  });

  // 8. Get All Notifications
  test("should get all notifications", async () => {
    await notificationRepository.create(getNotificationData());
    const notifications = await notificationRepository.getAll();
    expect(Array.isArray(notifications)).toBe(true);
    expect(notifications.length).toBeGreaterThan(0);
  });

  // 9. Delete Notification By ID
  test("should delete a notification by ID", async () => {
    const newNotif = await notificationRepository.create(getNotificationData());
    const result = await notificationRepository.delete(newNotif._id.toString());
    expect(result).toBe(true);

    // Verify notification is deleted
    const deleted = await notificationRepository.getById(
      newNotif._id.toString(),
    );
    expect(deleted).toBeNull();
  });

  // 10. Delete All Notifications By User ID
  test("should delete all notifications by user ID", async () => {
    await notificationRepository.create(getNotificationData());
    await notificationRepository.create(getNotificationData());
    await notificationRepository.deleteAllByUserId(testUserId);
    const notifications = await notificationRepository.getByUserId(testUserId);
    expect(notifications.length).toBe(0);
  });
});
