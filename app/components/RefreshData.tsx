import { useContext, useEffect, useState } from "react";
import { LuRefreshCcw } from "react-icons/lu";
import AppContext from "../AppContext";
import Spin from "./Spin";
import { getIncomes } from "../AppServices";

type Props = {
  view: string;
};

export default function RefreshData({ view }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext is not provided");
  }

  const { user, setLocalIncomes, refreshData, setRefreshData } = context;

  async function refresh() {
    if (!user?.id) return;
    try {
      setIsLoading(true);
      if (view === "incomes") {
        const data = await getIncomes(user.id);
        setLocalIncomes(data.incomes ?? []);
      } else if (view === "expenses") {
        console.log("expenses");
      } else if (view === "overview") {
        console.log("overview");
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsLoading(false);
      setRefreshData(false);
    }
  }

  useEffect(() => {
    if (refreshData) {
      refresh();
    }
  }, [refreshData]);

  return (
    <button
      disabled={isLoading}
      onClick={refresh}
      className={`h-10 min-w-10 flex items-center justify-center rounded-full border border-(--border-primary) group text-sm bg-(--bg-secondary) group transition duration-200 ${
        isLoading ? "cursor-default" : "cursor-pointer"
      }`}
    >
      {isLoading ? (
        <Spin className="border-t-black/70" />
      ) : (
        <LuRefreshCcw
          className="opacity-50 group-hover:opacity-100 transition-all duration-200"
          size={16}
        />
      )}
    </button>
  );
}
