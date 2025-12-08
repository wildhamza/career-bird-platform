"use client";

import React, { useState, useEffect } from "react";
import { Save, Upload, X, Plus, Trash2, User, Eye, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";
import ResumeParser from "@/components/dashboard/ResumeParser";
import ProfileSkeleton from "@/components/dashboard/ProfileSkeleton";
import Link from "next/link";
import Toast from "@/components/dashboard/Toast";

interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  year: string;
  gpa?: string;
}

export default function StudentProfilePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    full_name: "",
    headline: "",
    bio: "",
    skills: [] as string[],
    resume_link: "",
  });

  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [educationHistory, setEducationHistory] = useState<EducationEntry[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [activeTab, setActiveTab] = useState<"about" | "education" | "skills">("about");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsFetching(true);
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn("Supabase environment variables are not configured. Profile features will be disabled.");
        setIsFetching(false);
        return;
      }

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setIsFetching(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error);
        setIsFetching(false);
        return;
      }

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || "",
          headline: (data as any).headline || "",
          bio: (data as any).bio || "",
          skills: data.skills || [],
          resume_link: data.resume_link || "",
        });
        setProfilePicture((data as any).profile_picture || null);
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("Missing Supabase environment variables")) {
        setIsFetching(false);
        return;
      }
      console.error("Error fetching profile:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleResumeParse = (data: { skills: string[]; bio: string }) => {
    setFormData((prev) => ({
      ...prev,
      skills: data.skills.length > 0 ? [...new Set([...prev.skills, ...data.skills])] : prev.skills,
      bio: data.bio || prev.bio,
    }));
    setHasUnsavedChanges(true);
    setToastVisible(true);
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput("");
      setHasUnsavedChanges(true);
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
    setHasUnsavedChanges(true);
  };

  const handleAddEducation = () => {
    const newEntry: EducationEntry = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      year: "",
      gpa: "",
    };
    setEducationHistory([...educationHistory, newEntry]);
    setHasUnsavedChanges(true);
  };

  const handleRemoveEducation = (id: string) => {
    setEducationHistory(educationHistory.filter((entry) => entry.id !== id));
    setHasUnsavedChanges(true);
  };

  const handleEducationChange = (id: string, field: keyof EducationEntry, value: string) => {
    setEducationHistory(
      educationHistory.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
    setHasUnsavedChanges(true);
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
        setHasUnsavedChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setError("Supabase is not configured. Please set up your environment variables.");
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .upsert({
          user_id: user.id,
          full_name: formData.full_name || null,
          headline: formData.headline || null,
          bio: formData.bio || null,
          skills: formData.skills.length > 0 ? formData.skills : null,
          resume_link: formData.resume_link || null,
          profile_picture: profilePicture || null,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "user_id",
        });

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
      setHasUnsavedChanges(false);
      setToastVisible(true);
      setTimeout(() => {
        setSuccess(false);
        setToastVisible(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: keyof typeof formData, value: string | string[]) => {
    setFormData({ ...formData, [field]: value });
    setHasUnsavedChanges(true);
  };

  if (isFetching) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="space-y-6">
        {/* Banner Header */}
        <div className="relative h-48 rounded-2xl overflow-hidden bg-gradient-to-r from-teal-500 via-blue-500 to-teal-600">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

      {/* Profile Card Overlapping Banner */}
      <div className="relative -mt-24 mb-8">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-white/10 border-4 border-white/20 overflow-hidden flex items-center justify-center">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-full bg-teal-500 border-2 border-white/20 flex items-center justify-center hover:bg-teal-600 transition-colors">
                  <Upload size={16} className="text-white" />
                </div>
              </label>
            </div>

            {/* Name and Headline */}
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => handleFieldChange("full_name", e.target.value)}
                onBlur={handleSave}
                title={formData.full_name || "Your Name"}
                className="text-3xl font-bold text-white bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-teal-500/50 rounded px-2 -ml-2 mb-2 w-full truncate max-w-[200px] md:max-w-[400px]"
                placeholder="Your Name"
              />
              <input
                type="text"
                value={formData.headline}
                onChange={(e) => handleFieldChange("headline", e.target.value)}
                onBlur={handleSave}
                title={formData.headline || "Headline"}
                className="text-lg text-gray-300 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-teal-500/50 rounded px-2 -ml-2 w-full truncate max-w-[200px] md:max-w-[400px]"
                placeholder="e.g., PhD Student in Computer Science"
              />
            </div>

            {/* View Public Profile Button */}
            <Link
              href="/u/username"
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-4 py-2 rounded-lg transition-all"
            >
              <Eye size={16} />
              View Public Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg">
        <div className="flex gap-2 mb-6 border-b border-white/10">
          <button
            onClick={() => setActiveTab("about")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "about"
                ? "text-teal-400 border-b-2 border-teal-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab("education")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "education"
                ? "text-teal-400 border-b-2 border-teal-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Education
          </button>
          <button
            onClick={() => setActiveTab("skills")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "skills"
                ? "text-teal-400 border-b-2 border-teal-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Skills
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* About Tab */}
          {activeTab === "about" && (
            <div className="space-y-4">
              {/* Resume Parser in About Section */}
              <div className="mb-6">
                <ResumeParser onParse={handleResumeParse} />
              </div>
              
              <label className="block text-sm font-medium text-gray-300">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleFieldChange("bio", e.target.value)}
                onBlur={handleSave}
                rows={8}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 transition-colors resize-none"
                placeholder="Tell us about yourself, your research interests, and career goals..."
              />
              {hasUnsavedChanges && (
                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 text-teal-400 font-medium px-4 py-2 rounded-lg transition-all disabled:opacity-50"
                  >
                    <Save size={16} />
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Education Tab */}
          {activeTab === "education" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-300">
                  Education History
                </label>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-4 py-2 rounded-lg transition-all"
                >
                  <Plus size={16} />
                  Add Education
                </button>
              </div>
              <div className="space-y-4">
                {educationHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-300">
                        Education Entry
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveEducation(entry.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">
                          University
                        </label>
                        <input
                          type="text"
                          value={entry.institution}
                          onChange={(e) =>
                            handleEducationChange(entry.id, "institution", e.target.value)
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 transition-colors text-sm"
                          placeholder="University name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">
                          Major
                        </label>
                        <input
                          type="text"
                          value={entry.field}
                          onChange={(e) =>
                            handleEducationChange(entry.id, "field", e.target.value)
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 transition-colors text-sm"
                          placeholder="e.g., Computer Science"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">
                          Degree
                        </label>
                        <input
                          type="text"
                          value={entry.degree}
                          onChange={(e) =>
                            handleEducationChange(entry.id, "degree", e.target.value)
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 transition-colors text-sm"
                          placeholder="e.g., Bachelor's, Master's"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">
                          Year
                        </label>
                        <input
                          type="text"
                          value={entry.year}
                          onChange={(e) =>
                            handleEducationChange(entry.id, "year", e.target.value)
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 transition-colors text-sm"
                          placeholder="e.g., 2020-2024"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {educationHistory.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No education entries. Click "Add Education" to add one.
                  </p>
                )}
              </div>
              {hasUnsavedChanges && (
                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 text-teal-400 font-medium px-4 py-2 rounded-lg transition-all disabled:opacity-50"
                  >
                    <Save size={16} />
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === "skills" && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300">
                Skills
              </label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 transition-colors"
                  placeholder="Add a skill and press Enter"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 text-teal-400 font-medium px-4 py-2 rounded-lg transition-all"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-400 border border-teal-500/30 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              {hasUnsavedChanges && (
                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 text-teal-400 font-medium px-4 py-2 rounded-lg transition-all disabled:opacity-50"
                  >
                    <Save size={16} />
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-400 text-sm p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Toast Notification */}
      <Toast
        message={success ? "Profile saved successfully!" : "Profile auto-filled from Resume!"}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
}
