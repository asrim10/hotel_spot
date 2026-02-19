"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { Badge } from "@/app/_components/ui/badge";
import {
  formatDate,
  getStatusColor,
  BOOKING_STATUS,
  PAYMENT_STATUS,
} from "./booking-utils";
import { BookingActions } from "./BookingActions";
import { Skeleton } from "@/app/_components/ui/skeleton";

interface Booking {
  _id: string;
  hotelId: string;
  hotelName?: string;
  fullName: string;
  email: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: string;
  paymentStatus?: string;
  createdAt: string;
  updatedAt?: string;
}

interface BookingTableProps {
  bookings: Booking[];
  isLoading?: boolean;
  onActionComplete?: () => void;
}

export function BookingTable({
  bookings,
  isLoading = false,
  onActionComplete,
}: BookingTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [paymentFilter, setPaymentFilter] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const filteredBookings = useMemo(() => {
    let filtered = [...bookings];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.fullName.toLowerCase().includes(query) ||
          booking.hotelName?.toLowerCase().includes(query) ||
          booking._id.toLowerCase().includes(query) ||
          booking.email.toLowerCase().includes(query),
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    // Payment status filter
    if (paymentFilter) {
      filtered = filtered.filter(
        (booking) => booking.paymentStatus === paymentFilter,
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [bookings, searchQuery, statusFilter, paymentFilter, sortOrder]);

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: BOOKING_STATUS.PENDING, label: "Pending" },
    { value: BOOKING_STATUS.CONFIRMED, label: "Confirmed" },
    { value: BOOKING_STATUS.CANCELLED, label: "Cancelled" },
    { value: "checked_in", label: "Checked In" },
    { value: "checked_out", label: "Checked Out" },
  ];

  const paymentOptions = [
    { value: "", label: "All Payments" },
    { value: PAYMENT_STATUS.PAID, label: "Paid" },
    { value: PAYMENT_STATUS.UNPAID, label: "Unpaid" },
    { value: PAYMENT_STATUS.REFUNDED, label: "Refunded" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, hotel, or booking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            >
              {paymentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value as "newest" | "oldest")
              }
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredBookings.length} of {bookings.length} bookings
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="space-y-4 p-6">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No bookings found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Booking ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Hotel
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Dates
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Booking Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredBookings.map((booking, index) => (
                  <motion.tr
                    key={booking._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                      <code className="text-xs bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                        {booking._id.slice(-8)}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {booking.fullName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {booking.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {booking.hotelId.slice(-8) || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      <div className="flex flex-col gap-1">
                        <span>{formatDate(booking.checkInDate)}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          to {formatDate(booking.checkOutDate)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Rs. {booking.totalPrice}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusColor(booking.status)}>
                        {booking.status?.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={getStatusColor(booking.paymentStatus || "")}
                      >
                        {booking.paymentStatus?.toUpperCase() || "N/A"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(booking.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <BookingActions
                        booking={booking}
                        onActionComplete={onActionComplete}
                      />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
