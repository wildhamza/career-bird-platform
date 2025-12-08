"use client";

import Link from "next/link";
import { useState, useEffect, Suspense, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import Navbar from "@/components/global/Navbar";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { Quote, Chrome } from "lucide-react";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import ErrorToast from "@/components/dashboard/ErrorToast";

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

// Zod validation schema for email
const emailSchema = z.string()
  .email("Please enter a valid email address")
  .refine((email) => {
    // Ensure it has a proper domain extension (at least 2 characters after the dot)
    const domainPart = email.split("@")[1];
    if (!domainPart) return false;
    const parts = domainPart.split(".");
    return parts.length >= 2 && parts[parts.length - 1].length >= 2;
  }, {
    message: "Email must have a valid domain extension (e.g., .com, .edu, .org)"
  });

// Zod validation schema for password
const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

function SignupForm() {
  const [userType, setUserType] = useState<"student" | "professor">("student");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Handle query parameters for grant application intent and role
  useEffect(() => {
    const intent = searchParams?.get("intent");
    const grantId = searchParams?.get("id");
    const role = searchParams?.get("role");
    
    // Handle role parameter - automatically set user type
    if (role === "professor") {
      setUserType("professor");
    } else if (role === "student") {
      setUserType("student");
    }
    
    if (intent === "apply" && grantId) {
      // Store grant ID in sessionStorage for use after signup
      if (typeof window !== "undefined") {
        sessionStorage.setItem("pendingGrantApplication", grantId);
      }
    }
  }, [searchParams]);

  const validateEmail = (emailValue: string): boolean => {
    if (emailValue.length === 0) {
      setEmailError("");
      return false;
    }
    const result = emailSchema.safeParse(emailValue);
    if (!result.success) {
      setEmailError(result.error.issues[0].message);
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (pwd: string): boolean => {
    const result = passwordSchema.safeParse(pwd);
    if (!result.success) {
      setPasswordError(result.error.issues[0].message);
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail.length > 0) {
      validateEmail(newEmail);
    } else {
      setEmailError("");
    }
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

  const isEmailValid = email.length > 0 && emailError === "";
  const isPasswordValid = password.length > 0 && passwordError === "";
  const isFormValid = isEmailValid && isPasswordValid;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      console.log("Submitting form...", { email, role: userType });

      // Sanitize user input to avoid validation issues with stray spaces
      const cleanEmail = email.trim();
      const cleanPassword = password.trim();
      const cleanName = ""; // No full name field present, keep placeholder for future use

      // Nuclear sanitize: strip quotes and spaces to avoid email_address_invalid
      const nuclearEmail = email.replace(/['"\s]/g, "");

      console.log("Original:", email);
      console.log("Nuclear Cleaned:", nuclearEmail);
      
      const emailValid = validateEmail(nuclearEmail);
      const passwordValid = validatePassword(cleanPassword);
      
      if (!emailValid || !passwordValid) {
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);
      setShowErrorToast(false);

      // Check if Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const errorMsg = "System Error: Database connection failed.";
        setSubmitError(errorMsg);
        setShowErrorToast(true);
        alert(errorMsg);
        setIsSubmitting(false);
        return;
      }

      const supabase = createClient();
      
      // Validate supabase client
      if (!supabase) {
        const errorMsg = "System Error: Database connection failed.";
        setSubmitError(errorMsg);
        setShowErrorToast(true);
        alert(errorMsg);
        setIsSubmitting(false);
        return;
      }

      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: nuclearEmail,
        password: cleanPassword,
        options: {
          data: {
            role: userType,
            full_name: cleanName || undefined,
          },
        },
      });

      if (error) {
        const errorMsg = error.message || "Something went wrong";
        console.error("Signup error:", error);
        setSubmitError(errorMsg);
        setShowErrorToast(true);
        alert(errorMsg);
        setIsSubmitting(false);
        return;
      }

      // If signup successful, create profile entry
      if (data.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            user_id: data.user.id,
            role: userType,
          });

        if (profileError) {
          console.error("Profile creation error:", profileError);
          // Don't fail the signup if profile creation fails, but log it
        }
      }

      // Check for redirect parameter from middleware
      const redirectPath = searchParams?.get("redirect");
      
      // Check if there's a pending grant application
      const pendingGrantId = typeof window !== "undefined" 
        ? sessionStorage.getItem("pendingGrantApplication") 
        : null;
      
      if (pendingGrantId) {
        // Redirect to grants page with the grant ID
        router.push(`/dashboard/student/grants?highlight=${pendingGrantId}`);
        sessionStorage.removeItem("pendingGrantApplication");
      } else if (redirectPath) {
        // Redirect to the original destination
        router.push(redirectPath);
      } else {
        // Default dashboard path
        const dashboardPath = userType === "professor" ? "/dashboard/professor" : "/dashboard/student";
        router.push(dashboardPath);
      }
    } catch (error: any) {
      console.error("Signup exception:", error);
      const errorMsg = error?.message || "Something went wrong";
      setSubmitError(errorMsg);
      setShowErrorToast(true);
      alert(errorMsg);
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoadingGoogle(true);
      setGoogleError(null);
      setShowErrorToast(false);
      
      // Environment check - log in development only
      if (process.env.NODE_ENV === 'development') {
        console.log('[Google Login Debug] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configured' : '❌ Missing');
        console.log('[Google Login Debug] Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configured' : '❌ Missing');
      }
      
      // Check if Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const errorMsg = "Supabase is not configured. Please set up your environment variables.";
        setGoogleError(errorMsg);
        setShowErrorToast(true);
        setIsLoadingGoogle(false);
        return;
      }

      const supabase = createClient();
      const dashboardPath = userType === "professor" ? "/dashboard/professor" : "/dashboard/student";
      
      // Ensure redirectTo is properly set
      const redirectTo = `${window.location.origin}/auth/callback?next=${dashboardPath}`;
      
      console.log('[Google Login] Initiating OAuth with redirectTo:', redirectTo);
      
      const { error, data } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectTo,
        },
      });

      if (error) {
        console.error('[Google Login Error]', error);
        const errorMsg = error.message || "Failed to sign in with Google. Please try again.";
        setGoogleError(errorMsg);
        setShowErrorToast(true);
        setIsLoadingGoogle(false);
      } else {
        // OAuth redirect will happen automatically, so we don't need to do anything here
        console.log('[Google Login] OAuth initiated successfully', data);
      }
    } catch (error: any) {
      console.error('[Google Login Exception]', error);
      const errorMsg = error.message || 
        "An unexpected error occurred. Please check your Supabase configuration and try again.";
      setGoogleError(errorMsg);
      setShowErrorToast(true);
      setIsLoadingGoogle(false);
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

              {/* Google Login Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoadingGoogle}
                className={cn(
                  "w-full rounded-md border border-white/20 bg-white text-black px-4 py-3",
                  "text-base font-semibold transition-all flex items-center justify-center gap-3",
                  "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <Chrome size={20} />
                {isLoadingGoogle ? "Connecting..." : "Continue with Google"}
              </button>
              
              {googleError && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg">
                  {googleError}
                </div>
              )}

              {/* Error Toast */}
              <ErrorToast
                message={googleError || submitError || "An error occurred"}
                isVisible={showErrorToast}
                onClose={() => {
                  setShowErrorToast(false);
                  setGoogleError(null);
                  setSubmitError(null);
                }}
              />
              
              {submitError && (
                <div className="mt-4 bg-red-500/20 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg">
                  {submitError}
                </div>
              )}

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/5 text-slate-400">Or continue with email</span>
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
                    value={email}
                    onChange={handleEmailChange}
                    required
                    className={cn(
                      "mt-2 block w-full rounded-md border bg-white/5 px-4 py-3",
                      "text-slate-200 placeholder-slate-500 focus:outline-none",
                      "focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B0F19]",
                      "transition-colors",
                      emailError
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-white/10 focus:border-teal-500 focus:ring-teal-500"
                    )}
                    placeholder="you@example.com"
                  />
                  {emailError && (
                    <p className="mt-2 text-sm text-red-500">{emailError}</p>
                  )}
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
                  disabled={!isFormValid || isSubmitting}
                  className={cn(
                    "w-full rounded-md border border-teal-500 bg-teal-500/10 px-4 py-3",
                    "text-base font-semibold text-teal-400 transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-[#0B0F19]",
                    isFormValid && !isSubmitting
                      ? "hover:bg-teal-500/20 hover:shadow-[0_0_20px_rgba(0,128,128,0.5)] cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
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

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-teal-400">
        Loading...
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}

