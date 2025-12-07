"use client";

import { cn } from "@/lib/utils";

const institutions = [
  "MIT",
  "Stanford",
  "Harvard",
  "Oxford",
  "Cambridge",
  "ETH Zurich",
  "Caltech",
  "Princeton",
];

export default function TrustCarousel() {
  return (
    <section className="py-20 border-y border-slate-800 bg-black/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-semibold text-slate-300 mb-2">
            Trusted by Leading Institutions
          </h2>
          <p className="text-slate-500">
            Join researchers from top universities worldwide
          </p>
        </div>
        <div className="flex items-center justify-center gap-8 overflow-hidden">
          <div className="flex animate-scroll gap-12">
            {[...institutions, ...institutions].map((institution, index) => (
              <div
                key={index}
                className={cn(
                  "flex-shrink-0 text-2xl font-semibold text-slate-600",
                  "transition-colors hover:text-cyan-400"
                )}
              >
                {institution}
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </section>
  );
}

