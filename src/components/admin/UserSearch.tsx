"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserSearchProps {
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function UserSearch({ 
  placeholder = "Search users...", 
  className = "",
  defaultValue = "",
  value,
  onChange
}: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState(defaultValue);
  const router = useRouter();

  // Use controlled value if provided, otherwise use local state
  const currentValue = value !== undefined ? value : searchQuery;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // This reloads the page with the search query in the URL, triggering a new server-side fetch
    router.push(`/admin/users?q=${encodeURIComponent(currentValue)}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (onChange) {
      // Controlled mode - call parent onChange
      onChange(value);
    } else {
      // Uncontrolled mode - update local state
      setSearchQuery(value);
      
      // If input is cleared, trigger search with empty string
      if (value === "") {
        router.push("/admin/users");
      }
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={currentValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-0 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300 placeholder-slate-500 dark:placeholder-slate-400"
        />
      </div>
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors opacity-0 group-hover:opacity-100"
      >
        Search
      </button>
    </form>
  );
} 