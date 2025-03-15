
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { FilterParams, Reciter } from "@/types";
import { fetchReciters, getMockReciters } from "@/services/api";
import QuranHeader from "@/components/QuranHeader";
import FilterSection from "@/components/FilterSection";
import ReciterCard from "@/components/ReciterCard";
import { Loader2, BookOpenText, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const RecitersPage = () => {
  const { toast } = useToast();
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [filters, setFilters] = useState<FilterParams>({ language: "ar" });
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    loadReciters(filters);
  }, []);

  const loadReciters = async (filterParams: FilterParams) => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage("");
    
    try {
      let data;
      
      if (useMockData) {
        // Use mock data if API connection failed previously
        data = getMockReciters();
        toast({
          title: "تم استخدام بيانات محلية",
          description: "نظراً لتعذر الاتصال بالخادم، تم استخدام بيانات محلية للعرض",
          variant: "default",
        });
      } else {
        data = await fetchReciters(filterParams);
        toast({
          title: "تم تحميل البيانات",
          description: `تم العثور على ${data.reciters.length} قارئ`,
          variant: "default",
        });
      }
      
      setReciters(data.reciters);
      
      if (data.reciters.length === 0) {
        toast({
          title: "لا توجد نتائج",
          description: "لم يتم العثور على قراء بالمعايير المحددة. يرجى تجربة معايير أخرى.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to load reciters:", error);
      
      setIsError(true);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("حدث خطأ غير معروف أثناء تحميل البيانات");
      }
      
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

  const toggleDataSource = () => {
    setUseMockData(prev => !prev);
    loadReciters(filters);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <QuranHeader />
      
      <main className="container py-8 flex-1">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <BookOpenText className="h-6 w-6 text-quran-accent" />
            <h1 className="text-3xl font-bold text-quran-dark">قائمة القراء</h1>
          </div>
          <Button variant="outline" asChild>
            <Link to="/" className="flex items-center gap-2">
              العودة إلى الصفحة الرئيسية
            </Link>
          </Button>
        </div>
        
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-quran-dark">
              تصفح القراء حسب المعايير
            </h2>
            <FilterSection onFilterChange={handleFilterChange} isLoading={isLoading} />
            
            {isError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                  <div>
                    <h3 className="text-lg font-medium text-red-800">خطأ في الاتصال</h3>
                    <p className="text-red-700 mt-1">{errorMessage || "فشل الاتصال بخادم البيانات"}</p>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="mt-3 bg-white border-red-300 text-red-700 hover:bg-red-50"
                      onClick={toggleDataSource}
                    >
                      {useMockData ? "حاول الاتصال بالخادم" : "استخدم البيانات المحلية"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
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

export default RecitersPage;
