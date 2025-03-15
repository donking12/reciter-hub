
export interface Moshaf {
  id: number;
  name: string;
  server: string;
  surah_total: number;
  moshaf_type: number;
  surah_list: string;
}

export interface Reciter {
  id: number;
  name: string;
  letter: string;
  moshaf: Moshaf[];
}

export interface RecitersResponse {
  reciters: Reciter[];
}

export interface FilterParams {
  language?: string;
  reciter?: number;
  rewaya?: number;
  sura?: number;
}

export const availableLanguages = [
  { code: 'ar', name: 'العربية' },
  { code: 'eng', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'ru', name: 'Русский' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'cn', name: '中文' },
  { code: 'th', name: 'ไทย' },
  { code: 'ur', name: 'اردو' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'bs', name: 'Bosanski' },
  { code: 'ug', name: 'ئۇيغۇرچە' },
  { code: 'fa', name: 'فارسی' },
  { code: 'tg', name: 'Тоҷикӣ' },
  { code: 'ml', name: 'മലയാളം' },
  { code: 'tl', name: 'Tagalog' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'pt', name: 'Português' },
  { code: 'ha', name: 'Hausa' },
  { code: 'sw', name: 'Kiswahili' }
];
