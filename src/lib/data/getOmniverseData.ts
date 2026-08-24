import { omniverseData } from "./omniverse";
import omniverseJson from "./omniverse.json";

export type BranchName = "corp" | "llp" | "mother";

export function getHeaderData() {
  return omniverseJson.header;
}

export function getFooterData() {
  return omniverseJson.footer;
}

export function getCommonData() {
  return omniverseJson.common;
}

export function getLlpPageData(pageKey: "home" | "about" | "oncology" | "partnerships" | "sourcing" | "contact", locale: string) {
  const llpPages = omniverseData.branches.llp.pages;
  const pageObj = llpPages[pageKey];
  if (!pageObj) return null;

  if (locale === "hi-IN" || locale === "hi") {
    return pageObj.hi;
  }
  return pageObj.en;
}

export function getCorpPageData(pageKey: "home" | "about" | "oncology" | "hospital" | "partnerships" | "contact") {
  const corpPages = omniverseData.branches.corp.pages;
  return corpPages[pageKey] || null;
}

export function getMotherPageData(pageKey: "home" | "about" | "companies" | "founder" | "contact") {
  const motherPages = omniverseData.branches.mother.pages;
  return motherPages[pageKey] || null;
}
