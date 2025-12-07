"use client";

import React from "react";
import Link from "next/link";
import { grants } from "@/lib/data";
import { ArrowUpRight, Trophy, Lock, CheckCircle2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StudentDashboard() {
  // Filter recommended jobs from data.ts (showing first 3 for demo)
  const recommendedJobs = grants.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* THE BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* WIDGET 1 (Top Left): R-Score Gauge */}
        <div className="md:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-teal-500/30 transition-all backdrop-blur-lg">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trophy size={100} className="text-teal-400" />
          </div>
          <h3 className="text-slate-400 text-sm font-medium mb-4">R-Score</h3>
          
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-6xl font-bold text-slate-200 mb-2">
              85<span className="text-xl text-slate-500">/100</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-teal-400 to-teal-600 h-full w-[85%]"></div>
            </div>
            <p className="text-xs text-teal-400 mt-3 flex items-center gap-1">
              <ArrowUpRight size={12} /> Top 15% of candidates
            </p>
          </div>
        </div>

        {/* WIDGET 2 (Top Right): Profile Completion */}
        <div className="md:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg group hover:border-teal-500/30 transition-all">
          <h3 className="text-slate-400 text-sm font-medium mb-4">Profile Completion</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-300">Progress</span>
                <span className="text-sm font-semibold text-teal-400">65%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-teal-400 to-teal-600 h-full w-[65%]"></div>
              </div>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <CheckCircle2 size={14} className="text-teal-400" />
                <span>Basic Information</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <CheckCircle2 size={14} className="text-teal-400" />
                <span>Research Interests</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <div className="w-3.5 h-3.5 rounded-full border border-slate-500" />
                <span>Publications</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <div className="w-3.5 h-3.5 rounded-full border border-slate-500" />
                <span>References</span>
              </div>
            </div>
          </div>
        </div>

        {/* WIDGET 4 (Side): Mobility Tracker - Locked */}
        <div className="md:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="text-center">
              <Lock className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-xs text-slate-500">Feature Locked</p>
            </div>
          </div>
          <h3 className="text-slate-400 text-sm font-medium mb-4">Mobility Tracker</h3>
          <div className="space-y-3 opacity-50">
            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
              <div className="text-xs text-slate-500 mb-1">Visa Status</div>
              <div className="text-sm text-slate-400">Not Available</div>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
              <div className="text-xs text-slate-500 mb-1">Housing</div>
              <div className="text-sm text-slate-400">Not Available</div>
            </div>
          </div>
        </div>

        {/* WIDGET 3 (Main): Recommended Jobs */}
        <div className="md:col-span-3 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-slate-400 text-sm font-medium">Recommended Jobs</h3>
            <Link 
              href="/auth/signup"
              className="text-xs text-teal-400 hover:text-teal-300 transition-colors"
            >
              View All →
            </Link>
          </div>
          
          <div className="space-y-3">
            {recommendedJobs.map((grant) => (
              <Link
                key={grant.id}
                href="/auth/signup"
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl",
                  "bg-white/5 border border-white/5 hover:border-teal-500/30",
                  "transition-all group cursor-pointer"
                )}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-slate-200 font-bold text-sm">
                    {grant.university.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-200 group-hover:text-teal-400 transition-colors">
                      {grant.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {grant.university} • {grant.professor}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {grant.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="text-xs bg-white/5 text-slate-300 px-2 py-0.5 rounded border border-white/5"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-sm font-bold text-teal-400 mb-1">
                    {grant.funding.includes("$") || grant.funding.includes("€") 
                      ? grant.funding.split(' ')[0] 
                      : grant.funding}
                  </div>
                  {grant.tryout && (
                    <div className="flex items-center gap-1 text-xs text-purple-400">
                      <Zap size={10} />
                      <span>Fast Track</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

