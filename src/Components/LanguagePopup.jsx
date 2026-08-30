import React, { useState } from "react";
import "../styles/LanguagePopup.css";
import { useLanguage } from "../context/LanguageContext";

// Shown once, before Login/Signup, when no language preference exists yet
// in localStorage. Does not appear again once a language has been chosen
// (either here or later from Settings -> Language).
export default function LanguagePopup() {
  const { languageChosen, setLanguage, t } = useLanguage();

  const [selected, setSelected] = useState("en");

  if (languageChosen) return null;

  const handleContinue = () => {
    setLanguage(selected);
  };

  const options = [
    { code: "en", label: t.languagePopup.english },
    { code: "mr", label: t.languagePopup.marathi },
    { code: "hi", label: t.languagePopup.hindi },
  ];

  return (
    <div className="language-popup-overlay">
      <div className="language-popup-card">
        <h2>{t.languagePopup.title}</h2>

        <div className="language-popup-options">
          {options.map((opt) => (
            <button
              key={opt.code}
              type="button"
              className={`language-popup-option ${
                selected === opt.code ? "selected" : ""
              }`}
              onClick={() => setSelected(opt.code)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="language-popup-continue"
          onClick={handleContinue}
        >
          {t.languagePopup.continueBtn}
        </button>
      </div>
    </div>
  );
}
