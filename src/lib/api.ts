/**
 * API Service Layer — connects to the BIG FastAPI backend.
 */
const BASE = (import.meta.env.VITE_API_URL || "http://localhost:8000") + "/api";

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  return fetch(`${BASE}${endpoint}`, options);
}

// ... rest of the file ...
