"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

interface Destination {
  name: string;
  country: string;
  image: string;
  badge: string;
  badgeColor: string;
}

const destinations: Destination[] = [
  {
    name: "Germany",
    country: "Germany",
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73a6e?w=800&h=600&fit=crop",
    badge: "Tuition Free",
    badgeColor: "bg-teal-500/20 text-teal-400 border-teal-500/30"
  },
  {
    name: "USA",
    country: "USA",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
    badge: "High Funding",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30"
  },
  {
    name: "Saudi Arabia",
    country: "Saudi Arabia",
    image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop",
    badge: "High Stipend",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30"
  },
  {
    name: "UK",
    country: "UK",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop",
    badge: "Research Excellence",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30"
  },
  {
    name: "China",
    country: "China",
    image: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&h=600&fit=crop",
    badge: "CSC Scholarships",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30"
  }
];

export default function PopularDestinations() {
  return (
    <section className="relative py-24 bg-[#0B0F19] overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Popular Research Destinations <span className="text-teal-500">.</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Explore top destinations where researchers thrive. Click any destination to see available opportunities.
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination, index) => (
            <Link
              key={destination.country}
              href={`/dashboard/student/grants?country=${encodeURIComponent(destination.country)}`}
              className="group relative h-[300px] rounded-2xl overflow-hidden bg-slate-900/40 backdrop-blur-sm border border-white/5 hover:border-teal-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/10 hover:-translate-y-1"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-between p-6">
                {/* Badge */}
                <div className="flex justify-end">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${destination.badgeColor} backdrop-blur-sm`}>
                    {destination.badge}
                  </span>
                </div>

                {/* Country Name and Arrow */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-teal-400 transition-colors">
                      {destination.name}
                    </h3>
                    <p className="text-sm text-slate-400">Explore opportunities</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-teal-500 group-hover:text-black transition-all">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Optional: View All Link */}
        <div className="text-center mt-12">
          <Link
            href="/dashboard/student/grants"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-teal-400 transition-colors text-sm"
          >
            View all destinations
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

