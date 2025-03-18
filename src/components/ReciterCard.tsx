
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reciter, Moshaf } from "@/types";
import { Play, User, BookOpenCheck, FileAudio } from "lucide-react";
import AudioPlayer from "./AudioPlayer";

interface ReciterCardProps {
  reciter: Reciter;
  language?: "ar" | "en";
}

const ReciterCard: React.FC<ReciterCardProps> = ({ reciter, language = "ar" }) => {
  const [selectedMoshaf, setSelectedMoshaf] = useState<Moshaf | null>(null);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [showingPlayer, setShowingPlayer] = useState(false);
  const [preloadedAudio, setPreloadedAudio] = useState<{[key: string]: boolean}>({});

  const handlePlaySurah = (moshaf: Moshaf, surahNumber: number) => {
    setSelectedMoshaf(moshaf);
    setSelectedSurah(surahNumber);
    setShowingPlayer(true);
  };

  const closePlayer = () => {
    setShowingPlayer(false);
    setSelectedSurah(null);
  };

  const getAudioUrl = (moshaf: Moshaf, surahNumber: number) => {
    return `${moshaf.server}${surahNumber.toString().padStart(3, '0')}.mp3`;
  };

  const preloadAudio = (moshaf: Moshaf, surahNumber: number) => {
    const audioUrl = getAudioUrl(moshaf, surahNumber);
    const key = `${moshaf.id}-${surahNumber}`;
    
    if (preloadedAudio[key]) return;
    
    const audio = new Audio();
    audio.preload = "metadata";
    audio.src = audioUrl;
    
    // Mark this audio as preloaded
    setPreloadedAudio(prev => ({...prev, [key]: true}));
  };

  const getPaddedSurahNumbers = (surahListStr: string) => {
    return surahListStr.split(',').map(Number);
  };

  // Translations for UI text
  const translations = {
    availableSurahs: language === "ar" ? "السور المتاحة:" : "Available Surahs:",
    availableVersions: language === "ar" ? "إصدار متاح" : "available version",
    closePlayer: language === "ar" ? "إغلاق المشغل" : "Close player",
    openPlayer: language === "ar" ? "فتح المشغل" : "Open player",
    surahs: language === "ar" ? "سورة متاحة" : "surahs available",
    surahPrefix: language === "ar" ? "سورة" : "Surah",
  };

  // Preload audio files for the first few surahs when reciter is loaded
  useEffect(() => {
    if (!reciter.moshaf || reciter.moshaf.length === 0) return;
    
    const moshaf = reciter.moshaf[0];
    const surahNumbers = getPaddedSurahNumbers(moshaf.surah_list);
    
    // Preload first 3 surahs for better user experience (or fewer if not available)
    const surahsToPreload = surahNumbers.slice(0, Math.min(3, surahNumbers.length));
    
    surahsToPreload.forEach(surahNumber => {
      preloadAudio(moshaf, surahNumber);
    });
  }, [reciter]);

  return (
    <Card className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300 border-quran-gold/20 overflow-hidden">
      <CardHeader className="bg-quran-primary text-white pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-quran-gold" />
            <h3 className="text-xl font-bold">{reciter.name}</h3>
          </div>
          <Badge variant="outline" className="bg-white/10 text-white border-white/20">
            ID: {reciter.id}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 pb-4">
        {reciter.moshaf.map((moshaf) => (
          <div key={moshaf.id} className="mb-4 pb-4 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-start gap-2">
                <BookOpenCheck className="h-5 w-5 mt-1 text-quran-secondary" />
                <div>
                  <h4 className="font-medium text-quran-dark">{moshaf.name}</h4>
                  <p className="text-sm text-gray-500">
                    {moshaf.surah_total} {translations.surahs}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="bg-quran-secondary/10 text-quran-secondary border-quran-secondary/20">
                {moshaf.id}
              </Badge>
            </div>
            
            {showingPlayer && selectedMoshaf?.id === moshaf.id && selectedSurah && (
              <div className="mb-4">
                <AudioPlayer 
                  audioUrl={getAudioUrl(moshaf, selectedSurah)}
                  reciterName={reciter.name}
                  surahName={`${translations.surahPrefix} ${selectedSurah}`}
                  language={language}
                />
              </div>
            )}
            
            <div className="mt-3">
              <h5 className="text-sm font-medium text-quran-dark mb-2">{translations.availableSurahs}</h5>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                {getPaddedSurahNumbers(moshaf.surah_list).map((surahNumber) => (
                  <Button
                    key={surahNumber}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 bg-quran-gold/5 hover:bg-quran-gold/20 border-quran-gold/20 text-quran-dark"
                    onClick={() => handlePlaySurah(moshaf, surahNumber)}
                    onMouseOver={() => preloadAudio(moshaf, surahNumber)}
                  >
                    {surahNumber}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      
      <CardFooter className="bg-quran-gold/5 border-t border-quran-gold/20 py-3">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileAudio className="h-4 w-4 text-quran-accent" />
            <span className="text-sm text-quran-dark">
              {reciter.moshaf.length} {translations.availableVersions}
            </span>
          </div>
          
          {selectedMoshaf && (
            <Button 
              variant="link" 
              size="sm" 
              className="text-quran-primary p-0"
              onClick={closePlayer}
            >
              {showingPlayer ? translations.closePlayer : translations.openPlayer}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ReciterCard;
