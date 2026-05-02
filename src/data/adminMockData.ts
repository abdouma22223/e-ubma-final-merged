// Mock data for the Admin Dashboard. Frontend-only; safe to edit.

export type UserRole = "student" | "teacher" | "admin";
export type UserStatus = "active" | "inactive";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  faculty?: string;
  createdAt: string;
}

export type RequestStatus = "pending" | "in_progress" | "approved" | "rejected";
export type RequestType =
  | "Transcript"
  | "Enrollment Cert."
  | "Internship Convention"
  | "Diploma Duplicate"
  | "Schedule Change";

export interface AdminRequest {
  id: string;
  ref: string;
  studentName: string;
  studentId: string;
  type: RequestType;
  date: string;
  status: RequestStatus;
  assignedTo?: string;
}

export interface Specialty { id: string; name: string; }
export interface Department { id: string; name: string; specialties: Specialty[]; }
export interface Faculty { id: string; name: string; shortName: string; departments: Department[]; }

export type DocumentStatus = "valid" | "pending" | "flagged";
export type DocumentSource = "Student Upload" | "Teacher Upload" | "System Generated";

export interface AdminDocument {
  id: string; name: string; owner: string; date: string;
  source: DocumentSource; status: DocumentStatus; sizeKb: number;
}

export type ActivityKind = "user" | "request" | "document" | "system" | "auth";

export interface ActivityEntry {
  id: string; kind: ActivityKind; actor: string; action: string;
  target?: string; timestamp: string;
}

export interface Permission { key: string; label: string; description: string; }

export interface RolePermissionMatrix {
  role: UserRole; label: string; description: string;
  permissions: Record<string, boolean>;
}

export const mockAdminUsers: AdminUser[] = [
  { id: "u1", name: "Amine Amara",       email: "amine.amara@univ-annaba.dz",  role: "student", status: "active",   faculty: "Informatics", createdAt: "2024-09-12" },
  { id: "u2", name: "Yasmine Belkacem",  email: "y.belkacem@univ-annaba.dz",   role: "student", status: "active",   faculty: "Informatics", createdAt: "2024-09-15" },
  { id: "u3", name: "Mehdi Rahmani",     email: "m.rahmani@univ-annaba.dz",    role: "student", status: "inactive", faculty: "Engineering", createdAt: "2023-10-04" },
  { id: "u4", name: "Sara Bouzid",       email: "s.bouzid@univ-annaba.dz",     role: "student", status: "active",   faculty: "Medicine",    createdAt: "2024-10-22" },
  { id: "u5", name: "Dr. Karim Boudraa", email: "k.boudraa@univ-annaba.dz",    role: "teacher", status: "active",   faculty: "Informatics", createdAt: "2019-02-18" },
  { id: "u6", name: "Dr. Lina Hadjaz",   email: "l.hadjaz@univ-annaba.dz",     role: "teacher", status: "active",   faculty: "Engineering", createdAt: "2021-09-01" },
  { id: "u7", name: "Pr. Omar Saadi",    email: "o.saadi@univ-annaba.dz",      role: "teacher", status: "inactive", faculty: "Medicine",    createdAt: "2015-03-09" },
  { id: "u8", name: "Nadia Chelbi",      email: "n.chelbi@univ-annaba.dz",     role: "admin",   status: "active",   faculty: "Rectorate",   createdAt: "2018-01-08" },
  { id: "u9", name: "Reda Lounici",      email: "r.lounici@univ-annaba.dz",    role: "admin",   status: "active",   faculty: "Rectorate",   createdAt: "2022-06-14" },
];

export const mockAdminRequests: AdminRequest[] = [
  { id: "r1", ref: "REQ-2026-0421", studentName: "Amine Amara",      studentId: "u1", type: "Transcript",            date: "2026-04-28", status: "pending" },
  { id: "r2", ref: "REQ-2026-0420", studentName: "Yasmine Belkacem", studentId: "u2", type: "Enrollment Cert.",      date: "2026-04-28", status: "in_progress", assignedTo: "Dr. Karim Boudraa" },
  { id: "r3", ref: "REQ-2026-0419", studentName: "Sara Bouzid",      studentId: "u4", type: "Internship Convention", date: "2026-04-27", status: "approved",    assignedTo: "Dr. Lina Hadjaz" },
  { id: "r4", ref: "REQ-2026-0418", studentName: "Mehdi Rahmani",    studentId: "u3", type: "Diploma Duplicate",     date: "2026-04-26", status: "rejected",    assignedTo: "Pr. Omar Saadi" },
];

export const mockFaculties: Faculty[] = [
  { id: "f1", name: "Faculty of Informatics", shortName: "FI", departments: [
    { id: "d1", name: "Computer Science", specialties: [{ id: "s1", name: "Software Engineering" }, { id: "s2", name: "AI" }] },
  ]},
  { id: "f2", name: "Faculty of Engineering", shortName: "FE", departments: [
    { id: "d3", name: "Mechanical Engineering", specialties: [{ id: "s6", name: "Energy Systems" }] },
  ]},
];

export const mockAdminDocuments: AdminDocument[] = [
  { id: "doc1", name: "Transcript_S3_Amara.pdf",      owner: "Amine Amara",      date: "2026-04-26", source: "System Generated", status: "valid",   sizeKb: 184 },
  { id: "doc2", name: "Enrollment_Cert_Belkacem.pdf", owner: "Yasmine Belkacem", date: "2026-04-25", source: "System Generated", status: "valid",   sizeKb: 92 },
  { id: "doc3", name: "ID_Scan_Bouzid.jpg",           owner: "Sara Bouzid",      date: "2026-04-24", source: "Student Upload",   status: "pending", sizeKb: 1322 },
];

export const mockActivity: ActivityEntry[] = [
  { id: "a1", kind: "request",  actor: "Dr. Karim Boudraa", action: "approved request",     target: "REQ-2026-0417", timestamp: "2026-05-01T10:42:00Z" },
  { id: "a2", kind: "user",     actor: "Nadia Chelbi",      action: "created user",         target: "Yasmine Belkacem", timestamp: "2026-05-01T10:18:00Z" },
  { id: "a3", kind: "document", actor: "Sara Bouzid",       action: "uploaded document",    target: "ID_Scan_Bouzid.jpg", timestamp: "2026-05-01T09:55:00Z" },
  { id: "a4", kind: "auth",     actor: "Mehdi Rahmani",     action: "failed login attempt", timestamp: "2026-05-01T09:31:00Z" },
  { id: "a6", kind: "system",   actor: "System",            action: "nightly backup completed", timestamp: "2026-05-01T03:00:00Z" },
];

export const permissionCatalog: Permission[] = [
  { key: "users.manage",     label: "Manage Users",     description: "Create, edit, deactivate user accounts." },
  { key: "requests.review",  label: "Review Requests",  description: "Approve, reject and assign student requests." },
  { key: "requests.submit",  label: "Submit Requests",  description: "Create new academic requests." },
  { key: "documents.upload", label: "Upload Documents", description: "Upload personal or course documents." },
  { key: "documents.flag",   label: "Flag Documents",   description: "Mark suspicious documents for review." },
  { key: "faculties.manage", label: "Manage Faculties", description: "Edit faculties, departments and specialties." },
  { key: "system.monitor",   label: "Monitor System",   description: "Access activity logs and system health." },
];

export const rolePermissions: RolePermissionMatrix[] = [
  { role: "student", label: "Student", description: "Submit requests, manage personal documents.",
    permissions: { "users.manage": false, "requests.review": false, "requests.submit": true, "documents.upload": true, "documents.flag": false, "faculties.manage": false, "system.monitor": false } },
  { role: "teacher", label: "Teacher", description: "Review student requests, validate documents.",
    permissions: { "users.manage": false, "requests.review": true, "requests.submit": false, "documents.upload": true, "documents.flag": true, "faculties.manage": false, "system.monitor": false } },
  { role: "admin", label: "Administrator", description: "Full access to users, faculties, requests and system.",
    permissions: { "users.manage": true, "requests.review": true, "requests.submit": false, "documents.upload": true, "documents.flag": true, "faculties.manage": true, "system.monitor": true } },
];

export const requestsLast7Days = [
  { day: "Mon", value: 12 }, { day: "Tue", value: 18 }, { day: "Wed", value: 9 },
  { day: "Thu", value: 24 }, { day: "Fri", value: 17 }, { day: "Sat", value: 6 }, { day: "Sun", value: 4 },
];
