"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Command, ArrowRight, MapPin, DollarSign } from "lucide-react";
import { grants, Grant } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface IntelligentSearchProps {
  onSearchChange?: (query: string) => void;
  onGrantSelect?: (grant: Grant) => void;
}

export default function IntelligentSearch({
  onSearchChange,
  onGrantSelect,
}: IntelligentSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Filter grants based on query
  const filteredGrants = React.useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return grants.filter(
      (grant) =>
        grant.country.toLowerCase().includes(lowerQuery) ||
        grant.university.toLowerCase().includes(lowerQuery) ||
        grant.title.toLowerCase().includes(lowerQuery) ||
        grant.professor.toLowerCase().includes(lowerQuery) ||
        grant.skills.some((skill) => skill.toLowerCase().includes(lowerQuery))
    );
  }, [query]);

  // Notify parent of search changes
  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(query);
    }
  }, [query, onSearchChange]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || filteredGrants.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredGrants.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredGrants.length) % filteredGrants.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredGrants[selectedIndex]) {
          handleGrantSelect(filteredGrants[selectedIndex]);
        }
      } else if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredGrants, selectedIndex]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGrantSelect = (grant: Grant) => {
    if (onGrantSelect) {
      onGrantSelect(grant);
    }
    // Redirect to signup with intent
    router.push(`/auth/signup?intent=apply&id=${grant.id}`);
    setIsOpen(false);
    setQuery("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
    setSelectedIndex(0);
  };

  const handleInputFocus = () => {
    if (query && filteredGrants.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      {/* Main Search Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "group relative flex items-center rounded-2xl border border-white/20",
          "bg-white/5 backdrop-blur-xl px-6 py-4",
          "hover:border-teal-500/50 hover:bg-white/10 transition-all",
          "shadow-2xl",
          isOpen && "border-teal-500/50 bg-white/10"
        )}
      >
        <Search className="w-5 h-5 text-slate-400 mr-4 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="Search for scholarship opportunities..."
          className="flex-1 bg-transparent text-white placeholder:text-slate-400 outline-none text-lg"
        />
        <div className="ml-4 flex items-center gap-1 flex-shrink-0">
          <kbd className="px-2 py-1 text-xs font-semibold text-slate-400 bg-white/5 border border-white/10 rounded">
            <Command className="w-3 h-3 inline" />
          </kbd>
          <kbd className="px-2 py-1 text-xs font-semibold text-slate-400 bg-white/5 border border-white/10 rounded">
            K
          </kbd>
        </div>
      </motion.div>

      {/* Dropdown Results */}
      <AnimatePresence>
        {isOpen && filteredGrants.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto"
          >
            {filteredGrants.map((grant, index) => (
              <motion.div
                key={grant.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleGrantSelect(grant)}
                className={cn(
                  "px-6 py-4 cursor-pointer transition-all border-b border-white/5 last:border-b-0",
                  "hover:bg-white/10",
                  index === selectedIndex && "bg-white/15"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold text-sm">{grant.university}</h3>
                      {grant.tryout && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded">
                          ⚡ Tryout
                        </span>
                      )}
                    </div>
                    <p className="text-slate-300 text-xs mb-2 line-clamp-1">{grant.title}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {grant.country}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {grant.funding}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Results Message */}
      <AnimatePresence>
        {isOpen && query && filteredGrants.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-full mt-2 w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl p-6 text-center z-50"
          >
            <p className="text-slate-400 text-sm">No scholarships found for "{query}"</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

