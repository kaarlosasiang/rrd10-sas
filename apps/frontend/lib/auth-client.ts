import { createAuthClient } from "better-auth/client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:4000/api/v1";

const AUTH_BASE_URL = `${API_BASE_URL}/auth`;

export const authClient = createAuthClient({
  baseURL: AUTH_BASE_URL,
});

