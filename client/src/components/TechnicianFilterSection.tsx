import { Search, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryIconSlider } from "@/components/CategoryIconSlider";
import { ServiceSlider } from "@/components/ServiceSlider";
import { CATEGORIES } from "@shared/schema";
import { useState } from "react";

interface TechnicianFilterSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export function TechnicianFilterSection({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}: TechnicianFilterSectionProps) {
  const [selectedService, setSelectedService] = useState<string>('');

  const handleSubmit = () => {
    if (selectedService) {
      setSelectedCategory(selectedService);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 shadow-sm hover-elevate">
      {/* Title */}
      <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">Find Technicians</h2>

      {/* Search, Category and Submit Row */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-5">
        {/* Search Box */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input
            type="search"
            placeholder="Enter PIN code or city..."
            className="pl-10 pr-10 h-10 rounded-lg bg-slate-100 border border-slate-300 text-slate-900 text-sm placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-blue-500 shadow-sm hover:shadow-md transition-shadow"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-technician-search"
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-md hover:bg-slate-200"
            data-testid="button-voice-search-filter"
          >
            <Mic className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Category Dropdown */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger 
            className="w-full sm:w-48 h-10 rounded-lg bg-slate-100 border border-slate-300 text-slate-900 hover:shadow-md transition-shadow text-sm font-medium"
            data-testid="select-technician-category"
          >
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-slate-300">
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className="h-10 px-4 sm:px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
          data-testid="button-filter-submit"
        >
          Search
        </Button>
      </div>

      {/* Service Slider - Quick Access */}
      <div>
        <p className="text-xs sm:text-sm text-slate-600 mb-3 font-medium">Browse Services & Categories</p>
        <ServiceSlider
          selectedService={selectedService}
          onSelectService={setSelectedService}
        />
      </div>
    </div>
  );
}
