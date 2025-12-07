"use client";

import { cn } from "@/lib/utils";

const stats = [
  { label: "Labs", value: "50+", description: "Active Research Labs" },
  { label: "Funding", value: "$1.2M", description: "Average per Match" },
  { label: "Verified", value: "100%", description: "Authenticated Profiles" },
];

export default function StatsStrip() {
  return (
    <section className="border-y border-white/10 bg-white/5 backdrop-blur-lg py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col items-center space-y-2 border-b border-white/10 pb-8",
                "sm:border-b-0 sm:border-r sm:pb-0 sm:pr-8",
                "last:border-r-0"
              )}
            >
              <div className="text-4xl font-bold text-teal-400 sm:text-5xl">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-slate-200">
                {stat.label}
              </div>
              <div className="text-sm text-slate-400">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

