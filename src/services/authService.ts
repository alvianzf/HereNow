import { API_URL } from "../lib/api";
import { User } from "../types/user";

export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  const res = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Login failed");
  }

  const data = await res.json();
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    role: data.role,
    department: data.department,
    position: data.position,
  };
};
