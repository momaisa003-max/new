'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store/useAppStore';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  initialValue?: string;
}

export default function SearchBar({
  placeholder = 'Search products...',
  className = '',
  initialValue = '',
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const navigate = useAppStore((s) => s.navigate);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSearch = useCallback(() => {
    const trimmed = query.trim();
    if (trimmed) {
      navigate({ page: 'products', search: trimmed });
    }
  }, [query, navigate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="pl-9 pr-9 h-10 w-full bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-12 text-slate-400 hover:text-white"
        >
          <X className="size-4" />
        </button>
      )}
      <button
        onClick={handleSearch}
        className="absolute right-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
      >
        Go
      </button>
    </div>
  );
}
