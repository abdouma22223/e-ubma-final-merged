import { Badge, Demarche, Service, Stat } from "../types/student";

export const STATS: Stat[] = [
  { num: "3", label: "Documents ready" },
  { num: "7", label: "Open Badges earned" },
  { num: "12", label: "Vault items" },
  { num: "100%", label: "PAdES signed" },
];

export const SERVICES: Service[] = [
  { icon: "📋", name: "School Certificate", desc: "Digitally signed PDF, ready in under 5 minutes." },
  { icon: "📊", name: "Academic Transcript", desc: "Official grades with PAdES-LTV signature." },
  { icon: "🏅", name: "Open Badges", desc: "Verifiable credentials using OB 3.0 standard." },
  { icon: "🔐", name: "Digital Vault", desc: "Store and share documents with QR verification." },
  { icon: "✏️", name: "Enrollment Certificate", desc: "Official proof of active student enrollment." },
  { icon: "📬", name: "Delivery Request", desc: "Request physical copies sent by post." },
];

export const BADGES: Badge[] = [
  {
    icon: "🧮",
    title: "Data Structures",
    sub: "Faculty of Informatics",
    date: "Issued Mar 2025",
    desc: "Mastery of arrays, linked lists, trees, graphs and algorithmic complexity.",
    criteria: ["Final exam ≥ 80%", "5 lab projects completed", "Peer-reviewed code"],
    issuer: "Prof. K. Boudraa",
  },
  {
    icon: "🌐",
    title: "Web Development",
    sub: "Faculty of Informatics",
    date: "Issued Jan 2025",
    desc: "Modern full-stack web engineering with React, TypeScript and REST APIs.",
    criteria: ["Capstone project shipped", "Accessibility audit passed", "Git workflow demonstrated"],
    issuer: "Dr. L. Hammoudi",
  },
  {
    icon: "🤖",
    title: "Machine Learning",
    sub: "GNU AI Lab",
    date: "Issued Nov 2024",
    desc: "Supervised & unsupervised learning, model evaluation, and ethical AI practices.",
    criteria: ["Kaggle-style challenge top 25%", "Research note submitted", "Reproducible notebook"],
    issuer: "Prof. S. Benali",
  },
  {
    icon: "🔒",
    title: "Cybersecurity",
    sub: "GNU Security Center",
    date: "Issued Sep 2024",
    desc: "Threat modeling, cryptography fundamentals, and secure-by-design engineering.",
    criteria: ["CTF participation", "Vulnerability report filed", "Secure code review"],
    issuer: "Dr. R. Cherif",
  },
];

export const DEMARCHES: Demarche[] = [
  { ref: "#GNU-421", title: "Congé académique", step: "N1 instruit", sla: "J-7", status: "encours" },
  { ref: "#GNU-398", title: "Attestation scolarité", step: "Généré", sla: "Prêt", status: "disponible" },
  { ref: "#GNU-356", title: "Relevé de notes S1", step: "Archivé", sla: "OK", status: "coffre" },
  { ref: "#GNU-342", title: "Demande de stage", step: "N2 validation", sla: "J-3", status: "encours" },
];
export const NAV_LINKS = ["Dashboard", "E-services", "My Documents", "Open Badges", "Digital Vault"];

export const VAULT = [
  {
    icon: "📄",
    name: "Attestation de scolarité 2025-26",
    date: "28 avril 2025",
    source: "Service Scolarité",
    signature: "PAdES-LTV",
  },
  {
    icon: "🎓",
    name: "Désignation PFE – Dr. Khelili",
    date: "15 مارس 2025",
    source: "Faculté d'Informatique",
    signature: "PAdES",
  },
  {
    icon: "🌐",
    name: "Attestation CEIL Anglais B2",
    date: "10 février 2025",
    source: "Centre CEIL",
    signature: "PAdES-LTV",
  },
];

export const TIMELINE = [
  { day: "Today", time: "09:15", title: "Document Generated", desc: "Your Attestation Scolarité is now available in the vault." },
  { day: "Yesterday", time: "16:30", title: "Badge Earned", desc: "You completed the final challenge for Cybersecurity." },
  { day: "24 Mar", time: "11:20", title: "Vault Shared", desc: "Shared 'Transcript_S1.pdf' with Campus France." },
];
