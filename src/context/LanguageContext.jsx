import React, { createContext, useContext, useState } from "react";
import translations from "./translations";

const STORAGE_KEY = "bulkbridge_language";

// The project's earlier partial language feature stored the full word
// ("English" / "Marathi" / "Hindi") under this same key. We normalize
// those old values to the short codes below so existing saved
// preferences keep working without needing to be reset.
const LEGACY_VALUE_MAP = {
  English: "en",
  Marathi: "mr",
  Hindi: "hi",
};

function readStoredLanguage() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) return null;

  if (translations[raw]) return raw;

  if (LEGACY_VALUE_MAP[raw]) return LEGACY_VALUE_MAP[raw];

  return null;
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  // null = no language chosen yet -> triggers the first-time popup
  const [language, setLanguageState] = useState(() => readStoredLanguage());

  const setLanguage = (code) => {
    if (!translations[code]) return;

    setLanguageState(code);
    localStorage.setItem(STORAGE_KEY, code);
  };

  const t = translations[language] || translations.en;

  const value = {
    language,        // "en" | "mr" | "hi" | null (null until first choice)
    setLanguage,      // call with "en" | "mr" | "hi" to change language anywhere
    t,                // current translations object
    languageChosen: language !== null,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const ctx = useContext(LanguageContext);

  if (!ctx) {
    throw new Error("useLanguage must be used inside a LanguageProvider");
  }

  return ctx;
}
