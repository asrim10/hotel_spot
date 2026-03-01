import { NotificationService } from "../../../services/notification.service";
import { NotificationRepository } from "../../../repositories/notification.repositories";
import { HttpError } from "../../../errors/http-error";

describe("NotificationService", () => {
  let service: NotificationService;

  const fakeNotification = {
    _id: "notif123",
    userId: "user123",
    message: "Your booking is confirmed",
    isRead: false,
  };

  const repo = {
    create: jest.spyOn(NotificationRepository.prototype, "create"),
    getByUserId: jest.spyOn(NotificationRepository.prototype, "getByUserId"),
    getById: jest.spyOn(NotificationRepository.prototype, "getById"),
    getUnreadCount: jest.spyOn(
      NotificationRepository.prototype,
      "getUnreadCount",
    ),
    markAsRead: jest.spyOn(NotificationRepository.prototype, "markAsRead"),
    markAllAsRead: jest.spyOn(
      NotificationRepository.prototype,
      "markAllAsRead",
    ),
    delete: jest.spyOn(NotificationRepository.prototype, "delete"),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new NotificationService();
  });

  // 1. createNotification: creates and returns a notification
  it("1. createNotification returns the new notification", async () => {
    repo.create.mockResolvedValue(fakeNotification as any);

    const result = await service.createNotification({
      userId: "user123",
      message: "Your booking is confirmed",
    } as any);

    expect(repo.create).toHaveBeenCalledTimes(1);
    expect(result).toEqual(fakeNotification);
  });

  // 2. getNotificationsByUserId: returns notifications for a user
  it("2. getNotificationsByUserId returns notifications for the given user", async () => {
    repo.getByUserId.mockResolvedValue([fakeNotification] as any);

    const result = await service.getNotificationsByUserId("user123");

    expect(result).toEqual([fakeNotification]);
    expect(repo.getByUserId).toHaveBeenCalledWith("user123");
  });

  // 3. getNotificationsByUserId: returns empty array when none exist
  it("3. getNotificationsByUserId returns empty array when user has no notifications", async () => {
    repo.getByUserId.mockResolvedValue([]);

    const result = await service.getNotificationsByUserId("user123");

    expect(result).toEqual([]);
  });

  // 4. getNotificationById: returns notification when found
  it("4. getNotificationById returns notification when found", async () => {
    repo.getById.mockResolvedValue(fakeNotification as any);

    const result = await service.getNotificationById("notif123");

    expect(result).toEqual(fakeNotification);
    expect(repo.getById).toHaveBeenCalledWith("notif123");
  });

  // 5. getNotificationById: throws 404 when not found
  it("5. getNotificationById throws 404 when notification not found", async () => {
    repo.getById.mockResolvedValue(null);

    await expect(service.getNotificationById("nonexistent")).rejects.toThrow(
      new HttpError(404, "Notification not found"),
    );
  });

  // 6. getUnreadCount: returns unread count for a user
  it("6. getUnreadCount returns the unread notification count", async () => {
    repo.getUnreadCount.mockResolvedValue(5 as any);

    const result = await service.getUnreadCount("user123");

    expect(result).toBe(5);
    expect(repo.getUnreadCount).toHaveBeenCalledWith("user123");
  });

  // 7. markAsRead: throws 404 when notification not found
  it("7. markAsRead throws 404 when notification not found", async () => {
    repo.getById.mockResolvedValue(null);

    await expect(service.markAsRead("nonexistent")).rejects.toThrow(
      new HttpError(404, "Notification not found"),
    );
  });

  // 8. markAsRead: marks notification as read and returns updated
  it("8. markAsRead returns updated notification when found", async () => {
    const updated = { ...fakeNotification, isRead: true };
    repo.getById.mockResolvedValue(fakeNotification as any);
    repo.markAsRead.mockResolvedValue(updated as any);

    const result = await service.markAsRead("notif123");

    expect(repo.markAsRead).toHaveBeenCalledWith("notif123");
    expect(result).toEqual(updated);
  });

  // 9. markAllAsRead: calls repository with correct userId
  it("9. markAllAsRead calls repository to mark all notifications as read", async () => {
    repo.markAllAsRead.mockResolvedValue(null as any);

    await service.markAllAsRead("user123");

    expect(repo.markAllAsRead).toHaveBeenCalledWith("user123");
    expect(repo.markAllAsRead).toHaveBeenCalledTimes(1);
  });

  // 10. deleteNotification: throws 404 when notification not found
  it("10. deleteNotification throws 404 when notification not found", async () => {
    repo.getById.mockResolvedValue(null);

    await expect(service.deleteNotification("nonexistent")).rejects.toThrow(
      new HttpError(404, "Notification not found"),
    );
  });

  // 11. deleteNotification: deletes and returns result when found
  it("11. deleteNotification deletes and returns result when found", async () => {
    repo.getById.mockResolvedValue(fakeNotification as any);
    repo.delete.mockResolvedValue(true as any);

    const result = await service.deleteNotification("notif123");

    expect(repo.delete).toHaveBeenCalledWith("notif123");
    expect(result).toBe(true);
  });
});
