"use client";

import React, { useState, useEffect, useCallback } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";

import { 

  LayoutDashboard, 

  Search, 

  Briefcase, 

  LogOut,

  User,

  Globe,

  Users

} from "lucide-react"; 

import { CommandMenu } from "@/components/dashboard/CommandMenu";
import AuthGuard from "@/components/auth/AuthGuard";


export default function DashboardLayout({

  children,

}: {

  children: React.ReactNode;

}) {

  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile to determine role
  const fetchProfile = useCallback(async () => {
    try {
      // Check if Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn("Supabase environment variables are not configured. Profile features will be disabled.");
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error);
        setLoading(false);
        return;
      }

      setProfile(data);
    } catch (error) {
      if (error instanceof Error && error.message.includes("Missing Supabase environment variables")) {
        setLoading(false);
        return;
      }
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSignOut = async () => {
    try {
      // Check if Supabase is configured before attempting sign out
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('Supabase not configured. Redirecting to home page.');
        router.push('/');
        return;
      }

      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if sign out fails, redirect to home page
      router.push('/');
    }
  };

  // Define menu links based on role
  const studentLinks = [
    { href: "/dashboard/student", icon: <LayoutDashboard size={20} />, label: "Battle Station" },
    { href: "/dashboard/student/grants", icon: <Search size={20} />, label: "Find Grants" },
    { href: "/dashboard/student/applications", icon: <Briefcase size={20} />, label: "My Applications" },
    { href: "/dashboard/student/mobility", icon: <Globe size={20} />, label: "Mobility OS" },
    { href: "/dashboard/student/profile", icon: <User size={20} />, label: "My Profile" },
  ];

  const professorLinks = [
    { href: "/dashboard/professor", icon: <LayoutDashboard size={20} />, label: "Command Center" },
    { href: "/dashboard/professor/grants", icon: <Briefcase size={20} />, label: "Active Grants" },
    { href: "/dashboard/professor/applicants", icon: <Users size={20} />, label: "Talent Pipeline" },
    { href: "/dashboard/professor/profile", icon: <User size={20} />, label: "Lab Profile" },
  ];

  // Determine which links to show based on role
  const currentLinks = profile?.role === 'professor' ? professorLinks : studentLinks;
  const defaultRoute = profile?.role === 'professor' ? "/dashboard/professor" : "/dashboard/student";



  // Determine header title based on current route

  const getHeaderTitle = () => {

    if (pathname?.includes("/mobility")) return "Command Center / Mobility OS";

    if (pathname?.includes("/student")) return "Command Center / Student Overview";

    if (pathname?.includes("/professor")) return "Command Center / Lab Recruitment";

    if (pathname?.includes("/grants")) return "Command Center / Find Grants";

    if (pathname?.includes("/applications")) return "Command Center / My Applications";

    if (pathname?.includes("/profile")) return "Command Center / My Profile";

    return "Command Center";

  };



  return (

    <div className="min-h-screen bg-[#0B0F19] text-white flex">

      <CommandMenu />

      {/* Sidebar - "The Command Center" Navigation */}

      <aside className="w-64 border-r border-white/10 bg-white/5 backdrop-blur-lg hidden md:flex flex-col h-screen sticky top-0">

        <div className="p-6 border-b border-white/10">
          <Link 
            href={defaultRoute}
            className="block hover:opacity-80 transition-opacity cursor-pointer"
          >
            <h1 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">
              Career Bird
            </h1>
            <p className="text-xs text-gray-400 mt-1">Research Intelligence</p>
          </Link>
        </div>



        <nav className="flex-1 p-4 space-y-2">
          {loading ? (
            // Show skeleton or nothing while loading
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-11 bg-white/5 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            // Render links based on role
            currentLinks.map((link) => (
              <NavItem
                key={link.href}
                href={link.href}
                icon={link.icon}
                label={link.label}
                active={
                  pathname === link.href || 
                  (link.href !== defaultRoute && pathname?.startsWith(link.href + '/'))
                }
              />
            ))
          )}
        </nav>



        <div className="p-4 border-t border-white/10">

           <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 text-gray-400 hover:text-white w-full px-4 py-3 rounded-lg hover:bg-white/5 transition-all"
          >

            <LogOut size={20} />

            <span className="text-sm font-medium">Sign Out</span>

          </button>

        </div>

      </aside>



      {/* Main Content Area */}

      <main className="flex-1 overflow-y-auto">

        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#0B0F19]/50 backdrop-blur-md sticky top-0 z-10">

           <h2 className="text-sm font-medium text-gray-400">{getHeaderTitle()}</h2>

           <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-teal-500 to-teal-600 border border-white/20"></div>

        </header>

        <div className="p-8">

          <AuthGuard>
            {children}
          </AuthGuard>

        </div>

      </main>

    </div>

  );

}



// Simple Nav Item Component

function NavItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {

  return (

    <Link 

      href={href} 

      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${

        active 

          ? "bg-teal-500/10 text-teal-400 border border-teal-500/20" 

          : "text-gray-400 hover:bg-white/5 hover:text-white"

      }`}

    >

      {icon}

      <span className="text-sm font-medium">{label}</span>

    </Link>

  );

}
