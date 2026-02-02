"use client"; // component must be client when using context
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";

export default function Home() {
  const { user, logout } = useAuth();
  return (
    <div>
      HomePage {user ? `Welcome, ${user.email}` : "Not logged in"}
      <div>{user && <button onClick={logout}>Logout</button>}</div>
    </div>
  );
}
