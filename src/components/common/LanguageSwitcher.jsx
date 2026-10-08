import React from "react";
import { Languages } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  return (
    <button
      className="language-switcher"
      onClick={() => setLanguage(language === "en" ? "ar" : "en")}
      title={language === "en" ? "العربية" : "English"}
      style={{
        background: "transparent",
        color: "#0f172a",
        border: "1px solid #cbd5e1",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 10px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
      }}
    >
      <Languages size={16} color="#0f172a" />
      <span>{language === "en" ? "AR" : "EN"}</span>
    </button>
  );
}
