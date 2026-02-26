export const bookingStatusEmail = (
  fullName: string,
  status: string,
  booking: {
    hotelId: any;
    checkInDate: string;
    checkOutDate: string;
    totalPrice: number;
  },
) => {
  const statusMessages: Record<
    string,
    { subject: string; message: string; color: string }
  > = {
    confirmed: {
      subject: "✅ Your Booking has been Confirmed!",
      message:
        "Great news! Your booking has been confirmed. We look forward to welcoming you.",
      color: "#22c55e",
    },
    cancelled: {
      subject: "❌ Your Booking has been Cancelled",
      message:
        "Your booking has been cancelled. If you have any questions, please contact us.",
      color: "#ef4444",
    },
    checked_in: {
      subject: "🏨 Welcome! You're Checked In",
      message: "You have been successfully checked in. Enjoy your stay!",
      color: "#3b82f6",
    },
    checked_out: {
      subject: "👋 Thank you for your Stay!",
      message:
        "You have been checked out. We hope you enjoyed your stay and look forward to seeing you again!",
      color: "#8b5cf6",
    },
    pending: {
      subject: "⏳ Your Booking is Pending",
      message:
        "Your booking is currently pending review. You will be notified once it's confirmed.",
      color: "#f59e0b",
    },
  };

  const statusInfo = statusMessages[status] || {
    subject: "Booking Status Update",
    message: `Your booking status has been updated to: ${status}`,
    color: "#6b7280",
  };

  const hotelName =
    typeof booking.hotelId === "object"
      ? booking.hotelId?.name || "Our Hotel"
      : "Our Hotel";

  return {
    subject: statusInfo.subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h1 style="color: ${statusInfo.color}; margin-bottom: 8px;">${statusInfo.subject}</h1>
          <p style="color: #374151; font-size: 16px;">Dear <strong>${fullName}</strong>,</p>
          <p style="color: #374151;">${statusInfo.message}</p>

          <div style="background-color: #f3f4f6; border-radius: 6px; padding: 16px; margin: 20px 0;">
            <h3 style="color: #111827; margin-top: 0;">Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #6b7280;">Hotel:</td>
                <td style="padding: 6px 0; color: #111827; font-weight: bold;">${hotelName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6b7280;">Check-in:</td>
                <td style="padding: 6px 0; color: #111827;">${new Date(booking.checkInDate).toDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6b7280;">Check-out:</td>
                <td style="padding: 6px 0; color: #111827;">${new Date(booking.checkOutDate).toDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6b7280;">Total Price:</td>
                <td style="padding: 6px 0; color: #111827; font-weight: bold;">Rs.${booking.totalPrice}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6b7280;">Status:</td>
                <td style="padding: 6px 0;">
                  <span style="background-color: ${statusInfo.color}; color: white; padding: 2px 10px; border-radius: 999px; font-size: 13px; text-transform: capitalize;">
                    ${status.replace("_", " ")}
                  </span>
                </td>
              </tr>
            </table>
          </div>

          <p style="color: #6b7280; font-size: 14px;">If you have any questions, feel free to reply to this email.</p>
          <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">— Hotel Spot Team</p>
        </div>
      </div>
    `,
  };
};
