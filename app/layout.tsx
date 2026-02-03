import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "./AppContext";
import Toast from "./components/Toast";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finora | Financial Tracker",
  description: "Developed by Patrik Ferreira",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppContextProvider>
          <Sidebar />
          <Navbar />
          {children}
          <Toast />
        </AppContextProvider>
      </body>
    </html>
  );
}
