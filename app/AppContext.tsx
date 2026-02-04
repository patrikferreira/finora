"use client";
import { createContext, ReactNode, useEffect, useState } from "react";
import { Toast, UserAuthenticated } from "./AppTypes";
import { useRouter } from "next/navigation";
import { getUserFromToken } from "./AppServices";

type AppContextType = {
  toast: Toast;
  setToast: (toast: Toast) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  user: UserAuthenticated | undefined;
  setUser: (user: UserAuthenticated | undefined) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen?: (value: boolean) => void;
};

const AppContext = createContext<AppContextType>({
  toast: { message: "", status: "info", show: false },
  setToast: () => {},
  isLoading: false,
  setIsLoading: () => {},
  user: undefined,
  setUser: () => {},
  isSidebarOpen: false,
  setIsSidebarOpen: () => {},
});

export default AppContext;

export function AppContextProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [toast, setToast] = useState<Toast>({
    message: "",
    status: "info",
    show: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<UserAuthenticated | undefined>(undefined);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchUser = async () => {
      try {
        const data = await getUserFromToken();
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(undefined);
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(undefined);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  useEffect(() => {
    if (user) {
      /* get data here */
      console.log(`user updated: ${user.email}`);
      setIsLoading(true);
      setTimeout(() => {
        /* simulate call */
        setIsLoading(false);
      }, 5000);
    }
  }, [user]);

  return (
    <AppContext.Provider
      value={{
        toast,
        setToast,
        isLoading,
        setIsLoading,
        user,
        setUser,
        isSidebarOpen,
        setIsSidebarOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
