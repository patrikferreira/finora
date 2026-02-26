import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "./AppContext";
import Toast from "./components/Toast";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import IncomeDetail from "./components/IncomeDetail";
import ConfirmModal from "./components/ConfirmModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finora - Financial Tracker",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased md:flex h-svh`}
      >
        <AppContextProvider>
          <Sidebar />
          <Header />
          {children}
          <Toast />
          <IncomeDetail />
          <ConfirmModal />
        </AppContextProvider>
      </body>
    </html>
  );
}
