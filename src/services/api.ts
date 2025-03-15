
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
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching reciters:", error);
    throw error;
  }
};
