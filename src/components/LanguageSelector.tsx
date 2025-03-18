
import React from "react";
import { Button } from "@/components/ui/button";

interface LanguageSelectorProps {
  language: "ar" | "en";
  onLanguageChange: (language: "ar" | "en") => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  language, 
  onLanguageChange 
}) => {
  return (
    <div className="flex border border-green-light rounded-md overflow-hidden">
      <Button
        variant="ghost"
        className={`px-3 py-1 h-9 ${language === "ar" ? "bg-green-dark text-white" : ""}`}
        onClick={() => onLanguageChange("ar")}
      >
        العربية
      </Button>
      <Button
        variant="ghost"
        className={`px-3 py-1 h-9 ${language === "en" ? "bg-green-dark text-white" : ""}`}
        onClick={() => onLanguageChange("en")}
      >
        English
      </Button>
    </div>
  );
};

export default LanguageSelector;
