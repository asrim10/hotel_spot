import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import PageTransition from "./(public)/_components/PageTransition";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "hotel_spot",
  description: "Book your dream hotel.",
  icons: "/images/logo.png",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PageTransition>
          <AuthProvider>
            {children}
            <ToastContainer position="top-right" autoClose={3000} />
          </AuthProvider>
        </PageTransition>
      </body>
    </html>
  );
}
