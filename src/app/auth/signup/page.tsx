"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Navbar from "@/components/global/Navbar";
import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { Quote } from "lucide-react";
import { z } from "zod";

// Create sphere geometry once outside component
const sphereGeometry = new THREE.SphereGeometry(1.5, 64, 64);

function Globe3D() {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.1;
    }
  });

  const positions = useMemo(() => {
    return sphereGeometry.attributes.position.array as Float32Array;
  }, []);

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#008080"
        size={0.012}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
}

function GlobeCanvas() {
  return (
    <div className="relative h-64 w-64">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Globe3D />
        </Suspense>
      </Canvas>
    </div>
  );
}

const testimonials = [
  {
    quote: "Found my perfect research match at KAUST within 2 weeks. The platform is incredible.",
    author: "Sarah Chen",
    role: "PhD Student, Computer Science"
  },
  {
    quote: "As a professor, I've connected with top-tier candidates I never would have found otherwise.",
    author: "Dr. Michael Rodriguez",
    role: "Professor, MIT"
  }
];

// Zod validation schema for password
const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export default function SignupPage() {
  const [userType, setUserType] = useState<"student" | "professor">("student");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

  const validatePassword = (pwd: string): boolean => {
    const result = passwordSchema.safeParse(pwd);
    if (!result.success) {
      setPasswordError(result.error.errors[0].message);
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword.length > 0) {
      validatePassword(newPassword);
    } else {
      setPasswordError("");
    }
  };

  const isPasswordValid = password.length > 0 && passwordError === "";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validatePassword(password)) {
      const dashboardPath = userType === "professor" ? "/dashboard/professor" : "/dashboard/student";
      router.push(dashboardPath);
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0F19]">
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Left Side: Testimonials/Globe */}
        <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center px-8 bg-gradient-to-br from-slate-900/50 to-black/50 border-r border-white/10">
          <div className="max-w-md space-y-8">
            {/* Globe */}
            <div className="flex justify-center">
              <Suspense fallback={<div className="h-64 w-64 rounded-full bg-slate-900/50" />}>
                <GlobeCanvas />
              </Suspense>
            </div>

            {/* Testimonials */}
            <div className="space-y-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={cn(
                    "rounded-lg border border-white/10 bg-white/5 backdrop-blur-lg p-6"
                  )}
                >
                  <Quote className="w-6 h-6 text-teal-400 mb-3" />
                  <p className="text-slate-300 mb-4 italic">
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">
                      {testimonial.author}
                    </p>
                    <p className="text-xs text-slate-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            <div className={cn(
              "rounded-lg border border-white/10 bg-white/5 backdrop-blur-lg p-8"
            )}>
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-slate-200">Create Account</h1>
                <p className="mt-2 text-slate-400">
                  Join the research opportunity network
                </p>
              </div>

              {/* User Type Toggle */}
              <div className="mb-6">
                <div className="relative flex rounded-lg border border-white/10 bg-white/5 p-1">
                  <button
                    type="button"
                    onClick={() => setUserType("student")}
                    className={cn(
                      "relative flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all",
                      userType === "student"
                        ? "bg-teal-500/20 text-teal-400 shadow-[0_0_10px_rgba(0,128,128,0.3)]"
                        : "text-slate-400 hover:text-slate-300"
                    )}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType("professor")}
                    className={cn(
                      "relative flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all",
                      userType === "professor"
                        ? "bg-teal-500/20 text-teal-400 shadow-[0_0_10px_rgba(0,128,128,0.3)]"
                        : "text-slate-400 hover:text-slate-300"
                    )}
                  >
                    Professor
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                      "mt-2 block w-full rounded-md border border-white/10 bg-white/5 px-4 py-3",
                      "text-slate-200 placeholder-slate-500 focus:border-teal-500 focus:outline-none",
                      "focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-[#0B0F19]",
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
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    className={cn(
                      "mt-2 block w-full rounded-md border bg-white/5 px-4 py-3",
                      "text-slate-200 placeholder-slate-500 focus:outline-none",
                      "focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B0F19]",
                      "transition-colors",
                      passwordError
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-white/10 focus:border-teal-500 focus:ring-teal-500"
                    )}
                    placeholder="••••••••"
                  />
                  {passwordError && (
                    <p className="mt-2 text-sm text-red-500">{passwordError}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!isPasswordValid}
                  className={cn(
                    "w-full rounded-md border border-teal-500 bg-teal-500/10 px-4 py-3",
                    "text-base font-semibold text-teal-400 transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-[#0B0F19]",
                    isPasswordValid
                      ? "hover:bg-teal-500/20 hover:shadow-[0_0_20px_rgba(0,128,128,0.5)] cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  )}
                >
                  Create Account
                </button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-400">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="font-medium text-teal-400 hover:text-teal-300 transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

