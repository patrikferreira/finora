"use client";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
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
      router.push("/login");
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

  return (
    <div className="auth-bg min-h-svh w-full p-4 flex flex-col gap-6 items-center justify-between animate-fadeIn">
      <div className="relative z-10 w-full flex justify-center pt-2">
        <Logo />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="card-elevated flex flex-col gap-6 p-6 sm:p-8 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]">
          <h1 className="text-xl font-bold">Sign up</h1>
          <form className="flex flex-col gap-4" onSubmit={submit}>
            <label className="block">
              <span className="block font-medium text-xs text-(--muted) mb-2 uppercase tracking-wider">
                Full name
              </span>
              <input
                type="text"
                name="name"
                maxLength={50}
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="field"
              />
            </label>

            <label className="block">
              <span className="block font-medium text-xs text-(--muted) mb-2 uppercase tracking-wider">
                Email
              </span>
              <input
                type="email"
                name="email"
                maxLength={50}
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
                maxLength={20}
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

            <label className="block relative">
              <span className="block font-medium text-xs text-(--muted) mb-2 uppercase tracking-wider">
                Confirm password
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                maxLength={20}
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                className="field pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute top-[34px] right-3 text-(--muted) hover:text-(--foreground) transition-colors focus:outline-none"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <IoEyeOff size={18} />
                ) : (
                  <IoEye size={18} />
                )}
              </button>
            </label>

            <Button
              type="submit"
              isLoading={isLoading}
              text="Create account"
              className="bg-(--primary) hover:bg-(--primary-hover) text-[#0B0B0E] h-11 rounded-xl font-semibold w-full !min-w-0 mt-2"
            />
          </form>

          <p className="text-center text-sm text-(--muted)">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="font-medium text-(--primary) hover:underline cursor-pointer"
            >
              Sign in
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
