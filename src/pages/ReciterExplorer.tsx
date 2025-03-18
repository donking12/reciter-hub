
import React, { useState, useRef } from "react";
import { useReciters } from "@/hooks/useReciters";
import { getTranslations } from "@/utils/translations";
import { preloadAudio, getAudioUrl, PreloadedAudio } from "@/services/audioPreloader";
import { Link } from "react-router-dom";
import { Loader2, BookOpenText } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import LanguageSelector from "@/components/LanguageSelector";
import ReciterGrid from "@/components/ReciterGrid";
import SurahSelectorModal from "@/components/SurahSelectorModal";
import InlineAudioPlayer from "@/components/InlineAudioPlayer";

const ReciterExplorer = () => {
  const {
    filteredReciters,
    isLoading,
    searchTerm,
    language,
    filterReciters,
    handleLanguageChange,
    handleSearchChange
  } = useReciters("ar");

  const [showPlayer, setShowPlayer] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<{
    url: string;
    surahName: string;
    reciterName: string;
  } | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedReciter, setSelectedReciter] = useState<{
    server: string;
    name: string;
    action: "listen" | "download";
  } | null>(null);
  
  const [loadingState, setLoadingState] = useState<{[key: string]: boolean}>({});
  const [preloadedAudios, setPreloadedAudios] = useState<PreloadedAudio>({});

  const audioRef = useRef<HTMLAudioElement>(null);
  const translations = getTranslations(language);

  const openSurahSelector = (server: string, name: string, action: "listen" | "download") => {
    setSelectedReciter({ server, name, action });
    setShowModal(true);
    
    // Preload the first few surahs
    if (action === "listen") {
      preloadAudio(
        server, 
        [1, 2, 3, 4, 5], 
        preloadedAudios, 
        (key) => setPreloadedAudios(prev => ({...prev, [key]: true}))
      );
    }
  };

  const handleSurahSelect = (surahNumber: number) => {
    if (!selectedReciter) return;
    
    const audioUrl = getAudioUrl(selectedReciter.server, surahNumber);
    
    if (selectedReciter.action === "listen") {
      playAudio(audioUrl, surahNumber, selectedReciter.name);
    } else {
      downloadAudio(audioUrl, `${selectedReciter.name} - ${translations.surahPrefix} ${surahNumber}.mp3`);
    }
    
    setShowModal(false);
  };

  const playAudio = (url: string, surahNumber: number, reciterName: string) => {
    setLoadingState(prev => ({...prev, [url]: true}));
    
    const surahName = `${translations.surahPrefix} ${surahNumber}`;
    
    setCurrentAudio({ url, surahName, reciterName });
    setShowPlayer(true);
  };

  const downloadAudio = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const closePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setShowPlayer(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-green-background">
      {/* Header */}
      <header className="bg-green-primary py-6 shadow-md text-white">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">
              {translations.siteTitle}
            </h1>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <SearchBar 
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                onSearch={filterReciters}
                placeholder={translations.searchPlaceholder}
              />
              
              <LanguageSelector 
                language={language}
                onLanguageChange={handleLanguageChange}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 flex-1">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpenText className="h-6 w-6 text-green-primary" />
            <h2 className="text-2xl font-bold text-green-darker">
              {translations.exploreReciters}
            </h2>
          </div>
          
          <div className="flex gap-2">
            <Button asChild className="bg-green-primary hover:bg-green-dark text-white">
              <Link to="/reciters" className="flex items-center gap-2">
                <BookOpenText className="h-5 w-5" />
                {translations.viewRecitersList}
              </Link>
            </Button>
            <Button variant="outline" asChild className="border-green-primary text-green-primary hover:bg-green-light/30">
              <Link to="/classic">
                {translations.classicVersion}
              </Link>
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-green-primary" />
              <p className="mt-4 text-green-primary">
                {translations.loading}
              </p>
            </div>
          </div>
        ) : (
          <ReciterGrid 
            reciters={filteredReciters}
            language={language}
            onOpenSurahSelector={openSurahSelector}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white py-4 border-t border-green-light">
        <div className="container text-center">
          <p className="text-gray-600 text-sm">
            {translations.footer}
          </p>
        </div>
      </footer>

      {/* Audio Player */}
      {currentAudio && (
        <InlineAudioPlayer
          show={showPlayer}
          audioUrl={currentAudio.url}
          reciterName={currentAudio.reciterName}
          surahName={currentAudio.surahName}
          onClose={closePlayer}
          language={language}
        />
      )}

      {/* Surah Selection Modal */}
      {selectedReciter && (
        <SurahSelectorModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSelect={handleSurahSelect}
          reciterName={selectedReciter.name}
          action={selectedReciter.action}
          language={language}
        />
      )}
    </div>
  );
};

export default ReciterExplorer;
