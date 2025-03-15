
import React, { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { FilterParams, Reciter } from "@/types";
import { fetchReciters, getMockReciters } from "@/services/api";
import { Loader2, BookOpenText, Search, X, Volume2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const ReciterExplorer = () => {
  const { toast } = useToast();
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [filteredReciters, setFilteredReciters] = useState<Reciter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [language, setLanguage] = useState<"ar" | "en">("en");
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<{
    url: string;
    surahName: string;
    reciterName: string;
  } | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedReciter, setSelectedReciter] = useState<{
    server: string;
    name: string;
    action: "listen" | "download";
  } | null>(null);

  useEffect(() => {
    loadReciters({ language });
  }, [language]);

  useEffect(() => {
    if (reciters.length > 0) {
      filterReciters();
    }
  }, [searchTerm, reciters]);

  const loadReciters = async (params: FilterParams) => {
    setIsLoading(true);
    try {
      const data = await fetchReciters(params);
      setReciters(data.reciters);
      setFilteredReciters(data.reciters);
      
      toast({
        title: language === "ar" ? "تم تحميل البيانات" : "Data loaded successfully",
        description: language === "ar" 
          ? `تم العثور على ${data.reciters.length} قارئ` 
          : `Found ${data.reciters.length} reciters`,
      });
    } catch (error) {
      console.error("Failed to load reciters:", error);
      
      // Use mock data as fallback
      const mockData = getMockReciters();
      setReciters(mockData.reciters);
      setFilteredReciters(mockData.reciters);
      
      toast({
        title: language === "ar" ? "خطأ في التحميل" : "Error loading data",
        description: language === "ar"
          ? "تم استخدام البيانات المحلية كبديل"
          : "Using local data as fallback",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterReciters = () => {
    if (!searchTerm.trim()) {
      setFilteredReciters(reciters);
      return;
    }
    
    const term = searchTerm.toLowerCase().trim();
    const filtered = reciters.filter(reciter => 
      reciter.name.toLowerCase().includes(term)
    );
    
    setFilteredReciters(filtered);
  };

  const handleLanguageChange = (newLang: "ar" | "en") => {
    if (newLang === language) return;
    setLanguage(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
  };

  const openSurahSelector = (server: string, name: string, action: "listen" | "download") => {
    setSelectedReciter({ server, name, action });
    setShowModal(true);
  };

  const handleSurahSelect = (surahNumber: number) => {
    if (!selectedReciter) return;
    
    const paddedNumber = surahNumber.toString().padStart(3, '0');
    const audioUrl = `${selectedReciter.server}${paddedNumber}.mp3`;
    
    if (selectedReciter.action === "listen") {
      playAudio(audioUrl, `Surah ${surahNumber}`, selectedReciter.name);
    } else {
      downloadAudio(audioUrl, `${selectedReciter.name} - Surah ${surahNumber}.mp3`);
    }
    
    setShowModal(false);
  };

  const playAudio = (url: string, surahName: string, reciterName: string) => {
    setCurrentAudio({ url, surahName, reciterName });
    setShowPlayer(true);
    
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play().catch(err => {
        console.error("Error playing audio:", err);
        toast({
          title: language === "ar" ? "خطأ في تشغيل الصوت" : "Error playing audio",
          description: language === "ar"
            ? "فشل في تشغيل الملف الصوتي"
            : "Failed to play the audio file",
          variant: "destructive",
        });
      });
    }
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

  // List of surahs
  const surahs = [
    "Al-Fatihah", "Al-Baqarah", "Al-Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus",
    "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Ta-Ha",
    "Al-Anbiya", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum",
    "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir",
    "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf",
    "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadilah", "Al-Hashr", "Al-Mumtahinah",
    "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij",
    "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddathir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "Abasa",
    "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad",
    "Ash-Shams", "Al-Layl", "Ad-Duha", "Ash-Sharh", "At-Tin", "Al-Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-Adiyat",
    "Al-Qari'ah", "At-Takathur", "Al-Asr", "Al-Humazah", "Al-Fil", "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr",
    "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-green-background">
      {/* Header */}
      <header className="bg-green-primary py-6 shadow-md text-white">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">
              {language === "ar" ? "قراء القرآن الكريم" : "Quran Reciters"}
            </h1>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex-1 max-w-md">
                <div className="flex">
                  <Input
                    type="text"
                    placeholder={language === "ar" ? "ابحث عن قارئ..." : "Search for a reciter..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="rounded-r-none border-green-light"
                  />
                  <Button 
                    className="rounded-l-none bg-green-primary hover:bg-green-dark"
                    onClick={filterReciters}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex border border-green-light rounded-md overflow-hidden">
                <Button
                  variant="ghost"
                  className={`px-3 py-1 h-9 ${language === "ar" ? "bg-green-dark text-white" : ""}`}
                  onClick={() => handleLanguageChange("ar")}
                >
                  العربية
                </Button>
                <Button
                  variant="ghost"
                  className={`px-3 py-1 h-9 ${language === "en" ? "bg-green-dark text-white" : ""}`}
                  onClick={() => handleLanguageChange("en")}
                >
                  English
                </Button>
              </div>
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
              {language === "ar" ? "استكشف القراء" : "Explore Reciters"}
            </h2>
          </div>
          
          <Button variant="outline" asChild className="border-green-primary text-green-primary hover:bg-green-light/30">
            <Link to="/">
              {language === "ar" ? "العودة إلى الصفحة الرئيسية" : "Back to Home"}
            </Link>
          </Button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-green-primary" />
              <p className="mt-4 text-green-primary">
                {language === "ar" ? "جاري التحميل..." : "Loading..."}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Reciters Grid */}
            {filteredReciters.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredReciters.map((reciter) => {
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
                              {language === "ar" ? "عدد السور:" : "Surahs:"} {moshaf.surah_total}
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
                          onClick={() => openSurahSelector(serverUrl, reciter.name, "listen")}
                        >
                          <Volume2 className="mr-1 h-4 w-4" />
                          {language === "ar" ? "استماع" : "Listen"}
                        </Button>
                        <Button 
                          variant="outline"
                          className="flex-1 border-green-primary text-green-primary hover:bg-green-light/30"
                          onClick={() => openSurahSelector(serverUrl, reciter.name, "download")}
                        >
                          <Download className="mr-1 h-4 w-4" />
                          {language === "ar" ? "تحميل" : "Download"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  {language === "ar" 
                    ? "لا توجد نتائج مطابقة لبحثك. يرجى تجربة كلمات أخرى." 
                    : "No matching results found. Try different search terms."}
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white py-4 border-t border-green-light">
        <div className="container text-center">
          <p className="text-gray-600 text-sm">
            {language === "ar" 
              ? "تم إنشاؤه باستخدام API من" 
              : "Created using API from"} 
            <a 
              href="https://mp3quran.net" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-primary hover:underline ml-1"
            >
              mp3quran.net
            </a>
          </p>
        </div>
      </footer>

      {/* Audio Player */}
      {currentAudio && (
        <div 
          className={`fixed bottom-0 left-0 w-full bg-white shadow-lg p-4 transition-transform duration-300 flex items-center gap-4 ${
            showPlayer ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <audio ref={audioRef} controls className="flex-1" onEnded={() => setShowPlayer(false)} />
          
          <div className="flex-1 truncate">
            <p className="font-medium text-green-darker truncate">
              {currentAudio.reciterName} - {currentAudio.surahName}
            </p>
          </div>
          
          <Button variant="ghost" size="icon" onClick={closePlayer}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Surah Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-green-darker">
                {language === "ar" 
                  ? `اختر سورة ${selectedReciter?.action === "listen" ? "للاستماع" : "للتحميل"} من ${selectedReciter?.name}`
                  : `Select a Surah to ${selectedReciter?.action === "listen" ? "listen" : "download"} from ${selectedReciter?.name}`}
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Array.from({ length: 114 }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  className="p-3 bg-gray-50 hover:bg-green-primary hover:text-white rounded-md text-center transition-colors flex flex-col items-center"
                  onClick={() => handleSurahSelect(num)}
                >
                  <span className="font-bold text-lg">{num.toString().padStart(3, '0')}</span>
                  <span className="text-sm">{surahs[num - 1]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReciterExplorer;
