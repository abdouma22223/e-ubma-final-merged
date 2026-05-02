// Mock data for the Teacher dashboard — frontend only, no API calls.

export type RequestStatus = "Pending" | "Approved" | "Rejected" | "In Progress";

export type StudentRequest = {
  id: string; student: string; type: string; date: string;
  status: RequestStatus; comment?: string;
};

export const mockRequests: StudentRequest[] = [
  { id: "REQ-1042", student: "Amine Amara",    type: "Grade Review",           date: "2025-04-28", status: "Pending" },
  { id: "REQ-1041", student: "Lina Bensalem",  type: "Internship Approval",    date: "2025-04-27", status: "In Progress" },
  { id: "REQ-1040", student: "Yacine Mokrani", type: "Absence Justification",  date: "2025-04-26", status: "Approved" },
  { id: "REQ-1039", student: "Salma Khelili",  type: "Subject Change",         date: "2025-04-24", status: "Rejected" },
  { id: "REQ-1038", student: "Walid Hammoudi", type: "Document Validation",    date: "2025-04-22", status: "Pending" },
];

export type StudentGrade = { id: string; student: string; course: string; grade: number | null; published: boolean; };

export const mockGrades: StudentGrade[] = [
  { id: "G-01", student: "Amine Amara",    course: "Data Structures", grade: 16,   published: true  },
  { id: "G-02", student: "Lina Bensalem",  course: "Data Structures", grade: 14,   published: true  },
  { id: "G-03", student: "Yacine Mokrani", course: "Data Structures", grade: 12,   published: false },
  { id: "G-04", student: "Salma Khelili",  course: "Data Structures", grade: null, published: false },
  { id: "G-05", student: "Walid Hammoudi", course: "Data Structures", grade: 18,   published: true  },
];

export type MonitoredStudent = { id: string; name: string; course: string; performance: number; attendance: number; };

export const mockStudents: MonitoredStudent[] = [
  { id: "S-201", name: "Amine Amara",    course: "Data Structures", performance: 88, attendance: 96 },
  { id: "S-202", name: "Lina Bensalem",  course: "Data Structures", performance: 74, attendance: 89 },
  { id: "S-203", name: "Yacine Mokrani", course: "Data Structures", performance: 62, attendance: 71 },
  { id: "S-204", name: "Salma Khelili",  course: "Algorithms",      performance: 91, attendance: 98 },
  { id: "S-205", name: "Walid Hammoudi", course: "Algorithms",      performance: 80, attendance: 84 },
  { id: "S-206", name: "Nour El Houda",  course: "Algorithms",      performance: 55, attendance: 67 },
];

export type SubmittedDocument = { id: string; title: string; source: string; date: string; status: "Pending" | "Validated" | "Rejected"; };

export const mockDocuments: SubmittedDocument[] = [
  { id: "DOC-501", title: "Internship convention — TechAlgeria", source: "Amine Amara",    date: "2025-04-27", status: "Pending" },
  { id: "DOC-502", title: "Medical certificate",                  source: "Lina Bensalem",  date: "2025-04-25", status: "Pending" },
  { id: "DOC-503", title: "Project report — DS Lab 4",            source: "Yacine Mokrani", date: "2025-04-22", status: "Validated" },
  { id: "DOC-504", title: "Visa application letter",              source: "Salma Khelili",  date: "2025-04-20", status: "Rejected" },
];

export const quickReplies = [
  "Your request is approved.",
  "Please provide additional documents.",
  "Your grade has been updated.",
  "Meeting confirmed for tomorrow at 10:00.",
];

export type CourseMaterial = { id: string; title: string; type: "PDF" | "Slides" | "Video" | "Link"; uploaded: string; };

export const mockMaterials: CourseMaterial[] = [
  { id: "M-01", title: "Lecture 7 — Trees & Heaps",      type: "Slides", uploaded: "2025-04-21" },
  { id: "M-02", title: "Lab 4 — Hash tables",             type: "PDF",    uploaded: "2025-04-18" },
  { id: "M-03", title: "Recorded session — Graphs intro", type: "Video",  uploaded: "2025-04-15" },
];

export type Announcement = { id: string; title: string; body: string; date: string; };

export const mockAnnouncements: Announcement[] = [
  { id: "A-01", title: "Mid-term exam scheduled", body: "Mid-term will take place on May 12 at 10:00 in Amphi A.", date: "2025-04-28" },
  { id: "A-02", title: "Office hours moved",      body: "This week's office hours are moved to Thursday 14:00–16:00.", date: "2025-04-25" },
];

export type DeadlineTask = { id: string; title: string; due: string; course: string; };

export const mockDeadlines: DeadlineTask[] = [
  { id: "D-01", title: "Grade Lab 4 submissions",  due: "2025-05-03", course: "Data Structures" },
  { id: "D-02", title: "Publish mid-term subject",  due: "2025-05-08", course: "Algorithms" },
  { id: "D-03", title: "Validate internship docs",  due: "2025-05-10", course: "Data Structures" },
];

export type WorkflowStep = "Submitted" | "Received" | "Processing" | "Decision";

export const workflowSteps: { key: WorkflowStep; desc: string }[] = [
  { key: "Submitted",  desc: "Student submitted the request via the portal." },
  { key: "Received",   desc: "Department received and assigned the file." },
  { key: "Processing", desc: "Teacher is currently reviewing the request." },
  { key: "Decision",   desc: "Final decision will be communicated." },
];
