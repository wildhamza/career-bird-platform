"use client";

import React, { useState, useEffect, useCallback } from "react";
import { grants } from "@/lib/data";
import { 
  Lock, 
  Briefcase, 
  Target, 
  X,
  Circle,
  ArrowRight,
  Edit
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";
import EditProfileModal from "@/components/dashboard/EditProfileModal";
import ApplicationStatusModal from "@/components/dashboard/ApplicationStatusModal";

// Circular Gauge Component for R-Score
function CircularGauge({ 
  value, 
  max, 
  showValue = true 
}: { 
  value: number | null; 
  max: number;
  showValue?: boolean;
}) {
  const hasValue = value !== null && value !== undefined && value > 0;
  const percentage = hasValue ? (value / max) * 100 : 0;
  const circumference = 2 * Math.PI * 45; // radius = 45
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="transform -rotate-90 w-32 h-32">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="8"
          fill="none"
        />
        {/* Progress circle */}
        {hasValue && (
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        )}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {showValue && hasValue ? (
          <>
            <span className="text-3xl font-bold text-white leading-none">{value}</span>
            <span className="text-sm text-gray-400 leading-none mt-1">/ {max}</span>
          </>
        ) : (
          <span className="text-lg font-semibold text-gray-400">Pending</span>
        )}
      </div>
    </div>
  );
}

// Modal Component for Apply Button
function ApplyModal({ 
  grant, 
  isOpen, 
  onClose,
  onContinueApplication
}: { 
  grant: typeof grants[0] | null; 
  isOpen: boolean; 
  onClose: () => void;
  onContinueApplication: () => void;
}) {
  if (!isOpen || !grant) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      <div 
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Apply to Grant</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-medium text-white mb-1">{grant.title}</h4>
            <p className="text-sm text-gray-400">{grant.university} • {grant.professor}</p>
          </div>
          
          <div className="pt-4 border-t border-white/10">
            <p className="text-sm text-gray-300 mb-4">
              Application form will be available here. This is a placeholder modal.
            </p>
            <button
              onClick={() => {
                onClose();
                onContinueApplication();
              }}
              className="w-full bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 text-teal-400 font-medium py-3 rounded-lg transition-all"
            >
              Continue Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudentDashboardPage() {
  const [selectedGrant, setSelectedGrant] = useState<typeof grants[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  
  const topGrants = grants.slice(0, 3);

  const fetchProfileData = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return null;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    const data = await fetchProfileData();
    if (data) {
      setProfile(data);
    }
  }, [fetchProfileData]);

  useEffect(() => {
    (async () => {
      const data = await fetchProfileData();
      if (data) {
        setProfile(data);
      }
    })();
  }, [fetchProfileData]);

  const handleApply = (grant: typeof grants[0]) => {
    setSelectedGrant(grant);
    setIsModalOpen(true);
  };

  const handleContinueApplication = () => {
    setIsStatusModalOpen(true);
  };

  const calculateProfileCompletion = () => {
    if (!profile) return 0;
    let completed = 0;
    const total = 4;
    
    if (profile.full_name) completed++;
    if (profile.university) completed++;
    if (profile.gpa !== null && profile.gpa !== undefined) completed++;
    if (profile.skills && profile.skills.length > 0) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const profileCompletion = calculateProfileCompletion();
  const displayName = profile?.full_name || "Scholar";
  const rScore = profile?.r_score ?? null;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">
            Welcome, {displayName}.
          </h1>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-medium px-4 py-2 rounded-lg transition-all"
          >
            <Edit size={16} />
            Edit Profile
          </button>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Profile Completion</span>
            <span className="text-sm font-semibold text-teal-400">{profileCompletion}%</span>
          </div>
          <div className="w-full bg-slate-800/50 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-teal-400 to-teal-600 h-full transition-all duration-500"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bento Box Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Stat Card 1: R-Score */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg hover:border-teal-500/30 transition-all">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm font-medium text-gray-400">R-Score</h3>
          </div>
          <CircularGauge value={rScore} max={100} />
          <p className="text-xs text-center text-gray-400 mt-4">
            {rScore && rScore > 0 
              ? "Top 15% of candidates" 
              : "Pending calculation"}
          </p>
        </div>

        {/* Stat Card 2: Applications */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg hover:border-teal-500/30 transition-all">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm font-medium text-gray-400">Applications</h3>
          </div>
          <div className="flex flex-col items-center justify-center py-4">
            <span className="text-5xl font-bold text-white mb-2">0</span>
            <span className="text-sm text-gray-400">Active</span>
          </div>
        </div>

        {/* Stat Card 3: Matches */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg hover:border-teal-500/30 transition-all">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm font-medium text-gray-400">Matches</h3>
          </div>
          <div className="flex flex-col items-center justify-center py-4">
            <span className="text-5xl font-bold text-white mb-2">12</span>
            <span className="text-sm text-gray-400">New</span>
          </div>
        </div>

        {/* Recommended Feed (Main Panel) */}
        <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg">
          <h3 className="text-sm font-medium text-gray-400 mb-6">Recommended Feed</h3>
          <div className="space-y-4">
            {topGrants.map((grant) => (
              <div
                key={grant.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-teal-500/30 transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-semibold text-white group-hover:text-teal-400 transition-colors mb-1">
                    {grant.title}
                  </h4>
                  <p className="text-sm text-gray-400 mb-2">
                    {grant.university} • {grant.professor}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {grant.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="text-xs bg-white/5 text-gray-300 px-2 py-1 rounded border border-white/5"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleApply(grant)}
                  className="flex items-center gap-2 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 text-teal-400 font-medium px-4 py-2 rounded-lg transition-all whitespace-nowrap"
                >
                  Apply
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Mobility Tracker (Side Panel - Locked) */}
        <div className="md:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg relative overflow-hidden">
          {/* Lock Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
            <Lock className="w-8 h-8 text-gray-500 mb-2" />
            <p className="text-xs text-gray-500 text-center px-4">
              Unlocks after acceptance.
            </p>
          </div>

          <h3 className="text-sm font-medium text-gray-400 mb-6">Mobility Tracker</h3>
          <div className="space-y-4 opacity-50">
            {/* Vertical Stepper */}
            <div className="relative">
              {/* Step 1: Offer Accepted */}
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center">
                    <Circle className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="w-0.5 h-12 bg-gray-700 mt-2" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm font-medium text-gray-400">Offer Accepted</p>
                  <p className="text-xs text-gray-500 mt-1">Pending</p>
                </div>
              </div>

              {/* Step 2: Visa */}
              <div className="flex items-start gap-3 mt-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center">
                    <Circle className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="w-0.5 h-12 bg-gray-700 mt-2" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm font-medium text-gray-400">Visa</p>
                  <p className="text-xs text-gray-500 mt-1">Not started</p>
                </div>
              </div>

              {/* Step 3: Housing */}
              <div className="flex items-start gap-3 mt-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center">
                    <Circle className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm font-medium text-gray-400">Housing</p>
                  <p className="text-xs text-gray-500 mt-1">Not started</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal 
        grant={selectedGrant}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onContinueApplication={handleContinueApplication}
      />

      {/* Application Status Modal */}
      <ApplicationStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        grantTitle={selectedGrant?.title}
        grantUniversity={selectedGrant?.university}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onUpdate={fetchProfile}
      />
    </div>
  );
}

