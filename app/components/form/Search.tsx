'use client';

import { Search as SearchIcon } from "lucide-react";

type SearchProps = {
  onSearchChange: (value: string) => void;
};

export default function Search({ onSearchChange }: SearchProps) {
  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <input
        type="text"
        placeholder="Search by title or category..."
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition"
      />
    </div>
  );
}
