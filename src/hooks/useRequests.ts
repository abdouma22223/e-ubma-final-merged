import { useCallback, useEffect, useState } from "react";

export type RequestStatus = "pending" | "accepted" | "rejected" | "transferred";

export type StudentRequestItem = {
  id: string; type: string; subject: string; message: string;
  student: string; createdAt: number; status: RequestStatus;
  assignedTeacher?: string; adminNote?: string;
};

const KEY = "ubma:requests:v1";
const EVT = "ubma:requests:update";
const seed: StudentRequestItem[] = [];

function read(): StudentRequestItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) { localStorage.setItem(KEY, JSON.stringify(seed)); return seed; }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return seed;
    return (parsed as any[]).filter(item => item && typeof item === 'object' && item.id);
  } catch { return seed; }
}

function write(next: StudentRequestItem[]) {
  try { localStorage.setItem(KEY, JSON.stringify(next)); window.dispatchEvent(new CustomEvent(EVT)); } catch { /* ignore */ }
}

export function useRequests() {
  const [requests, setRequests] = useState<StudentRequestItem[]>(() => read());

  useEffect(() => {
    const sync = () => setRequests(read());
    window.addEventListener("storage", sync);
    window.addEventListener(EVT, sync as EventListener);
    return () => { window.removeEventListener("storage", sync); window.removeEventListener(EVT, sync as EventListener); };
  }, []);

  const create = useCallback((data: Omit<StudentRequestItem, "id" | "createdAt" | "status">) => {
    const item: StudentRequestItem = { ...data, id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, createdAt: Date.now(), status: "pending" };
    const next = [item, ...read()];
    write(next); setRequests(next);
    return item;
  }, []);

  const update = useCallback((id: string, patch: Partial<StudentRequestItem>) => {
    const next = read().map((r) => (r.id === id ? { ...r, ...patch } : r));
    write(next); setRequests(next);
  }, []);

  return { requests, create, update };
}
