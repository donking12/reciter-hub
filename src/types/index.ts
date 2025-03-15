
export interface Reciter {
  id: number;
  name: string;
  letter?: string;
  rewaya?: number;
  moshaf: Moshaf[];
}

export interface Moshaf {
  id: number;
  name: string;
  format?: string;
  server: string;
  surah_total: number;
  moshaf_type?: number;
  surah_list: string;
}

export interface ApiResponse {
  status: boolean;
  code: number;
  message: string;
  reciters: Reciter[];
}

export interface RecitersResponse {
  reciters: Reciter[];
}

// Update the FilterParams interface to include reciterName
export interface FilterParams {
  language: string;
  reciter?: number;
  reciterName?: string;
  rewaya?: number;
  sura?: number;
}

export const availableLanguages = [
  { code: 'ar', name: 'العربية' },
  { code: 'en', name: 'English' },
];
