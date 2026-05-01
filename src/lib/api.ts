/**
 * API Service Layer — connects to the BIG FastAPI backend.
 * In dev, Vite proxies /api/* → http://localhost:8001
 */

// In production (Vercel), we point to the Render backend URL.
// Replace 'your-backend-url.onrender.com' with your actual Render URL later.
const BASE = import.meta.env.VITE_API_URL || "https://e-ubma-backend.onrender.com/api";


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
  return res.json() as Promise<{
    message: string;
    user_id: string;
    first_name: string;
    role: string;
    major: string;
  }>;
}

export async function apiRegister(data: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  major: string;
}) {
  const res = await apiFetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Registration failed" }));
    throw new Error(err.detail || "Registration failed");
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
  return res.json() as Promise<{
    reply: string;
    intent_detected?: { intent: string; destination?: string; fields?: Record<string, string> };
  }>;
}

// ─── Crypto ─────────────────────────────────────────────
export async function apiEncrypt(file: File | Blob): Promise<Blob> {
  const form = new FormData();
  form.append("file", file);
  const res = await apiFetch("/crypto/encrypt", { method: "POST", body: form });
  if (!res.ok) throw new Error("Encryption failed");
  return res.blob();
}

export async function apiDecrypt(encryptedBlob: Blob): Promise<Blob> {
  const form = new FormData();
  form.append("file", encryptedBlob, "file.enc");
  const res = await apiFetch("/crypto/decrypt", { method: "POST", body: form });
  if (!res.ok) throw new Error("Decryption failed");
  return res.blob();
}

// ─── Documents ──────────────────────────────────────────
export async function apiGetDocuments(userId: string) {
  const res = await apiFetch(`/documents?user_id=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json() as Promise<{ id: string; filename: string; hash: string; status: string }[]>;
}

export async function apiUpdateDocumentStatus(docId: string, status: string, userId: string) {
  const res = await apiFetch(`/documents/${docId}/status?user_id=${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update status");
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
  return res.json() as Promise<{
    message: string;
    document_id: string;
    qr_verification_url: string;
  }>;
}

export async function apiDownloadDocument(docId: string, userId: string): Promise<Blob> {
  const res = await apiFetch(`/documents/download/${docId}?user_id=${userId}`);
  if (!res.ok) throw new Error("Download failed");
  return res.blob();
}

export async function apiShareDocument(docId: string, expiresIn = 24) {
  const res = await apiFetch(`/documents/share/${docId}?expires_in=${expiresIn}`);
  if (!res.ok) throw new Error("Share link generation failed");
  return res.json() as Promise<{ temporary_link: string }>;
}

export async function apiVerifyDocument(fileHash: string) {
  const res = await apiFetch(`/documents/verify/${fileHash}`);
  if (!res.ok) throw new Error("Verification failed");
  return res.json() as Promise<{
    status: string;
    message: string;
    filename?: string;
    owner?: string;
    major?: string;
  }>;
}

// ─── Requests ───────────────────────────────────────────
export async function apiGetRequests(userId: string, role: string) {
  const res = await apiFetch(`/requests?user_id=${userId}&role=${role}`);
  if (!res.ok) throw new Error("Failed to fetch requests");
  return res.json() as Promise<any[]>;
}

export async function apiCreateRequest(data: { title: string; description: string; request_type: string; student_id: string }) {
  const res = await apiFetch("/requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create request");
  return res.json();
}

export async function apiUpdateRequest(reqId: string, data: { status?: string; assigned_to?: string }) {
  const res = await apiFetch(`/requests/${reqId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update request");
  return res.json();
}

// ─── Courses & Grades ────────────────────────────────────
export async function apiGetCourses(professorId?: string) {
  const endpoint = professorId ? `/courses?professor_id=${professorId}` : "/courses";
  const res = await apiFetch(endpoint);
  if (!res.ok) throw new Error("Failed to fetch courses");
  return res.json() as Promise<any[]>;
}

export async function apiCreateCourse(data: { name: string; code: string; description: string; professor_id: string; credits: number }) {
  const res = await apiFetch("/courses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create course");
  return res.json();
}

export async function apiGetGrades(studentId?: string) {
  const endpoint = studentId ? `/grades?student_id=${studentId}` : "/grades";
  const res = await apiFetch(endpoint);
  if (!res.ok) throw new Error("Failed to fetch grades");
  return res.json() as Promise<any[]>;
}

export async function apiCreateGrade(data: { value: number; student_id: string; course_id: string }) {
  const res = await apiFetch("/grades", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create grade");
  return res.json();
}

// ─── Admin Management ────────────────────────────────────
export async function apiAdminGetUsers() {
  const res = await apiFetch("/admin/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json() as Promise<any[]>;
}

export async function apiAdminGetFaculties() {
  const res = await apiFetch("/admin/faculties");
  if (!res.ok) throw new Error("Failed to fetch faculties");
  return res.json() as Promise<any[]>;
}

export async function apiAdminCreateFaculty(data: { name: string; dean: string; departments_count: number }) {
  const res = await apiFetch("/admin/faculties", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create faculty");
  return res.json();
}

export async function apiAdminGetActivityLogs() {
  const res = await apiFetch("/admin/activity-logs");
  if (!res.ok) throw new Error("Failed to fetch activity logs");
  return res.json() as Promise<any[]>;
}

// ─── Health Check ───────────────────────────────────────
export async function apiHealthCheck() {
  const res = await fetch(`${BASE}/test`);
  return res.json() as Promise<{ status: string; message: string }>;
}
