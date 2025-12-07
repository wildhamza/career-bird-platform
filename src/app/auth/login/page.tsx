"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import Navbar from "@/components/global/Navbar";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#0B0F19]">
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="rounded-lg border border-slate-800 bg-black/50 p-8 backdrop-blur-sm">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
              <p className="mt-2 text-slate-400">
                Sign in to access your research opportunities
              </p>
            </div>
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-300"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className={cn(
                    "mt-2 block w-full rounded-md border border-slate-800 bg-slate-900/50 px-4 py-3",
                    "text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none",
                    "focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black/50",
                    "transition-colors"
                  )}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-300"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className={cn(
                    "mt-2 block w-full rounded-md border border-slate-800 bg-slate-900/50 px-4 py-3",
                    "text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none",
                    "focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black/50",
                    "transition-colors"
                  )}
                  placeholder="••••••••"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className={cn(
                      "h-4 w-4 rounded border-slate-800 bg-slate-900/50 text-cyan-500",
                      "focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black/50"
                    )}
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-slate-400"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  href="#"
                  className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                className={cn(
                  "w-full rounded-md border border-cyan-500 bg-cyan-500/10 px-4 py-3",
                  "text-base font-semibold text-cyan-400 transition-all",
                  "hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]",
                  "focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black/50"
                )}
              >
                Sign In
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-400">
                Don't have an account?{" "}
                <Link
                  href="#"
                  className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

