
import { FilterParams, RecitersResponse } from "@/types";

const BASE_URL = "https://mp3quran.net/api/v3";

export const fetchReciters = async (params: FilterParams = { language: "ar" }): Promise<RecitersResponse> => {
  try {
    const url = new URL(`${BASE_URL}/reciters`);
    
    if (params.language) url.searchParams.append("language", params.language);
    if (params.reciter) url.searchParams.append("reciter", params.reciter.toString());
    if (params.rewaya) url.searchParams.append("rewaya", params.rewaya.toString());
    if (params.sura) url.searchParams.append("sura", params.sura.toString());
    
    console.log("Fetching reciters with URL:", url.toString());
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // Reduced timeout to 5 seconds
    
    const response = await fetch(url.toString(), { 
      signal: controller.signal,
      cache: "force-cache" // Cache response to improve performance
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache this data in localStorage for future use
    try {
      localStorage.setItem(`reciters_${params.language}`, JSON.stringify(data));
    } catch (err) {
      console.warn("Could not save reciters to localStorage:", err);
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching reciters:", error);
    
    // Try to get from localStorage first
    try {
      const cachedData = localStorage.getItem(`reciters_${params.language}`);
      if (cachedData) {
        console.log("Using cached reciter data");
        return JSON.parse(cachedData);
      }
    } catch (err) {
      console.warn("Could not read cached reciters:", err);
    }
    
    // If no cached data, use mock data
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Connection timed out. Please try again later.');
    }
    
    throw error;
  }
};

// Function to return mock data when API is not available
export const getMockReciters = (): RecitersResponse => {
  return {
    reciters: [
      {
        id: 1,
        name: "إبراهيم الأخضر",
        letter: "ا",
        moshaf: [
          {
            id: 1,
            name: "رواية حفص عن عاصم - مرتل",
            server: "https://server6.mp3quran.net/akdr/",
            surah_total: 114,
            moshaf_type: 116,
            surah_list: "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114"
          }
        ]
      },
      {
        id: 2,
        name: "ماهر المعيقلي",
        letter: "م",
        moshaf: [
          {
            id: 2,
            name: "رواية حفص عن عاصم - مرتل",
            server: "https://server10.mp3quran.net/maher/",
            surah_total: 114,
            moshaf_type: 116,
            surah_list: "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114"
          }
        ]
      },
      {
        id: 3,
        name: "عبد الباسط عبد الصمد",
        letter: "ع",
        moshaf: [
          {
            id: 3,
            name: "رواية حفص عن عاصم - مرتل",
            server: "https://server7.mp3quran.net/basit/",
            surah_total: 114,
            moshaf_type: 116,
            surah_list: "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114"
          }
        ]
      },
      {
        id: 4,
        name: "سعد الغامدي",
        letter: "س",
        moshaf: [
          {
            id: 4,
            name: "رواية حفص عن عاصم - مرتل",
            server: "https://server11.mp3quran.net/ghamadi/",
            surah_total: 114,
            moshaf_type: 116,
            surah_list: "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114"
          }
        ]
      },
      {
        id: 5,
        name: "سعود الشريم",
        letter: "س",
        moshaf: [
          {
            id: 5,
            name: "رواية حفص عن عاصم - مرتل",
            server: "https://server7.mp3quran.net/shuraym/",
            surah_total: 114,
            moshaf_type: 116,
            surah_list: "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114"
          }
        ]
      }
    ]
  };
};
