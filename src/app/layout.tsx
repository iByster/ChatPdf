import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "react-hot-toast";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChatPDF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <QueryProvider>
        <html lang="en">
          <body className={inter.className}>{children}</body>
          <Toaster />
        </html>
      </QueryProvider>
    </ClerkProvider>
  );
}