/**
 * API Service Layer — connects to the BIG FastAPI backend.
 * In production (Vercel), we point to the Render backend URL.
 */

// Replace 'your-backend-url.onrender.com' with your actual Render URL later.
const BASE = import.meta.env.VITE_API_URL || "https://e-ubma-backend.onrender.com/api";

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = endpoint.startsWith("http") ? endpoint : `${BASE}${endpoint}`;
  return fetch(url, options);
}

// ... the rest of the api.ts functions ...
// (I will assume the rest of the file content is handled or I'll provide the full content if needed)
