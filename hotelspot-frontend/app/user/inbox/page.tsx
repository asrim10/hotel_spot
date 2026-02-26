"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Check, CheckCheck, Trash2, Calendar } from "lucide-react";
import {
  handleGetNotifications,
  handleMarkAsRead,
  handleMarkAllAsRead,
  handleDeleteNotification,
} from "@/lib/actions/notification-action";
import { toast } from "react-toastify";

const TYPE_STYLES: Record<string, { color: string; bg: string }> = {
  booking_confirmed: { color: "text-[#4ade80]", bg: "bg-[#0a1f0a]" },
  booking_cancelled: { color: "text-[#f87171]", bg: "bg-[#1f0a0a]" },
  checked_in: { color: "text-[#a78bfa]", bg: "bg-[#130a1f]" },
  checked_out: { color: "text-[#60a5fa]", bg: "bg-[#0a0f1f]" },
  booking_pending: { color: "text-[#facc15]", bg: "bg-[#1f1a0a]" },
  general: { color: "text-[#c9a96e]", bg: "bg-[#1a1206]" },
};

export default function InboxPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    const res = await handleGetNotifications();
    if (res?.success) setNotifications(res.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRead = async (id: string) => {
    const res = await handleMarkAsRead(id);
    if (res?.success) {
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
    }
  };

  const handleReadAll = async () => {
    const res = await handleMarkAllAsRead();
    if (res?.success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All marked as read");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await handleDeleteNotification(id);
    if (res?.success) {
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } else {
      toast.error(res?.message || "Failed to delete");
    }
  };

  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-white"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      {/* HEADER */}
      <div className="border-b border-[#1a1a1a] px-12 py-10">
        <p className="text-[#c9a96e] text-[10px] tracking-[0.22em] uppercase mb-3">
          Notifications
        </p>
        <div className="flex items-end justify-between">
          <h1 className="text-white text-5xl font-bold uppercase m-0">Inbox</h1>
          <div className="flex items-center gap-3">
            {unread > 0 && (
              <span className="bg-[#c9a96e] text-[#0a0a0a] text-[10px] font-bold px-3 py-1">
                {unread} unread
              </span>
            )}
            {unread > 0 && (
              <button
                onClick={handleReadAll}
                className="flex items-center gap-2 border border-[#2a2a2a] text-[#6b7280] text-[10px] tracking-[0.14em] uppercase px-5 py-2.5 bg-transparent cursor-pointer hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors"
              >
                <CheckCheck size={13} /> Mark All Read
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-12 py-10">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-[#0d0d0d] border border-[#1a1a1a] animate-pulse"
              />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-32 text-center border-t border-[#1a1a1a]">
            <Bell size={32} className="text-[#2a2a2a] mx-auto mb-4" />
            <p className="text-[#c9a96e] text-[9px] tracking-[0.2em] uppercase mb-3">
              All Clear
            </p>
            <h2 className="text-white text-3xl font-bold uppercase mb-2">
              No Notifications
            </h2>
            <p className="text-[#4b5563] text-sm">
              You're all caught up! Notifications will appear here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-px bg-[#1a1a1a]">
            {notifications.map((n, i) => {
              const style = TYPE_STYLES[n.type] || TYPE_STYLES.general;
              return (
                <motion.div
                  key={n._id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`flex items-start gap-5 p-6 transition-colors ${
                    n.isRead ? "bg-[#0a0a0a]" : "bg-[#0d0d0d]"
                  }`}
                >
                  {/* unread dot */}
                  <div className="mt-2 shrink-0">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        n.isRead ? "bg-[#2a2a2a]" : "bg-[#c9a96e]"
                      }`}
                    />
                  </div>

                  {/* icon */}
                  <div className={`${style.bg} p-2.5 shrink-0`}>
                    <Bell size={14} className={style.color} />
                  </div>

                  {/* content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p
                          className={`text-sm font-bold m-0 mb-1 ${
                            n.isRead ? "text-[#6b7280]" : "text-white"
                          }`}
                        >
                          {n.title}
                        </p>
                        <p className="text-[#6b7280] text-sm leading-relaxed m-0">
                          {n.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {!n.isRead && (
                          <button
                            onClick={() => handleRead(n._id)}
                            title="Mark as read"
                            className="text-[#3a3a3a] hover:text-[#4ade80] bg-transparent border-none cursor-pointer transition-colors p-1"
                          >
                            <Check size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(n._id)}
                          title="Delete"
                          className="text-[#3a3a3a] hover:text-[#f87171] bg-transparent border-none cursor-pointer transition-colors p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <Calendar size={10} className="text-[#3a3a3a]" />
                      <span className="text-[#3a3a3a] text-[10px]">
                        {new Date(n.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {!n.isRead && (
                        <span className="text-[#c9a96e] text-[9px] tracking-[0.14em] uppercase">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
