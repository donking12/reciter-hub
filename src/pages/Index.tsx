
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { FilterParams, Reciter } from "@/types";
import { fetchReciters } from "@/services/api";
import QuranHeader from "@/components/QuranHeader";
import FilterSection from "@/components/FilterSection";
import ReciterCard from "@/components/ReciterCard";
import { Loader2 } from "lucide-react";

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
      const data = await fetchReciters(filterParams);
      setReciters(data.reciters);
      
      if (data.reciters.length === 0) {
        toast({
          title: "لا توجد نتائج",
          description: "لم يتم العثور على قراء بالمعايير المحددة. يرجى تجربة معايير أخرى.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "تم تحميل البيانات",
          description: `تم العثور على ${data.reciters.length} قراء.`,
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
            <h2 className="text-2xl font-bold text-center text-quran-dark">
              استكشف قراء القرآن الكريم
            </h2>
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
                  <ReciterCard key={reciter.id} reciter={reciter} />
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
            رسيتر هاب - استمع إلى تلاوات القرآن الكريم من مختلف القراء
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
