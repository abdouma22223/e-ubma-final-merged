export type SpaceMode = "student" | "teacher";

export interface Badge {
  icon: string;
  title: string;
  sub: string;
  date: string;
  desc: string;
  criteria: string[];
  issuer: string;
}

export interface Demarche {
  ref: string;
  title: string;
  step: string;
  sla: string;
  status: "disponible" | "encours" | "coffre";
}

export interface Service {
  icon: string;
  name: string;
  desc: string;
}

export interface Stat {
  num: string;
  label: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  status: string;
}
