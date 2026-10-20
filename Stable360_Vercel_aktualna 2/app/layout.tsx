import type { Metadata } from "next";
import CookieNotice from "./CookieNotice";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stable360 — zarządzanie stajnią",
  description: "Wszystko, czego potrzebujesz do sprawnego zarządzania stajnią — w jednym miejscu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl"><body>{children}<CookieNotice /></body></html>
  );
}
