/**
 * Facade: localized PrivEsc data.
 * Prefer usePrivEscData() in React components.
 */
export {
  getPrivEscBundle,
  getVectorById,
  groups,
  usePrivEscData,
  vectors,
  type BlueTeamRow,
  type CheatSheet,
  type DecisionTable,
  type PatchContext,
  type PrivCategory,
  type PrivCategoryMeta,
  type PrivEscBundle,
  type PrivVector,
} from "./data";

/** @deprecated — use usePrivEscData */
export { useAdcsData, getAdcsBundle, getEscById, escCases } from "./data";

import { getPrivEscBundle } from "./data";

const es = getPrivEscBundle("es");

export const patchContext = es.patchContext;
export const decisionTable = es.decisionTable;
export const blueTeam = es.blueTeam;
export const cheatSheet = es.cheatSheet;

export function getGroupById(id: import("./data").PrivCategory) {
  return es.getGroupById(id);
}

export function getVectorsByCategory(id: import("./data").PrivCategory) {
  return es.getVectorsByCategory(id);
}
