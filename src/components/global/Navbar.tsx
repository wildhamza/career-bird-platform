"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/5 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.png" alt="The Career Bird" width={40} height={40} className="object-contain" />
        </Link>
        <Link
          href="/auth/signup"
          className={cn(
            "rounded-md border border-teal-500/50 bg-teal-500/10 px-4 py-2 text-sm font-medium",
            "text-teal-400 transition-all hover:border-teal-500 hover:bg-teal-500/20",
            "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-[#0B0F19]"
          )}
        >
          Get Matched
        </Link>
      </div>
    </nav>
  );
}

