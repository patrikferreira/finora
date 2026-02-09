import { ApiResponse, User, UserAuth } from "./AppTypes";

/* USERS */
export async function createUser(payload: User): Promise<ApiResponse> {
  try {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to create user");
    }
    return data as ApiResponse;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Internal Server Error",
    };
  }
}

export async function authUser(payload: UserAuth): Promise<ApiResponse> {
  try {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to authenticate user");
    }
    return data as ApiResponse;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Internal Server Error",
    };
  }
}

export async function getUserFromToken() {
  try {
    const res = await fetch("/api/auth", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();

    return json;
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred.",
    };
  }
}

export async function logoutUser(): Promise<ApiResponse> {
  try {
    const res = await fetch("/api/auth", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        error:
          json?.error ?? json?.message ?? res.statusText ?? "Request failed",
        status: res.status,
      };
    }

    return json as ApiResponse;
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred.",
    };
  }
}

/* INCOMES */
export async function getIncomes(userId: string): Promise<ApiResponse> {
  try {
    const res = await fetch(`/api/incomes?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to fetch incomes");
    }
    return data as ApiResponse;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Internal Server Error",
    };
  }
}
