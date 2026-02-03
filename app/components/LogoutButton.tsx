import { useContext } from "react";
import AppContext from "../AppContext";
import { IoLogOutOutline } from "react-icons/io5";
import { logoutUser } from "../AppServices";
import { useRouter } from "next/navigation";
import LoadingSpin from "./LoadingSpin";

export default function LogoutButton() {
  const router = useRouter();
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext is not provided");
  }

  const { setIsLoading, setToast, isLoading, setIsSidebarOpen } = context;

  async function handleLogout() {
    setIsLoading(true);
    try {
      const { error } = await logoutUser();
      if (error) {
        console.error("Logout failed:", error);
        setToast({
          message: "Logout failed",
          status: "error",
          show: true,
        });
      } else {
        router.push("/login");
        setIsSidebarOpen?.(false);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`bg-(--color-primary) h-10 w-full rounded-xl cursor-pointer shadow-lg transition duration-200 hover:brightness-115 flex items-center gap-3 justify-center text-sm ${
        isLoading ? "cursor-default opacity-60" : "cursor-pointer"
      }`}
    >
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <>
          <IoLogOutOutline size={20} /> Logout
        </>
      )}
    </button>
  );
}
