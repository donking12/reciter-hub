
import React from "react";
import { Book, Mic2 } from "lucide-react";

const QuranHeader: React.FC = () => {
  return (
    <header className="w-full py-6 border-b border-quran-gold/20">
      <div className="container">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center gap-3">
            <Mic2 className="h-10 w-10 text-quran-accent" />
            <h1 className="text-4xl md:text-5xl font-bold text-quran-primary">
              <span className="text-quran-accent">رسيتر</span> هاب
            </h1>
          </div>
          
          <p className="text-quran-secondary text-lg text-center max-w-2xl">
            منصة للوصول إلى مجموعة متنوعة من القراء بتلاوات متعددة للقرآن الكريم
          </p>
          
          <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
            <Book className="h-5 w-5 text-quran-primary" />
            <span className="text-sm text-quran-dark">
              استكشف القراء والروايات والسور المتاحة
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default QuranHeader;
