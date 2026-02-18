"use client";
import { createContext, ReactNode, useEffect, useState } from "react";
import { ConfirmAction, Income, Toast, UserAuthenticated } from "./AppTypes";
import { useRouter } from "next/navigation";
import { getUserFromToken } from "./AppServices";
import { getIncomes } from "./AppServices";

type AppContextType = {
  toast: Toast;
  setToast: (toast: Toast) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  initialFetching: boolean;
  setInitialFetching: (value: boolean) => void;
  user: UserAuthenticated | undefined;
  setUser: (user: UserAuthenticated | undefined) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen?: (value: boolean) => void;
  localIncomes: Income[];
  setLocalIncomes: (incomes: Income[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  confirmAction: ConfirmAction;
  setConfirmAction: (action: ConfirmAction) => void;
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
  localIncomes: [],
  setLocalIncomes: () => {},
  initialFetching: false,
  setInitialFetching: () => {},
  searchQuery: "",
  setSearchQuery: () => {},
  currentPage: 1,
  setCurrentPage: () => {},
  confirmAction: {
    show: false,
    title: "",
    message: "",
    onConfirm: () => {},
  },
  setConfirmAction: () => {},
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
  const [initialFetching, setInitialFetching] = useState<boolean>(true);
  const [user, setUser] = useState<UserAuthenticated | undefined>(undefined);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [localIncomes, setLocalIncomes] = useState<Income[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>({
    show: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    setInitialFetching(true);
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
        setInitialFetching(false);
      }
    };
    fetchUser();
  }, [router]);

  useEffect(() => {
    if (!user?.id) return;

    const fetchIncomes = async () => {
      setInitialFetching(true);
      try {
        const data = await getIncomes(user.id);
        setLocalIncomes(data.incomes ?? []);
      } catch (error) {
        console.error("Error fetching incomes:", error);
      } finally {
        setInitialFetching(false);
      }
    };

    fetchIncomes();
  }, [user?.id]);

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
        localIncomes,
        setLocalIncomes,
        initialFetching,
        setInitialFetching,
        searchQuery,
        setSearchQuery,
        currentPage,
        setCurrentPage,
        confirmAction,
        setConfirmAction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
