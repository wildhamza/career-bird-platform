"use client";

import { grants } from "@/lib/data";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap, Filter, ChevronDown, X } from "lucide-react";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";

interface GrantFeedProps {
  limit?: number; // Limit number of grants to display (undefined = show all)
}

export default function GrantFeed({ limit = 6 }: GrantFeedProps) {
  const searchParams = useSearchParams();
  const initialCountry = searchParams?.get('country') || 'All';
  const [degreeFilter, setDegreeFilter] = useState<'MS' | 'PhD' | 'All'>('All');
  const [countryFilter, setCountryFilter] = useState<string>(initialCountry);
  const [fundingTypeFilter, setFundingTypeFilter] = useState<string>('All');
  const [fieldFilter, setFieldFilter] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(initialCountry !== 'All');

  // Get unique values for filters
  const countries = useMemo(() => {
    const unique = Array.from(new Set(grants.map(g => g.country))).sort();
    return unique;
  }, []);

  const fundingTypes = useMemo(() => {
    const unique = Array.from(new Set(grants.map(g => g.type))).sort();
    return unique;
  }, []);

  const fields = useMemo(() => {
    const unique = Array.from(new Set(grants.map(g => g.field))).sort();
    return unique;
  }, []);

  // Filter grants based on selected filters
  const filteredGrants = useMemo(() => {
    return grants.filter(grant => {
      if (degreeFilter !== 'All' && grant.degree !== degreeFilter) return false;
      if (countryFilter !== 'All' && grant.country !== countryFilter) return false;
      if (fundingTypeFilter !== 'All' && grant.type !== fundingTypeFilter) return false;
      if (fieldFilter !== 'All' && grant.field !== fieldFilter) return false;
      return true;
    });
  }, [degreeFilter, countryFilter, fundingTypeFilter, fieldFilter]);

  // Display grants (limited if limit is set)
  const displayGrants = limit ? filteredGrants.slice(0, limit) : filteredGrants;

  const hasActiveFilters = degreeFilter !== 'All' || countryFilter !== 'All' || fundingTypeFilter !== 'All' || fieldFilter !== 'All';

  const clearFilters = () => {
    setDegreeFilter('All');
    setCountryFilter('All');
    setFundingTypeFilter('All');
    setFieldFilter('All');
  };

  return (
    <section className="relative py-24 bg-[#0B0F19] overflow-hidden">
      {/* Background Gradients for Atmosphere */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Live Opportunities <span className="text-teal-500">.</span>
            </h2>
            <p className="text-slate-400 max-w-xl text-lg">
              Real-time funding detected from 50+ global institutions.
              <br />
              <span className="text-teal-400 text-sm font-mono mt-2 inline-block">
                ● Live Feed Active
              </span>
            </p>
          </div>
          <Link 
            href="/auth/signup"
            className="text-white border border-slate-700 hover:border-teal-500 hover:text-teal-400 px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2"
          >
            View All 500+ Grants <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Degree Level Toggle */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-slate-900/60 backdrop-blur-sm border border-white/10 rounded-full p-1">
            <button
              onClick={() => setDegreeFilter('All')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                degreeFilter === 'All'
                  ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Degrees
            </button>
            <button
              onClick={() => setDegreeFilter('MS')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                degreeFilter === 'MS'
                  ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Masters (MS/MPhil)
            </button>
            <button
              onClick={() => setDegreeFilter('PhD')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                degreeFilter === 'PhD'
                  ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              PhD (Doctorate)
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900/60 backdrop-blur-sm border border-white/10 rounded-full text-sm text-slate-300 hover:border-teal-500/30 hover:text-teal-400 transition-all"
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-teal-500/20 text-teal-400 px-2 py-0.5 rounded-full text-xs">
                Active
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          )}

          {/* Filter Dropdowns */}
          {showFilters && (
            <div className="w-full flex flex-wrap gap-4 mt-4 p-4 bg-slate-900/60 backdrop-blur-sm border border-white/10 rounded-2xl">
              {/* Country Filter */}
              <div className="relative flex-1 min-w-[200px]">
                <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider">Country</label>
                <div className="relative">
                  <select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-full text-sm text-white appearance-none hover:border-teal-500/30 focus:border-teal-500/50 focus:outline-none transition-all cursor-pointer"
                  >
                    <option value="All">All Countries</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Funding Type Filter */}
              <div className="relative flex-1 min-w-[200px]">
                <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider">Funding Type</label>
                <div className="relative">
                  <select
                    value={fundingTypeFilter}
                    onChange={(e) => setFundingTypeFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-full text-sm text-white appearance-none hover:border-teal-500/30 focus:border-teal-500/50 focus:outline-none transition-all cursor-pointer"
                  >
                    <option value="All">All Funding Types</option>
                    {fundingTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Field Filter */}
              <div className="relative flex-1 min-w-[200px]">
                <label className="block text-xs text-slate-400 mb-2 uppercase tracking-wider">Field</label>
                <div className="relative">
                  <select
                    value={fieldFilter}
                    onChange={(e) => setFieldFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-full text-sm text-white appearance-none hover:border-teal-500/30 focus:border-teal-500/50 focus:outline-none transition-all cursor-pointer"
                  >
                    <option value="All">All Fields</option>
                    {fields.map(field => (
                      <option key={field} value={field}>{field}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        {hasActiveFilters && (
          <div className="mb-6 text-sm text-slate-400">
            Showing {filteredGrants.length} of {grants.length} opportunities
          </div>
        )}

        {/* The Grid */}
        {displayGrants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayGrants.map((grant) => (
              <div 
                key={grant.id}
                className="group relative bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:border-teal-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/10 hover:-translate-y-1"
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    {/* Fake Logo Placeholder with Initials */}
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-slate-200 font-bold text-sm">
                      {grant.university.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200 leading-tight">
                        {grant.university}
                      </h4>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        {grant.country}
                        <CheckCircle2 className="w-3 h-3 text-teal-500/70" />
                      </span>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  {grant.tryout ? (
                     <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                       <Zap className="w-3 h-3" /> Fast Track
                     </span>
                  ) : (
                     <span className="bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-1 rounded text-xs font-medium">
                       Verified
                     </span>
                  )}
                </div>
                
                {/* Degree Badge */}
                <div className="mb-3">
                  <span className="inline-block px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-xs font-medium">
                    {grant.degree === 'PhD' ? 'PhD' : 'Masters'}
                  </span>
                  <span className="inline-block ml-2 px-2 py-1 bg-slate-700/50 text-slate-300 border border-slate-600/30 rounded text-xs font-medium">
                    {grant.field}
                  </span>
                </div>
                
                {/* Job Title */}
                <h3 className="text-xl font-bold text-white mb-2 leading-snug group-hover:text-teal-400 transition-colors">
                  {grant.title}
                </h3>
                
                {/* Professor Name */}
                <div className="text-sm text-slate-400 mb-6 font-mono">
                  Lab Lead: <span className="text-slate-300">{grant.professor}</span>
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {grant.skills.slice(0,3).map((tag) => (
                    <span key={tag} className="text-xs bg-white/5 text-slate-300 px-3 py-1 rounded-full border border-white/5 group-hover:border-white/10 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer / Funding */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Funding</div>
                    <div className="text-lg font-bold text-teal-200">
                      {grant.funding.includes("$") || grant.funding.includes("€") ? grant.funding.split(' ')[0] : "Full"}
                      <span className="text-xs font-normal text-slate-500 ml-1">/ year</span>
                    </div>
                  </div>
                  <Link 
                    href="/auth/signup"
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white group-hover:bg-teal-500 group-hover:text-black transition-all"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">No opportunities match your filters.</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-teal-400 hover:text-teal-300 transition-colors"
            >
              Clear filters to see all opportunities
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
