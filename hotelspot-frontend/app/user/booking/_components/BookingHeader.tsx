export default function BookingHeader() {
  return (
    <div className="border-b border-[#1a1a1a] px-12 py-12">
      <p className="text-[#c9a96e] text-[10px] tracking-[0.22em] uppercase mb-3">
        My Account
      </p>
      <h1
        className="text-white text-5xl font-bold uppercase leading-tight m-0"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        Booking History
      </h1>
      <p className="text-[#4b5563] text-sm mt-3">
        View and manage all your hotel bookings
      </p>
    </div>
  );
}
