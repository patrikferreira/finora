"use client";
import { useContext } from "react";
import AppContext from "../AppContext";
import LoadingView from "../components/LoadingView";

export default function Expenses() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext is not provided");
  }

  const { user, isLoading } = context;

  if (isLoading)
    return (
      <div className="h-[calc(100svh-4rem)] sm:ml-60">
        <LoadingView />
      </div>
    );

  if (!user) return;

  return (
    <div className="h-[calc(100svh-4rem)] sm:ml-60 flex flex-col animate-fadeIn"></div>
  );
}
