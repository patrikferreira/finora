import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "./AppContext";
import Toast from "./components/Toast";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import IncomeDetail from "./components/IncomeDetail";
import ConfirmModal from "./components/ConfirmModal";
import ExpenseDetail from "./components/ExpenseDetail";
import TrialPeriodAlertModal from "./components/TrialPeriodAlertModal";
import ProfileDetail from "./components/ProfileDetail";
import AccountSettingsDetail from "./components/AccountSettingsDetail";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased md:flex h-svh bg-(--bg-primary) text-(--foreground)`}
      >
        <AppContextProvider>
          <Sidebar />
          <Header />
          {children}
          <Toast />
          <IncomeDetail />
          <ExpenseDetail />
          <ConfirmModal />
          <TrialPeriodAlertModal />
          <ProfileDetail />
          <AccountSettingsDetail />
        </AppContextProvider>
      </body>
    </html>
  );
}
