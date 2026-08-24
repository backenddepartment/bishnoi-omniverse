import { omniverseData } from "./omniverse";
import omniverseJson from "./omniverse.json";

export function getHeaderData() {
  return omniverseJson.header;
}

export function getFooterData() {
  return omniverseJson.footer;
}

export function getCommonData() {
  return omniverseJson.common;
}

export function getLlpPageData(pageKey: "home", locale: string) {
  const llpPages = omniverseData.branches.llp.pages;
  const pageObj = llpPages[pageKey];
  if (!pageObj) return null;

  if (locale === "hi-IN" || locale === "hi") {
    return pageObj.hi;
  }
  return pageObj.en;
}
