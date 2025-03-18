
import React from "react";
import { Reciter } from "@/types";
import { Volume2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ReciterGridProps {
  reciters: Reciter[];
  language: "ar" | "en";
  onOpenSurahSelector: (server: string, name: string, action: "listen" | "download") => void;
  isLoading: boolean;
}

const ReciterGrid: React.FC<ReciterGridProps> = ({ 
  reciters, 
  language, 
  onOpenSurahSelector,
  isLoading
}) => {
  // Translations for UI text
  const translations = {
    listen: language === "ar" ? "استماع" : "Listen",
    download: language === "ar" ? "تحميل" : "Download",
    surahs: language === "ar" ? "عدد السور:" : "Surahs:",
    noResults: language === "ar" 
      ? "لا توجد نتائج مطابقة لبحثك. يرجى تجربة كلمات أخرى." 
      : "No matching results found. Try different search terms.",
  };

  if (reciters.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">
          {translations.noResults}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {reciters.map((reciter) => {
        // Ensure server URL ends with a slash
        const moshaf = reciter.moshaf && reciter.moshaf[0];
        let serverUrl = moshaf?.server || "";
        if (serverUrl && !serverUrl.endsWith('/')) {
          serverUrl += '/';
        }
        
        return (
          <div 
            key={reciter.id} 
            className="bg-white rounded-lg shadow-md p-5 transition-transform hover:-translate-y-1 hover:shadow-lg"
          >
            <h3 className="text-xl font-bold text-green-darker mb-3">{reciter.name}</h3>
            
            <div className="mb-4">
              {moshaf && (
                <>
                  <p className="text-gray-700 mb-1">{moshaf.name}</p>
                  <p className="text-sm text-gray-600">
                    {translations.surahs} {moshaf.surah_total}
                  </p>
                </>
              )}
              <Badge variant="outline" className="mt-2 bg-green-light/20 text-green-darker">
                ID: {reciter.id}
              </Badge>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button 
                className="flex-1 bg-green-primary hover:bg-green-dark text-white"
                onClick={() => onOpenSurahSelector(serverUrl, reciter.name, "listen")}
              >
                <Volume2 className="mr-1 h-4 w-4" />
                {translations.listen}
              </Button>
              <Button 
                variant="outline"
                className="flex-1 border-green-primary text-green-primary hover:bg-green-light/30"
                onClick={() => onOpenSurahSelector(serverUrl, reciter.name, "download")}
              >
                <Download className="mr-1 h-4 w-4" />
                {translations.download}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReciterGrid;
