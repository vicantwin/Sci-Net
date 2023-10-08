"use client";
import Navbar from "./components/Navbar";
import "./globals.css";
import { AuthContextProvider } from "./firebase/context/AuthContext";
import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthContextProvider>
          <Navbar />
          {children}
          <Toaster theme="system" richColors />
        </AuthContextProvider>
      </body>
    </html>
  );
}
