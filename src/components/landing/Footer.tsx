"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-black/50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* About Column */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">About</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className={cn(
                    "text-sm text-slate-400 transition-colors",
                    "hover:text-teal-400"
                  )}
                >
                  Our Mission
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className={cn(
                    "text-sm text-slate-400 transition-colors",
                    "hover:text-teal-400"
                  )}
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className={cn(
                    "text-sm text-slate-400 transition-colors",
                    "hover:text-teal-400"
                  )}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Students Column */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Students</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/auth/signup"
                  className={cn(
                    "text-sm text-slate-400 transition-colors",
                    "hover:text-teal-400"
                  )}
                >
                  Get Started
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className={cn(
                    "text-sm text-slate-400 transition-colors",
                    "hover:text-teal-400"
                  )}
                >
                  Find Opportunities
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className={cn(
                    "text-sm text-slate-400 transition-colors",
                    "hover:text-teal-400"
                  )}
                >
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Professors Column */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Professors</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/auth/signup"
                  className={cn(
                    "text-sm text-slate-400 transition-colors",
                    "hover:text-teal-400"
                  )}
                >
                  Post Opportunities
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className={cn(
                    "text-sm text-slate-400 transition-colors",
                    "hover:text-teal-400"
                  )}
                >
                  Recruit Talent
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className={cn(
                    "text-sm text-slate-400 transition-colors",
                    "hover:text-teal-400"
                  )}
                >
                  Lab Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className={cn(
                    "text-sm text-slate-400 transition-colors",
                    "hover:text-teal-400"
                  )}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className={cn(
                    "text-sm text-slate-400 transition-colors",
                    "hover:text-teal-400"
                  )}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className={cn(
                    "text-sm text-slate-400 transition-colors",
                    "hover:text-teal-400"
                  )}
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-800 text-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} The Career Bird. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

