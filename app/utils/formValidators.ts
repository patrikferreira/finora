import { Income, UserAuth, UserRegisterPayload, Expense } from "../AppTypes";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegisterForm(data: UserRegisterPayload): string | null {
  const { name, email, password, confirmPassword } = data;

  if (!name.trim()) {
    return "Name is required";
  }
  if (name.trim().length < 2) {
    return "Name must be at least 2 characters";
  }

  if (!email.trim()) {
    return "Email is required";
  }
  if (!emailRegex.test(email.trim())) {
    return "Email format is invalid";
  }

  if (!password) {
    return "Password is required";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match";
  }

  return null;
}

export function validateAuth(data: UserAuth): string | null {
  const { email, password } = data;

  if (!email.trim()) {
    return "Email is required";
  }

  if (!emailRegex.test(email.trim())) {
    return "Email format is invalid";
  }

  if (!password) {
    return "Password is required";
  }

  return null;
}

export function validateIncomeForm(data: Income): string | null {
  const { description, amount } = data;

  if (!description.trim()) {
    return "Description is required";
  }

  if (amount === null || amount === undefined) {
    return "Amount is required";
  }

  if (isNaN(amount)) {
    return "Amount must be a positive number";
  }

  return null;
}

export function validateExpenseForm(data: Expense): string | null {
  if (!data.description || data.description.trim() === "") {
    return "Description is required";
  }
  if (data.amount === null || data.amount === undefined) {
    return "Amount is required";
  }
  if (!data.category) {
    return "Category is required";
  }
  if (!data.cycle) {
    return "Cycle is required";
  }
  return null;
}
