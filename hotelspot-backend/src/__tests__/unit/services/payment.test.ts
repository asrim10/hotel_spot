import { PaymentService } from "../../../services/payment.service";
import { PaymentRepository } from "../../../repositories/payment.repositories";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("PaymentService", () => {
  let service: PaymentService;

  const fakePayload = {
    bookingId: "booking123",
    totalPrice: 500,
    fullName: "John Doe",
    email: "john@example.com",
  };

  const repo = {
    savePidx: jest.spyOn(PaymentRepository.prototype, "savePidx"),
    confirmPayment: jest.spyOn(PaymentRepository.prototype, "confirmPayment"),
    failPayment: jest.spyOn(PaymentRepository.prototype, "failPayment"),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PaymentService();
  });

  // 1. initiatePayment: calls Khalti with correct payload
  it("1. initiatePayment calls Khalti API with correct payload", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { pidx: "pidx123", payment_url: "https://pay.khalti.com" },
    });
    repo.savePidx.mockResolvedValue(null as any);

    await service.initiatePayment(fakePayload as any);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining("/epayment/initiate/"),
      expect.objectContaining({
        amount: 50000, // 500 * 100
        purchase_order_id: "booking123",
        customer_info: { name: "John Doe", email: "john@example.com" },
      }),
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      }),
    );
  });

  // 2. initiatePayment: converts price to paisa correctly
  it("2. initiatePayment multiplies totalPrice by 100 for paisa", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { pidx: "pidx123", payment_url: "https://pay.khalti.com" },
    });
    repo.savePidx.mockResolvedValue(null as any);

    await service.initiatePayment({ ...fakePayload, totalPrice: 300 } as any);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ amount: 30000 }),
      expect.anything(),
    );
  });

  // 3. initiatePayment: saves pidx to booking
  it("3. initiatePayment saves pidx to the booking", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { pidx: "pidx123", payment_url: "https://pay.khalti.com" },
    });
    repo.savePidx.mockResolvedValue(null as any);

    await service.initiatePayment(fakePayload as any);

    expect(repo.savePidx).toHaveBeenCalledWith("booking123", "pidx123");
  });

  // 4. initiatePayment: returns pidx and payment_url
  it("4. initiatePayment returns pidx and payment_url", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { pidx: "pidx123", payment_url: "https://pay.khalti.com" },
    });
    repo.savePidx.mockResolvedValue(null as any);

    const result = await service.initiatePayment(fakePayload as any);

    expect(result).toEqual({
      pidx: "pidx123",
      payment_url: "https://pay.khalti.com",
    });
  });

  // 5. verifyPayment: confirms payment when status is "Completed"
  it("5. verifyPayment confirms payment when Khalti status is Completed", async () => {
    const fakeBooking = { _id: "booking123", status: "confirmed" };
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        status: "Completed",
        transaction_id: "txn123",
        purchase_order_id: "booking123",
        total_amount: 50000,
      },
    });
    repo.confirmPayment.mockResolvedValue(fakeBooking as any);

    const result = await service.verifyPayment("pidx123");

    expect(repo.confirmPayment).toHaveBeenCalledWith("pidx123", "txn123");
    expect(result).toEqual({
      success: true,
      transactionId: "txn123",
      bookingId: "booking123",
      amount: 500,
      booking: fakeBooking,
    });
  });

  // 6. verifyPayment: status check is case insensitive
  it("6. verifyPayment confirms payment when status is lowercase 'completed'", async () => {
    repo.confirmPayment.mockResolvedValue({} as any);
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        status: "completed",
        transaction_id: "txn123",
        purchase_order_id: "booking123",
        total_amount: 20000,
      },
    });

    const result = await service.verifyPayment("pidx123");

    expect(result.success).toBe(true);
  });

  // 7. verifyPayment: fails payment when status is not completed
  it("7. verifyPayment fails payment when status is Pending", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        status: "Pending",
        transaction_id: null,
        purchase_order_id: "booking123",
        total_amount: 50000,
      },
    });
    repo.failPayment.mockResolvedValue(null as any);

    const result = await service.verifyPayment("pidx123");

    expect(repo.failPayment).toHaveBeenCalledWith("pidx123");
    expect(result).toEqual({ success: false, status: "Pending" });
  });

  // 8. verifyPayment: converts total_amount from paisa to NPR
  it("8. verifyPayment divides total_amount by 100 to convert to NPR", async () => {
    repo.confirmPayment.mockResolvedValue({} as any);
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        status: "Completed",
        transaction_id: "txn123",
        purchase_order_id: "booking123",
        total_amount: 75000,
      },
    });

    const result = await service.verifyPayment("pidx123");

    expect(result.amount).toBe(750);
  });

  // 9. verifyPayment: calls Khalti lookup with correct pidx
  it("9. verifyPayment calls Khalti lookup endpoint with correct pidx", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        status: "Pending",
        transaction_id: null,
        purchase_order_id: "booking123",
        total_amount: 0,
      },
    });
    repo.failPayment.mockResolvedValue(null as any);

    await service.verifyPayment("pidx999");

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining("/epayment/lookup/"),
      { pidx: "pidx999" },
      expect.anything(),
    );
  });

  // 10. verifyPayment: does not call confirmPayment when payment fails
  it("10. verifyPayment does not call confirmPayment when status is not completed", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        status: "Expired",
        transaction_id: null,
        purchase_order_id: "booking123",
        total_amount: 0,
      },
    });
    repo.failPayment.mockResolvedValue(null as any);

    await service.verifyPayment("pidx123");

    expect(repo.confirmPayment).not.toHaveBeenCalled();
  });
});
