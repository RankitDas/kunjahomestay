import "./globals.css";
import { Inter } from "next/font/google";
import { ReactNode } from "react";

const font = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "Kunja Homestay - Bolpur Shantiniketan",
  description: "Experience the warmth of Bengal at Kunja Homestay. Book your stay at two beautiful locations in Bolpur-Shantiniketan.",
};

export default async function RootLayout({
  children}: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}