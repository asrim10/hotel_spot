"use client";

import { ToastContainer } from "react-toastify";

export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
