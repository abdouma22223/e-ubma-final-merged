/**
 * API Service Layer — connects to the local FastAPI backend.
 */

const BASE = "http://localhost:8001/api";

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  return fetch(`${BASE}${endpoint}`, options);
}

export async function apiLogin(email: string, password: string) {
  const res = await apiFetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Login failed" }));
    throw new Error(err.detail || "Login failed");
  }
  return res.json();
}

export async function apiChat(message: string, userId: string = "anonymous") {
  const res = await apiFetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, user_id: userId }),
  });
  if (!res.ok) throw new Error("Chat failed");
  return res.json();
}

// ... other original functions if needed
