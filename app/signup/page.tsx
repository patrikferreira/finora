"use client";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Logo from "../components/Logo";
import AppContext from "../AppContext";
import { validateRegisterForm } from "../utils/formValidators";
import { createUser } from "../AppServices";
import bcrypt from "bcryptjs";
import BuiltInfo from "../components/BuiltInfo";
import Button from "../components/Button";

export default function Signup() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext is not provided");
  }

  const { setToast } = context;

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

    const error = validateRegisterForm(form);
    if (error) {
      setToast({ message: error, status: "error", show: true });
      return;
    }

    const hashed = await bcrypt.hash(form.password, 10);

    const payload = {
      name: formatName(form.name),
      email: form.email,
      password: hashed,
      confirmPassword: hashed,
      clientHashed: true,
    };

    setIsLoading(true);

    try {
      const { error } = await createUser(payload);
      if (error) {
        setToast({ message: error, status: "error", show: true });
        return;
      }
      setToast({
        message: "Account created successfully",
        status: "success",
        show: true,
      });
      router.push("/signin");
    } catch (err) {
      console.error("Registration error:", err);
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
              Create your account
            </h1>
            <p className="text-sm leading-5 text-(--muted)">
              Start tracking income and expenses in one place.
            </p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={submit}>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className={labelClass}>
                Full name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                autoComplete="name"
                maxLength={50}
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                maxLength={50}
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
                  autoComplete="new-password"
                  maxLength={20}
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

            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className={labelClass}>
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  autoComplete="new-password"
                  maxLength={20}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  className="absolute inset-y-0 right-3 flex items-center text-(--muted) hover:text-(--foreground) transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff size={16} />
                  ) : (
                    <FiEye size={16} />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              text="Create account"
              className="w-full !min-w-0"
            />
          </form>

          <p className="text-center text-sm text-(--muted)">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/signin")}
              className="font-semibold text-(--primary) hover:underline cursor-pointer"
            >
              Sign in
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
