/**
 * API Service Layer — connects to the BIG FastAPI backend.
 */
const BASE = "/api";

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  return fetch(`${BASE}${endpoint}`, options);
}

// ─── Auth ───────────────────────────────────────────────
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

// ─── Chat (Groq AI) ────────────────────────────────────
export async function apiChat(
  message: string,
  userId: string = "anonymous",
  context?: Record<string, unknown>,
) {
  const res = await apiFetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, user_id: userId, context }),
  });
  if (!res.ok) throw new Error("Chat request failed");
  return res.json();
}

// ─── Documents ──────────────────────────────────────────
export async function apiGetDocuments(userId: string) {
  const res = await apiFetch(`/documents?user_id=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json();
}

export async function apiUploadDocument(userId: string, file: File) {
  const form = new FormData();
  form.append("file", file);
  const res = await apiFetch(`/documents/upload?user_id=${userId}`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

export async function apiDownloadDocument(docId: string, userId: string): Promise<Blob> {
  const res = await apiFetch(`/documents/download/${docId}?user_id=${userId}`);
  if (!res.ok) throw new Error("Download failed");
  return res.blob();
}

export async function apiShareDocument(docId: string, expiresIn = 24) {
  const res = await apiFetch(`/documents/share/${docId}?expires_in=${expiresIn}`);
  if (!res.ok) throw new Error("Share link generation failed");
  return res.json();
}

export async function apiVerifyDocument(fileHash: string) {
  const res = await apiFetch(`/documents/verify/${fileHash}`);
  if (!res.ok) throw new Error("Verification failed");
  return res.json();
}

// ─── Requests ───────────────────────────────────────────
export async function apiGetRequests(userId: string, role: string) {
  const res = await apiFetch(`/requests?user_id=${userId}&role=${role}`);
  if (!res.ok) throw new Error("Failed to fetch requests");
  return res.json();
}
