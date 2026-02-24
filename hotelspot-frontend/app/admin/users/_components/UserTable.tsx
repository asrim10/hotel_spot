"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { handleDeleteUser } from "@/lib/actions/admin/user-action";
import { Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ConfirmModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div onClick={onClose} className="absolute inset-0 bg-black/85" />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative bg-[#0d0d0d] border border-[#1a1a1a] w-[90%] max-w-sm p-8"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6b7280] hover:text-white transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
        <p className="text-[#c9a96e] text-[9px] tracking-[0.2em] uppercase mb-2">
          Confirm Action
        </p>
        <h3
          className="text-white text-lg font-bold uppercase mb-4"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Delete User
        </h3>
        <p className="text-[#6b7280] text-sm leading-relaxed mb-8">
          Are you sure you want to delete this user? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="border border-[#2a2a2a] text-[#6b7280] text-[11px] tracking-[0.14em] uppercase px-6 py-2.5 hover:text-white hover:border-[#3a3a3a] transition-colors cursor-pointer bg-transparent"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#7f1d1d] border border-[#7f1d1d] text-white text-[11px] font-bold tracking-[0.14em] uppercase px-6 py-2.5 hover:bg-red-800 transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

const UserTable = ({
  users,
  pagination,
  search,
}: {
  users: any[];
  pagination: any;
  search?: string;
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(search || "");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSearchChange = () => {
    router.push(
      `/admin/users?page=1&size=${pagination.size}` +
        (searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""),
    );
  };

  const onDelete = async () => {
    try {
      await handleDeleteUser(deleteId!);
      toast.success("User deleted successfully");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
    } finally {
      setDeleteId(null);
    }
  };

  const makePageHref = (page: number) =>
    `/admin/users?page=${page}&size=${pagination.size}` +
    (searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : "");

  const { page: currentPage, totalPages } = pagination;

  const pageNumbers = () => {
    const range: number[] = [];
    for (
      let i = Math.max(1, currentPage - 2);
      i <= Math.min(totalPages, currentPage + 2);
      i++
    )
      range.push(i);
    return range;
  };

  return (
    <div>
      <div className="flex gap-3 items-center pb-6 border-b border-[#1a1a1a] mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a3a3a]"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearchChange();
            }}
            placeholder="Search users..."
            className="w-full bg-[#111] border border-[#2a2a2a] text-white text-xs pl-9 pr-4 py-2.5 outline-none focus:border-[#c9a96e] transition-colors placeholder:text-[#3a3a3a]"
          />
        </div>
        <button
          onClick={handleSearchChange}
          className="border border-[#2a2a2a] text-[#9ca3af] text-[11px] tracking-[0.14em] uppercase px-5 py-2.5 hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors cursor-pointer bg-transparent mt-4"
        >
          Search
        </button>
      </div>

      <div className="border border-[#1a1a1a] overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#1a1a1a] bg-[#0d0d0d]">
              {["User", "Email", "Role", "Actions"].map((col) => (
                <th
                  key={col}
                  className="px-6 py-4 text-left text-[9px] text-[#3a3a3a] tracking-[0.18em] uppercase font-semibold whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <motion.tr
                key={user._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.03 }}
                className="border-b border-[#111] hover:bg-[#111] transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-[#2a2a2a] shrink-0">
                      {user.imageUrl ? (
                        <img
                          src={
                            process.env.NEXT_PUBLIC_API_BASE_URL + user.imageUrl
                          }
                          alt={user.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-[#c9a96e22] to-[#c9a96e44]">
                          <span className="text-[#c9a96e] text-sm font-bold">
                            {user.fullName?.[0]?.toUpperCase() || "?"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold mb-0.5">
                        {user.fullName}
                      </p>
                      <p className="text-[#4b5563] text-xs">@{user.username}</p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-[#9ca3af] text-xs">
                  {user.email}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`text-[9px] font-semibold tracking-[0.14em] uppercase px-2.5 py-1 border ${user.role === "admin" ? "bg-[#161206] text-[#c9a96e] border-[#c9a96e33]" : "bg-[#0d0d0d] text-[#6b7280] border-[#2a2a2a]"}`}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-5">
                    <Link
                      href={`/admin/users/${user._id}`}
                      className="text-[#60a5fa] text-[11px] tracking-widest uppercase hover:opacity-70 transition-opacity"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/users/${user._id}/edit`}
                      className="text-[#c9a96e] text-[11px]tracking-widest uppercase hover:opacity-70 transition-opacity"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteId(user._id)}
                      className="text-[#f87171] text-[11px] tracking-widest uppercase hover:opacity-70 transition-opacity cursor-pointer bg-transparent border-none p-0"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between pt-5">
        <p className="text-[#3a3a3a] text-[10px] tracking-[0.14em] uppercase">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex items-center gap-1">
          <Link
            href={currentPage === 1 ? "#" : makePageHref(currentPage - 1)}
            className={`flex items-center px-2.5 py-2 border border-[#2a2a2a] transition-colors ${currentPage === 1 ? "text-[#2a2a2a] pointer-events-none" : "text-[#9ca3af] hover:border-[#c9a96e] hover:text-[#c9a96e]"}`}
          >
            <ChevronLeft size={13} />
          </Link>
          {currentPage > 3 && (
            <>
              <Link
                href={makePageHref(1)}
                className="flex items-center justify-center w-8 h-8 border border-[#2a2a2a] text-[#9ca3af] text-xs hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors"
              >
                1
              </Link>
              <span className="text-[#3a3a3a] text-xs px-1">…</span>
            </>
          )}
          {pageNumbers().map((p) => (
            <Link
              key={p}
              href={makePageHref(p)}
              className={`flex items-center justify-center w-8 h-8 border text-xs transition-colors ${p === currentPage ? "border-[#c9a96e] text-[#c9a96e] bg-[#161206] font-bold" : "border-[#2a2a2a] text-[#9ca3af] hover:border-[#c9a96e] hover:text-[#c9a96e]"}`}
            >
              {p}
            </Link>
          ))}
          {currentPage < totalPages - 2 && (
            <>
              <span className="text-[#3a3a3a] text-xs px-1">…</span>
              <Link
                href={makePageHref(totalPages)}
                className="flex items-center justify-center w-8 h-8 border border-[#2a2a2a] text-[#9ca3af] text-xs hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors"
              >
                {totalPages}
              </Link>
            </>
          )}
          <Link
            href={
              currentPage === totalPages ? "#" : makePageHref(currentPage + 1)
            }
            className={`flex items-center px-2.5 py-2 border border-[#2a2a2a] transition-colors ${currentPage === totalPages ? "text-[#2a2a2a] pointer-events-none" : "text-[#9ca3af] hover:border-[#c9a96e] hover:text-[#c9a96e]"}`}
          >
            <ChevronRight size={13} />
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {deleteId && (
          <ConfirmModal
            onClose={() => setDeleteId(null)}
            onConfirm={onDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserTable;
