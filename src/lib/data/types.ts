export type PrivCategory =
  | "local"
  | "kerberos"
  | "acl"
  | "delegation"
  | "coerce"
  | "creds"
  | "trusts"
  | "adcs"
  | "sccm"
  | "mssql"
  | "misc";

export type Difficulty = "beginner" | "intermediate";
export type VectorSource = "course" | "ocd" | "both";

export interface AttackStep {
  title: string;
  command?: string;
  why: string;
}

export interface PrivVector {
  id: string;
  category: PrivCategory;
  name: string;
  shortName: string;
  tagline: string;
  difficulty: Difficulty;
  oneLiner: string;
  whyItMatters: string;
  signature: string[];
  prerequisites: string[];
  attackSteps: AttackStep[];
  detection: string[];
  hardening: string[];
  tools: string[];
  glossaryTerms?: string[];
  relatedAdcsLab?: boolean;
  source: VectorSource;
  /** stub = placeholder for later expansion */
  stub?: boolean;
}

export interface PrivCategoryMeta {
  id: PrivCategory;
  label: string;
  description: string;
  vectorIds: string[];
  color: string;
  /** Shown first in "course only" learning path */
  courseTrack?: boolean;
}

export interface BlueTeamRow {
  category: PrivCategory;
  detection: string[];
  hardening: string[];
}

export interface PatchContext {
  title: string;
  paragraphs: string[];
  rule: string[];
  whySid: string;
}

export interface DecisionTableRow {
  vectorId: string;
  action: string;
}

export interface DecisionTable {
  title: string;
  steps: string[];
  rows: DecisionTableRow[];
}

export interface CheatSheetBlock {
  title: string;
  lines: string[];
}

export interface CheatSheet {
  title: string;
  intro: string[];
  blocks: CheatSheetBlock[];
}

export interface PracticeOption {
  vectorId: string;
  label: string;
  correct: boolean;
  feedback: string;
}

export interface PracticeScenario {
  id: string;
  title: string;
  scenario: string;
  command: string;
  output: string;
  question: string;
  hint: string;
  options: PracticeOption[];
  keyLines: string[];
  explanation: string[];
  nextStep: string;
}

/** @deprecated aliases kept during migration */
export type EscGroup = PrivCategory;
export type EscCase = PrivVector;
export type EscGroupMeta = PrivCategoryMeta;
