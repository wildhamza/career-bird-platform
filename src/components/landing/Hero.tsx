"use client";

import React, { useState, useRef, Suspense } from "react";
import { GlobeMethods } from "react-globe.gl";
import Globe3D from "./Globe3D";
import IntelligentSearch from "./IntelligentSearch";
import { Grant } from "@/lib/data";
import { motion } from "framer-motion";

function GlobeFallback() {
  return (
    <div className="relative h-full w-full rounded-full bg-gradient-to-br from-slate-900 to-black border border-slate-800 shadow-2xl">
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(6,182,212,0.1),transparent)]"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-32 w-32 rounded-full border border-teal-500/20 bg-teal-500/5"></div>
      </div>
    </div>
  );
}

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const globeRef = useRef<GlobeMethods | null>(null);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleGrantSelect = (grant: Grant) => {
    // Globe will automatically react to searchQuery changes
    setSearchQuery(grant.country);
  };

  const handleGlobeReady = (ref: GlobeMethods) => {
    globeRef.current = ref;
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Globe - Z-Index: 0 */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#0B0F19]" />
        <Suspense fallback={<GlobeFallback />}>
          <div className="h-full w-full" style={{ minHeight: '100vh' }}>
            <Globe3D searchQuery={searchQuery} onGlobeReady={handleGlobeReady} />
          </div>
        </Suspense>
      </div>

      {/* Content Layer - Z-Index: 10 */}
      <div className="container mx-auto relative z-10 flex flex-col items-center justify-center min-h-screen py-20">
        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 max-w-4xl"
        >
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-slate-200 sm:text-6xl lg:text-7xl mb-6">
            Stop Applying Blindly.
          </h1>
          <p className="text-xl text-slate-300 sm:text-2xl max-w-2xl mx-auto">
            Get Matched to Funded Research Opportunities Worldwide
          </p>
        </motion.div>

        {/* Search Bar - Foreground Focus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-2xl"
        >
          <IntelligentSearch
            onSearchChange={handleSearchChange}
            onGrantSelect={handleGrantSelect}
          />
        </motion.div>

        {/* Optional: Stats or CTA below search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-slate-400">
            Search by country, university, field, or skills
          </p>
        </motion.div>
      </div>
    </section>
  );
}
