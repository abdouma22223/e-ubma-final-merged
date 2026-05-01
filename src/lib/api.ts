const BASE = "/api";

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  return fetch(`${BASE}${endpoint}`, options);
}

export async function apiLogin(email: string, password: string) {
  const res = await apiFetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Identifiants invalides");
  return res.json();
}

export async function apiGetDocuments(userId: string) {
  const res = await apiFetch(`/documents?user_id=${userId}`);
  return res.json();
}
