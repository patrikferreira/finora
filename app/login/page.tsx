"use client";
import React, { useContext, useState } from "react";
import AppContext from "../AppContext";
import Logo from "../components/Logo";
import { useRouter } from "next/navigation";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { validateAuth } from "../utils/formValidators";
import { UserAuthenticated } from "../AppTypes";
import { authUser } from "../AppServices";
import BuiltInfo from "../components/BuiltInfo";
import Button from "../components/Button";

export default function Login() {
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

  return (
    <div className="auth-bg h-svh w-full p-4 flex flex-col gap-6 items-center justify-between animate-fadeIn">
      <div className="relative z-10 w-full flex justify-center pt-2">
        <Logo />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="card-elevated flex flex-col gap-6 p-6 sm:p-8 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]">
          <h1 className="text-xl font-bold">Sign in</h1>
          <form className="flex flex-col gap-4" onSubmit={submit}>
            <label className="block">
              <span className="block font-medium text-xs text-(--muted) mb-2 uppercase tracking-wider">
                Email
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="johndoe@mail.com"
                className="field"
              />
            </label>

            <label className="block relative">
              <span className="block font-medium text-xs text-(--muted) mb-2 uppercase tracking-wider">
                Password
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="field pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-[34px] right-3 text-(--muted) hover:text-(--foreground) transition-colors focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <IoEyeOff size={18} /> : <IoEye size={18} />}
              </button>
            </label>

            <Button
              type="submit"
              isLoading={isLoading}
              text="Sign in"
              className="bg-(--primary) hover:bg-(--primary-hover) text-[#0B0B0E] h-11 rounded-xl font-semibold w-full !min-w-0 mt-2"
            />
          </form>

          <p className="text-center text-sm text-(--muted)">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => router.push("/signup")}
              className="font-medium text-(--primary) hover:underline cursor-pointer"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>

      <div className="relative z-10 w-full flex justify-center pb-2">
        <BuiltInfo />
      </div>
    </div>
  );
}
