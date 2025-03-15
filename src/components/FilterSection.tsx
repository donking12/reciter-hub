
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterParams, availableLanguages } from "@/types";
import { Search, Filter, RefreshCw } from "lucide-react";

interface FilterSectionProps {
  onFilterChange: (filters: FilterParams) => void;
  isLoading: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({ onFilterChange, isLoading }) => {
  const [filters, setFilters] = useState<FilterParams>({
    language: "ar",
    reciter: undefined,
    rewaya: undefined,
    sura: undefined,
  });

  const handleChange = (name: keyof FilterParams, value: string) => {
    const newValue = value === "" ? undefined : 
      name === "language" ? value : parseInt(value);
    
    setFilters(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const handleReset = () => {
    setFilters({
      language: "ar",
      reciter: undefined,
      rewaya: undefined,
      sura: undefined,
    });
    onFilterChange({ language: "ar" });
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-quran-gold/20 shadow-md">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language" className="text-quran-dark font-medium">اللغة</Label>
              <Select 
                value={filters.language || "ar"} 
                onValueChange={(value) => handleChange("language", value)}
              >
                <SelectTrigger id="language" className="border-quran-secondary/30">
                  <SelectValue placeholder="اختر لغة" />
                </SelectTrigger>
                <SelectContent>
                  {availableLanguages.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reciter" className="text-quran-dark font-medium">رقم القارئ</Label>
              <Input
                id="reciter"
                type="number"
                placeholder="مثال: 168"
                value={filters.reciter || ""}
                onChange={(e) => handleChange("reciter", e.target.value)}
                className="border-quran-secondary/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rewaya" className="text-quran-dark font-medium">رقم الرواية</Label>
              <Input
                id="rewaya"
                type="number"
                placeholder="مثال: 1"
                value={filters.rewaya || ""}
                onChange={(e) => handleChange("rewaya", e.target.value)}
                className="border-quran-secondary/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sura" className="text-quran-dark font-medium">رقم السورة</Label>
              <Input
                id="sura"
                type="number"
                placeholder="مثال: 18"
                value={filters.sura || ""}
                onChange={(e) => handleChange("sura", e.target.value)}
                className="border-quran-secondary/30"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleReset}
              className="border-quran-secondary text-quran-secondary hover:bg-quran-secondary/10"
              disabled={isLoading}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              إعادة تعيين
            </Button>
            <Button 
              type="submit"
              className="bg-quran-primary hover:bg-quran-primary/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>جاري البحث...</>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  تطبيق الفلتر
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FilterSection;
