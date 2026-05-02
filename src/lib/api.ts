/**
 * API Service Layer — connects to the BIG FastAPI backend.
 */
const BASE = (import.meta.env.VITE_API_URL || "http://localhost:8001") + "/api";

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

export async function apiRegister(data: any) {
  const res = await apiFetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function apiChat(message: string, userId: string = "anonymous", context?: any) {
  const res = await apiFetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, user_id: userId, context }),
  });
  if (!res.ok) throw new Error("Chat request failed");
  return res.json();
}

export async function apiGetDocuments(userId: string) {
  const res = await apiFetch(`/documents?user_id=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json();
}

export async function apiUpdateDocumentStatus(docId: string, status: string, userId: string) {
  const res = await apiFetch(`/documents/${docId}/status?user_id=${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
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

export async function apiCreateShareLink(fileId: string, durationHours: number | null, customExpiry: string | null, usageType: string) {
  const res = await apiFetch("/documents/share", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file_id: fileId, duration_hours: durationHours, custom_expiry: customExpiry, usage_type: usageType }),
  });
  if (!res.ok) throw new Error("Share link creation failed");
  return res.json();
}

export async function apiGetShareStatus(token: string) {
  const res = await apiFetch(`/documents/share/status/${token}`);
  if (!res.ok) throw new Error("Failed to fetch share status");
  return res.json();
}

export async function apiRevokeShareLink(token: string) {
  const res = await apiFetch(`/documents/share/${token}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to revoke link");
  return res.json();
}

export async function apiVerifyDocument(fileHash: string) {
  const res = await apiFetch(`/documents/verify/${fileHash}`);
  if (!res.ok) throw new Error("Verification failed");
  return res.json();
}

export async function apiGetRequests(userId: string, role: string) {
  const res = await apiFetch(`/requests?user_id=${userId}&role=${role}`);
  if (!res.ok) throw new Error("Failed to fetch requests");
  return res.json();
}

export async function apiCreateRequest(data: any) {
  const res = await apiFetch("/requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function apiUpdateRequest(reqId: string, data: any) {
  const res = await apiFetch(`/requests/${reqId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function apiGetCourses(professorId?: string) {
  const endpoint = professorId ? `/courses?professor_id=${professorId}` : "/courses";
  const res = await apiFetch(endpoint);
  return res.json();
}

export async function apiCreateCourse(data: any) {
  const res = await apiFetch("/courses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function apiGetGrades(studentId?: string) {
  const endpoint = studentId ? `/grades?student_id=${studentId}` : "/grades";
  const res = await apiFetch(endpoint);
  return res.json();
}

export async function apiCreateGrade(data: any) {
  const res = await apiFetch("/grades", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function apiAdminGetUsers() {
  const res = await apiFetch("/admin/users");
  return res.json();
}

export async function apiAdminGetFaculties() {
  const res = await apiFetch("/admin/faculties");
  return res.json();
}

export async function apiAdminCreateFaculty(data: any) {
  const res = await apiFetch("/admin/faculties", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function apiAdminGetActivityLogs() {
  const res = await apiFetch("/admin/activity-logs");
  return res.json();
}
