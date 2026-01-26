"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Copyright from "../components/Copyright";
import { IoEye, IoEyeOff } from "react-icons/io5";
import LoadingSpin from "../components/LoadingSpin";
import Logo from "../components/Logo";

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Remove when context is implemented

  function formatName(raw: string) {
    return raw
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }

  return (
    <div className="bg-(--background) h-svh p-4 flex flex-col justify-between items-center animate-fadeIn">
      <Logo />
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <h1 className="text-xl font-semibold text-center">Sign up</h1>
        <form className="flex flex-col gap-4" onSubmit={submit}>
          <label className="block">
            <span className="block font-medium mb-2">Full name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full rounded-xl border border-(--color-border) outline-none px-4 h-10"
            />
          </label>

          <label className="block">
            <span className="block font-medium mb-2">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@mail.com"
              className="w-full rounded-xl border border-(--color-border) outline-none px-4 h-10"
            />
          </label>

          <label className="block relative">
            <span className="block font-medium mb-2">Password</span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
              className="w-full rounded-xl border border-(--color-border) outline-none px-4 h-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-[38px] right-3 text-(--foreground) hover:text-(--foreground) focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <IoEyeOff size={18} /> : <IoEye size={18} />}
            </button>
          </label>

          <label className="block relative">
            <span className="block font-medium mb-2">Confirm password</span>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="********"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-xl border border-(--color-border) outline-none px-4 h-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute top-[38px] right-3 text-(--foreground) hover:text-(--foreground) focus:outline-none"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <IoEyeOff size={18} />
              ) : (
                <IoEye size={18} />
              )}
            </button>
          </label>

          <button
            disabled={isLoading}
            className={`h-10 bg-(--color-primary) text-(--color-light) flex items-center justify-center transition duration-200 hover:brightness-135 rounded-xl ${
              isLoading ? "cursor-default" : "cursor-pointer"
            }`}
          >
            {isLoading ? <LoadingSpin /> : "Create account"}
          </button>
        </form>

        <p className="text-center text-(--foreground) flex items-center gap-2 justify-center">
          Already have an account?
          <button
            onClick={() => {
              router.push("/");
            }}
            className="font-semibold text-(--color-primary) hover:underline cursor-pointer"
          >
            Login here
          </button>
        </p>
      </div>
      <Copyright />
    </div>
  );
}
