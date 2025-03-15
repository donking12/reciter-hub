
import { FilterParams, RecitersResponse } from "@/types";

const BASE_URL = "https://mp3quran.net/api/v3";

export const fetchReciters = async (params: FilterParams = {}): Promise<RecitersResponse> => {
  try {
    const url = new URL(`${BASE_URL}/reciters`);
    
    if (params.language) url.searchParams.append("language", params.language);
    if (params.reciter) url.searchParams.append("reciter", params.reciter.toString());
    if (params.rewaya) url.searchParams.append("rewaya", params.rewaya.toString());
    if (params.sura) url.searchParams.append("sura", params.sura.toString());
    
    console.log("Fetching reciters with URL:", url.toString());
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 seconds timeout
    
    const response = await fetch(url.toString(), { 
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching reciters:", error);
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
            surah_list: "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20"
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
            surah_list: "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20"
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
            surah_list: "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20"
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
            surah_list: "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20"
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
            surah_list: "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20"
          }
        ]
      }
    ]
  };
};
