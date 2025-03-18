
import { useState, useEffect } from "react";
import { FilterParams, Reciter } from "@/types";
import { fetchReciters, getMockReciters } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

export const useReciters = (initialLanguage: "ar" | "en" = "ar") => {
  const { toast } = useToast();
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [filteredReciters, setFilteredReciters] = useState<Reciter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [language, setLanguage] = useState<"ar" | "en">(initialLanguage);

  useEffect(() => {
    loadReciters({ language });
  }, [language]);

  useEffect(() => {
    if (reciters.length > 0) {
      filterReciters();
    }
  }, [searchTerm, reciters]);

  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const loadReciters = async (params: FilterParams) => {
    setIsLoading(true);
    try {
      // Try to get from localStorage first for immediate display
      try {
        const cachedData = localStorage.getItem(`reciters_${params.language}`);
        if (cachedData) {
          const data = JSON.parse(cachedData);
          setReciters(data.reciters);
          setFilteredReciters(data.reciters);
          console.log("Using cached data while fetching fresh data");
        }
      } catch (err) {
        console.warn("Could not read cached reciters:", err);
      }

      // Fetch fresh data
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
      
      // Try to get from localStorage if not already done
      let usedCacheData = false;
      try {
        const cachedData = localStorage.getItem(`reciters_${params.language}`);
        if (cachedData && reciters.length === 0) {
          const data = JSON.parse(cachedData);
          setReciters(data.reciters);
          setFilteredReciters(data.reciters);
          usedCacheData = true;
          console.log("Using cached data after fetch failure");
        }
      } catch (err) {
        console.warn("Could not read cached reciters:", err);
      }
      
      // If no cached data, use mock data
      if (!usedCacheData && reciters.length === 0) {
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
      }
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
  };
  
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  return {
    reciters,
    filteredReciters,
    isLoading,
    searchTerm,
    language,
    loadReciters,
    filterReciters,
    handleLanguageChange,
    handleSearchChange
  };
};
