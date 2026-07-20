import { useMemo } from "react";

import type { Lang } from "@/lib/i18n";
import { useI18n } from "@/lib/i18n";

import * as practiceEn from "./practice.en";
import * as practiceEs from "./practice.es";
import * as privescEn from "./privesc.en";
import * as privescEs from "./privesc.es";
import type {
  BlueTeamRow,
  CheatSheet,
  DecisionTable,
  PatchContext,
  PracticeScenario,
  PrivCategory,
  PrivCategoryMeta,
  PrivVector,
} from "./types";

export type {
  AttackStep,
  BlueTeamRow,
  CheatSheet,
  DecisionTable,
  PatchContext,
  PracticeOption,
  PracticeScenario,
  PrivCategory,
  PrivCategoryMeta,
  PrivVector,
  Difficulty,
  VectorSource,
} from "./types";

/** @deprecated compatibility aliases */
export type EscCase = PrivVector;
export type EscGroup = PrivCategory;
export type EscGroupMeta = PrivCategoryMeta;

export interface PrivEscBundle {
  groups: PrivCategoryMeta[];
  vectors: PrivVector[];
  patchContext: PatchContext;
  decisionTable: DecisionTable;
  blueTeam: BlueTeamRow[];
  cheatSheet: CheatSheet;
  getGroupById: (id: PrivCategory) => PrivCategoryMeta | undefined;
  getVectorById: (id: string) => PrivVector | undefined;
  getVectorsByCategory: (id: PrivCategory) => PrivVector[];
  getCourseVectors: () => PrivVector[];
  /** aliases for gradual migration */
  escCases: PrivVector[];
  getEscById: (id: string | number) => PrivVector | undefined;
  getEscsByGroup: (id: PrivCategory) => PrivVector[];
}

function buildBundle(lang: Lang): PrivEscBundle {
  const src = lang === "en" ? privescEn : privescEs;
  const getVectorById = (id: string) => src.vectors.find((v) => v.id === id);
  const getVectorsByCategory = (id: PrivCategory) => src.vectors.filter((v) => v.category === id);
  const getCourseVectors = () => src.vectors.filter((v) => v.source === "course" || v.category === "local");

  return {
    groups: src.groups,
    vectors: src.vectors,
    patchContext: src.patchContext,
    decisionTable: src.decisionTable,
    blueTeam: src.blueTeam,
    cheatSheet: src.cheatSheet,
    getGroupById: (id) => src.groups.find((g) => g.id === id),
    getVectorById,
    getVectorsByCategory,
    getCourseVectors,
    escCases: src.vectors,
    getEscById: (id) => getVectorById(String(id)),
    getEscsByGroup: getVectorsByCategory,
  };
}

export type AdcsBundle = PrivEscBundle;

export function getPrivEscBundle(lang: Lang = "es"): PrivEscBundle {
  return buildBundle(lang);
}

export function getAdcsBundle(lang: Lang = "es"): PrivEscBundle {
  return buildBundle(lang);
}

export function getPracticeScenarios(lang: Lang = "es"): PracticeScenario[] {
  return lang === "en" ? practiceEn.scenarios : practiceEs.scenarios;
}

export const vectors = privescEs.vectors;
export const escCases = privescEs.vectors;
export const groups = privescEs.groups;

export function getVectorById(id: string): PrivVector | undefined {
  return privescEs.vectors.find((v) => v.id === id);
}

export function getEscById(id: string | number): PrivVector | undefined {
  return getVectorById(String(id));
}

export function usePrivEscData(): PrivEscBundle {
  const { lang } = useI18n();
  return useMemo(() => buildBundle(lang), [lang]);
}

export function useAdcsData(): PrivEscBundle {
  return usePrivEscData();
}

export function usePracticeScenarios(): PracticeScenario[] {
  const { lang } = useI18n();
  return useMemo(() => getPracticeScenarios(lang), [lang]);
}
