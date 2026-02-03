"use client";
import React, { useContext, useState } from "react";
import AppContext from "../AppContext";
import Logo from "../components/Logo";
import Copyright from "../components/Copyright";
import { useRouter } from "next/navigation";
import { IoEye, IoEyeOff } from "react-icons/io5";
import LoadingSpin from "../components/LoadingSpin";
import { validateAuth } from "../utiils/formValidators";
import { UserAuthenticated } from "../AppTypes";
import { authUser } from "../AppServices";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext is not provided");
  }
  const { setToast, isLoading, setIsLoading, setUser } = context;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    const error = validateAuth(form);
    if (error) {
      setToast({ message: error, status: "error", show: true });
      return;
    }

    const payload = {
      email: form.email,
      password: form.password,
    };

    setIsLoading(true);

    try {
      const { error, user } = await authUser(payload);
      if (error) {
        setToast({ message: error, status: "error", show: true });
        setIsLoading(false);
        return;
      }
      if (user) {
        if (!user.id) {
          setToast({
            message: "Received invalid user data",
            status: "error",
            show: true,
          });
          setIsLoading(false);
          return;
        }
        setUser(user as UserAuthenticated);
        router.push("/dashboard");
        setIsLoading(false);
      }
    } catch (err) {
      setToast({
        message: "An unexpected error occurred",
        status: "error",
        show: true,
      });
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-(--background) h-svh p-4 flex flex-col justify-between items-center animate-fadeIn">
      <Logo />
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <h1 className="text-xl font-semibold text-center">Login</h1>

        <form className="flex flex-col gap-4" onSubmit={submit}>
          <label className="block">
            <span className="block font-medium text-sm mb-2">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="johndoe@mail.com"
              className="text-sm w-full rounded-xl border border-(--color-border) outline-none px-4 h-10 bg-(--background)"
            />
          </label>

          <label className="block relative">
            <span className="block font-medium text-sm mb-2">Password</span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
              className="text-sm w-full rounded-xl border border-(--color-border) outline-none px-4 h-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-[43px] right-3 text-(--foreground) hover:text-(--foreground) focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <IoEyeOff size={18} /> : <IoEye size={18} />}
            </button>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className={`h-10 text-sm bg-(--color-primary) text-(--color-light) flex items-center justify-center shadow-lg transition duration-200 hover:brightness-115 rounded-xl font-semibold ${
              isLoading ? "cursor-default opacity-60" : "cursor-pointer"
            }`}
          >
            {isLoading ? <LoadingSpin /> : "Login"}
          </button>
        </form>

        <p className="text-center text-(--foreground) text-sm flex items-center gap-2 justify-center">
          Don’t have an account?
          <button
            onClick={() => router.push("/signup")}
            className="font-semibold text-(--color-primary) hover:underline cursor-pointer"
          >
            Click here
          </button>
        </p>
      </div>
      <Copyright />
    </div>
  );
}
