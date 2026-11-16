import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "./AppContext";
import Toast from "./components/Toast";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import IncomeDetail from "./components/IncomeDetail";
import ConfirmModal from "./components/ConfirmModal";
import ExpenseDetail from "./components/ExpenseDetail";
import TrialPeriodAlertModal from "./components/DemoPeriodAlertModal";
import ProfileDetail from "./components/ProfileDetail";
import AccountSettingsDetail from "./components/AccountSettingsDetail";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
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
        className={`${sans.variable} ${mono.variable} antialiased md:flex h-svh text-(--foreground)`}
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
