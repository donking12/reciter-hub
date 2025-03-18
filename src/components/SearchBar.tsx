
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  placeholder: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onSearch,
  placeholder
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 max-w-md">
      <div className="flex">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="rounded-r-none border-green-light"
        />
        <Button 
          type="submit"
          className="rounded-l-none bg-green-primary hover:bg-green-dark"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
