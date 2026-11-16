"use client";
import React, { useContext, useState } from "react";
import AppContext from "../AppContext";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Logo from "../components/Logo";
import BuiltInfo from "../components/BuiltInfo";
import Button from "../components/Button";
import { validateAuth } from "../utils/formValidators";
import { UserAuthenticated } from "../AppTypes";
import { authUser } from "../AppServices";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
  const { setToast, setUser } = context;

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
        router.push("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setToast({
        message: err instanceof Error ? err.message : "An error occurred",
        status: "error",
        show: true,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const inputClass =
    "h-[42px] w-full rounded-lg border border-(--border) bg-(--bg-secondary) px-3 text-sm text-(--foreground) placeholder:text-(--placeholder) outline-none transition focus:border-(--primary) focus:shadow-[0_0_0_4px_var(--primary-soft)]";
  const labelClass = "text-xs font-semibold text-(--foreground)";

  return (
    <div className="h-svh w-full flex flex-col text-(--foreground) animate-fadeIn">
      <header className="px-8 pt-6">
        <Logo />
      </header>

      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-[380px] surface p-6 md:p-7 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-[28px] leading-8 font-extrabold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm leading-5 text-(--muted)">
              Sign in to your account to track income and expenses.
            </p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={submit}>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-3 flex items-center text-(--muted) hover:text-(--foreground) transition-colors cursor-pointer"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              text="Sign in"
              className="w-full !min-w-0"
            />
          </form>

          <p className="text-center text-sm text-(--muted)">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="font-semibold text-(--primary) hover:underline cursor-pointer"
            >
              Sign up
            </button>
          </p>
        </div>
      </main>

      <div className="w-full flex justify-center px-8 pb-6">
        <BuiltInfo />
      </div>
    </div>
  );
}
