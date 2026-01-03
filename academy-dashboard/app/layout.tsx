import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Architect Academy",
  description: "Master AI architecture through adaptive, gamified learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 min-h-screen">
        {children}
      </body>
    </html>
  );
}
