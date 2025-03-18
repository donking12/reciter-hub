
export const getTranslations = (language: "ar" | "en") => ({
  siteTitle: language === "ar" ? "الأصوات القرآنية" : "Quranic Recitations",
  searchPlaceholder: language === "ar" ? "ابحث عن قارئ..." : "Search for a reciter...",
  loading: language === "ar" ? "جاري التحميل..." : "Loading...",
  exploreReciters: language === "ar" ? "استكشف القراء" : "Explore Reciters",
  viewRecitersList: language === "ar" ? "عرض قائمة القراء" : "View Reciters List",
  classicVersion: language === "ar" ? "النسخة الكلاسيكية" : "Classic Version",
  noResults: language === "ar" ? "لا توجد نتائج مطابقة لبحثك. يرجى تجربة كلمات أخرى." : "No matching results found. Try different search terms.",
  footer: language === "ar" ? "الأصوات القرآنية - استمع إلى تلاوات القرآن الكريم من مختلف القراء" : "Quranic Recitations - Listen to Quran recitations from various reciters",
  listen: language === "ar" ? "استماع" : "Listen",
  download: language === "ar" ? "تحميل" : "Download",
  selectSurah: language === "ar" ? "اختر سورة" : "Select a Surah",
  forListening: language === "ar" ? "للاستماع" : "to listen",
  forDownload: language === "ar" ? "للتحميل" : "to download",
  from: language === "ar" ? "من" : "from",
  surahPrefix: language === "ar" ? "سورة" : "Surah"
});
