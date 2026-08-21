export const locales = ["en-IN", "hi-IN"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en-IN";

export const localeMeta: Record<Locale, { label: string; nativeLabel: string; htmlLang: string }> = {
  "en-IN": { label: "English", nativeLabel: "English", htmlLang: "en-IN" },
  "hi-IN": { label: "Hindi", nativeLabel: "हिन्दी", htmlLang: "hi-IN" },
};
