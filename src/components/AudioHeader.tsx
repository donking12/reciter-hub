
import React from "react";

interface AudioHeaderProps {
  reciterName?: string;
  surahName?: string;
  language?: "ar" | "en";
}

const AudioHeader: React.FC<AudioHeaderProps> = ({ 
  reciterName, 
  surahName,
  language = "ar" 
}) => {
  const surahDisplayName = language === "en" && surahName?.startsWith("سورة")
    ? surahName.replace("سورة", "Surah")
    : surahName;

  if (!reciterName && !surahName) return null;

  return (
    <div className="text-center mb-2">
      {reciterName && <p className="text-quran-dark font-medium">{reciterName}</p>}
      {surahDisplayName && <p className="text-quran-secondary text-sm">{surahDisplayName}</p>}
    </div>
  );
};

export default AudioHeader;
