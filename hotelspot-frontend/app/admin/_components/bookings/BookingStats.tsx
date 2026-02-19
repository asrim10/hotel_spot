"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  LogIn,
  LogOut,
} from "lucide-react";

interface StatCard {
  label: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

interface BookingStatsProps {
  stats: {
    totalBookings: number;
    confirmedBookings: number;
    cancelledBookings: number;
    pendingBookings: number;
    checkedInBookings: number;
    checkedOutBookings: number;
  };
  isLoading?: boolean;
}

export function BookingStats({ stats, isLoading }: BookingStatsProps) {
  const statCards: StatCard[] = [
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      icon: <BookOpen className="w-6 h-6" />,
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-600",
    },
    {
      label: "Confirmed",
      value: stats.confirmedBookings,
      icon: <CheckCircle className="w-6 h-6" />,
      bgColor: "bg-green-500/10",
      textColor: "text-green-600",
    },
    {
      label: "Pending",
      value: stats.pendingBookings,
      icon: <Clock className="w-6 h-6" />,
      bgColor: "bg-yellow-500/10",
      textColor: "text-yellow-600",
    },
    {
      label: "Cancelled",
      value: stats.cancelledBookings,
      icon: <XCircle className="w-6 h-6" />,
      bgColor: "bg-red-500/10",
      textColor: "text-red-600",
    },
    {
      label: "Checked In",
      value: stats.checkedInBookings,
      icon: <LogIn className="w-6 h-6" />,
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-600",
    },
    {
      label: "Checked Out",
      value: stats.checkedOutBookings,
      icon: <LogOut className="w-6 h-6" />,
      bgColor: "bg-indigo-500/10",
      textColor: "text-indigo-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className={`${stat.bgColor} rounded-2xl p-6 border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-300 hover:shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.label}
              </p>
              <p className={`text-3xl font-bold mt-2 ${stat.textColor}`}>
                {isLoading ? (
                  <span className="animate-pulse">--</span>
                ) : (
                  stat.value
                )}
              </p>
            </div>
            <div className={`${stat.textColor} opacity-20`}>{stat.icon}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
