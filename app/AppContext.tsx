"use client";
import { createContext, ReactNode, useState } from "react";
import { Toast } from "./AppTypes";

type AppContextType = {
  toast: Toast;
  setToast: (toast: Toast) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
};

const AppContext = createContext<AppContextType>({
  toast: { message: "", status: "info", show: false },
  setToast: () => {},
  isLoading: false,
  setIsLoading: () => {},
});

export default AppContext;

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast>({
    message: "",
    status: "info",
    show: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <AppContext.Provider value={{ toast, setToast, isLoading, setIsLoading }}>
      {children}
    </AppContext.Provider>
  );
}
