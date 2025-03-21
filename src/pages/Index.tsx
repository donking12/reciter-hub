
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { FilterParams, Reciter } from "@/types";
import { fetchReciters } from "@/services/api";
import QuranHeader from "@/components/QuranHeader";
import FilterSection from "@/components/FilterSection";
import ReciterCard from "@/components/ReciterCard";
import { Loader2, BookOpenText, PanelRightOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const { toast } = useToast();
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterParams>({ language: "ar" });

  useEffect(() => {
    loadReciters(filters);
  }, []);

  const loadReciters = async (filterParams: FilterParams) => {
    setIsLoading(true);
    try {
      // Try to get from localStorage first for immediate display
      try {
        const cachedData = localStorage.getItem(`reciters_${filterParams.language}`);
        if (cachedData) {
          const data = JSON.parse(cachedData);
          
          // Apply client-side filtering for reciter name if provided
          let filteredReciters = data.reciters;
          if (filterParams.reciterName) {
            const searchName = filterParams.reciterName.toLowerCase();
            filteredReciters = data.reciters.filter(reciter => 
              reciter.name.toLowerCase().includes(searchName)
            );
          }
          
          setReciters(filteredReciters);
          console.log("Using cached data while fetching fresh data");
        }
      } catch (err) {
        console.warn("Could not read cached reciters:", err);
      }

      const data = await fetchReciters(filterParams);
      
      // Apply client-side filtering for reciter name if provided
      let filteredReciters = data.reciters;
      if (filterParams.reciterName) {
        const searchName = filterParams.reciterName.toLowerCase();
        filteredReciters = data.reciters.filter(reciter => 
          reciter.name.toLowerCase().includes(searchName)
        );
      }
      
      setReciters(filteredReciters);
      
      if (filteredReciters.length === 0) {
        toast({
          title: "لا توجد نتائج",
          description: "لم يتم العثور على قراء بالمعايير المحددة. يرجى تجربة معايير أخرى.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "تم تحميل البيانات",
          description: `تم العثور على ${filteredReciters.length} قراء.`,
        });
      }
    } catch (error) {
      console.error("Failed to load reciters:", error);
      toast({
        title: "خطأ في التحميل",
        description: "فشل في تحميل بيانات القراء. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: FilterParams) => {
    setFilters(newFilters);
    loadReciters(newFilters);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <QuranHeader />
      
      <main className="container py-8 flex-1">
        <div className="space-y-8">
          <section className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-quran-dark">
                استكشف قراء القرآن الكريم (النسخة الكلاسيكية)
              </h2>
              <div className="flex gap-2">
                <Button asChild className="bg-quran-accent hover:bg-quran-accent/90 text-white">
                  <Link to="/reciters" className="flex items-center gap-2">
                    <BookOpenText className="h-5 w-5" />
                    عرض قائمة القراء
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-green-primary text-green-primary hover:bg-green-light/30">
                  <Link to="/" className="flex items-center gap-2">
                    <PanelRightOpen className="h-5 w-5" />
                    العودة إلى الصفحة الرئيسية
                  </Link>
                </Button>
              </div>
            </div>
            <FilterSection onFilterChange={handleFilterChange} isLoading={isLoading} />
          </section>
          
          <section>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-quran-primary" />
                  <p className="mt-4 text-quran-secondary">جاري تحميل البيانات...</p>
                </div>
              </div>
            ) : reciters.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {reciters.map((reciter) => (
                  <ReciterCard key={reciter.id} reciter={reciter} language="ar" />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-quran-secondary text-lg">
                  لا توجد نتائج. يرجى تعديل معايير البحث والمحاولة مرة أخرى.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
      
      <footer className="bg-quran-primary text-white py-4">
        <div className="container text-center">
          <p className="text-sm">
            الأصوات القرآنية - استمع إلى تلاوات القرآن الكريم من مختلف القراء
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
