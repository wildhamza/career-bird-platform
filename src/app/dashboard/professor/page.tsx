"use client";

import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Profile, Job, Application } from "@/lib/supabase/types";
import { 
  Plus, 
  Users, 
  Briefcase, 
  X, 
  CheckCircle, 
  Clock, 
  XCircle,
  Mail,
  User,
  FileText,
  GraduationCap
} from "lucide-react";

// Post Job Modal Component
function PostJobModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    university: "",
    country: "",
    funding: "",
    type: "Full Funding",
    skills: "",
    degree: "PhD" as 'MS' | 'PhD',
    field: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      const skillsArray = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      // In a real app, this would insert into a 'jobs' table
      // For now, we'll just show success
      console.log("Posting job:", { ...formData, skills: skillsArray, professor_id: user.id });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      onSuccess();
      onClose();
      setFormData({
        title: "",
        university: "",
        country: "",
        funding: "",
        type: "Full Funding",
        skills: "",
        degree: "PhD",
        field: "",
        description: ""
      });
    } catch (err: any) {
      setError(err.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-white">Post a Job</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-slate-200 placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g., Deep Learning for Medical Imaging"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                University *
              </label>
              <input
                type="text"
                required
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-slate-200 placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g., MIT"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Country *
              </label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-slate-200 placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g., USA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Funding *
              </label>
              <input
                type="text"
                required
                value={formData.funding}
                onChange={(e) => setFormData({ ...formData, funding: e.target.value })}
                className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-slate-200 placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g., $30k/yr Tax-Free"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-slate-200 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Full Funding">Full Funding</option>
                <option value="Partial">Partial</option>
                <option value="Research Assistantship">Research Assistantship</option>
                <option value="Self-Funded">Self-Funded</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Degree Level *
              </label>
              <select
                required
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value as 'MS' | 'PhD' })}
                className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-slate-200 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="MS">Master's (MS)</option>
                <option value="PhD">PhD</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Field *
              </label>
              <input
                type="text"
                required
                value={formData.field}
                onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-slate-200 placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g., Computer Science"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Skills (comma-separated) *
              </label>
              <input
                type="text"
                required
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-slate-200 placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g., Python, Machine Learning, PyTorch"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-slate-200 placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Describe the research opportunity..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-white/10 bg-white/5 px-4 py-3 text-gray-300 hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "flex-1 rounded-md border border-teal-500 bg-teal-500/10 px-4 py-3",
                "text-teal-400 font-medium transition-all",
                "hover:bg-teal-500/20 hover:shadow-[0_0_20px_rgba(0,128,128,0.5)]",
                loading && "opacity-50 cursor-not-allowed"
              )}
            >
              {loading ? "Posting..." : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Claim Profile Modal Component
function ClaimProfileModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      // In a real app, this would check if the email matches a professor profile
      // and link the account. For now, we'll simulate it.
      console.log("Claiming profile for email:", email);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setEmail("");
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to claim profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-white">Claim Profile</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg text-sm">
              Profile claimed successfully! Redirecting...
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="professor@university.edu"
            />
            <p className="mt-2 text-xs text-gray-400">
              Enter the email address you received the invitation from
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-white/10 bg-white/5 px-4 py-3 text-gray-300 hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className={cn(
                "flex-1 rounded-md border border-teal-500 bg-teal-500/10 px-4 py-3",
                "text-teal-400 font-medium transition-all",
                "hover:bg-teal-500/20 hover:shadow-[0_0_20px_rgba(0,128,128,0.5)]",
                (loading || success) && "opacity-50 cursor-not-allowed"
              )}
            >
              {loading ? "Claiming..." : success ? "Success!" : "Claim Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProfessorDashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "jobs" | "applicants">("overview");

  const fetchProfile = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }, []);

  const fetchJobs = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      // In a real app, this would query the 'jobs' table
      // For now, we'll use empty array
      setJobs([]);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  }, []);

  const fetchApplications = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      // In a real app, this would query the 'applications' table joined with profiles and jobs
      // For now, we'll use empty array
      setApplications([]);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchJobs();
    fetchApplications();
  }, [fetchProfile, fetchJobs, fetchApplications]);

  const displayName = profile?.full_name || "Professor";

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'reviewed':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      case 'reviewed':
        return 'Under Review';
      default:
        return 'Pending';
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome, {displayName}
            </h1>
            <p className="text-slate-400">
              Manage your research opportunities and connect with talent
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsClaimModalOpen(true)}
              className={cn(
                "flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2",
                "text-gray-300 hover:bg-white/10 transition-all"
              )}
            >
              <Mail size={16} />
              Claim Profile
            </button>
            <button
              onClick={() => setIsPostJobModalOpen(true)}
              className={cn(
                "flex items-center gap-2 rounded-md border border-teal-500 bg-teal-500/10 px-4 py-2",
                "text-teal-400 hover:bg-teal-500/20 transition-all",
                "hover:shadow-[0_0_20px_rgba(0,128,128,0.5)]"
              )}
            >
              <Plus size={16} />
              Post a Job
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-white/10">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={cn(
              "px-4 py-2 border-b-2 transition-all",
              activeTab === "overview"
                ? "border-teal-500 text-teal-400"
                : "border-transparent text-gray-400 hover:text-white"
            )}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={cn(
              "px-4 py-2 border-b-2 transition-all",
              activeTab === "jobs"
                ? "border-teal-500 text-teal-400"
                : "border-transparent text-gray-400 hover:text-white"
            )}
          >
            My Jobs ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab("applicants")}
            className={cn(
              "px-4 py-2 border-b-2 transition-all",
              activeTab === "applicants"
                ? "border-teal-500 text-teal-400"
                : "border-transparent text-gray-400 hover:text-white"
            )}
          >
            My Applicants ({applications.length})
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-teal-400" />
              <h3 className="text-sm font-medium text-gray-400">Active Jobs</h3>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{jobs.length}</div>
            <p className="text-sm text-gray-400">Posted opportunities</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-teal-400" />
              <h3 className="text-sm font-medium text-gray-400">Total Applicants</h3>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{applications.length}</div>
            <p className="text-sm text-gray-400">Student applications</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-teal-400" />
              <h3 className="text-sm font-medium text-gray-400">Accepted</h3>
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {applications.filter(a => a.status === 'accepted').length}
            </div>
            <p className="text-sm text-gray-400">Successful matches</p>
          </div>

          {jobs.length === 0 && applications.length === 0 && (
            <div className="md:col-span-3 flex items-center justify-center min-h-[400px]">
              <div className="rounded-lg border border-slate-800 bg-black/50 p-12 backdrop-blur-sm text-center max-w-md">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-teal-500/30 bg-teal-500/10 mb-4">
                    <Plus className="w-8 h-8 text-teal-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Post Your First Grant
                  </h2>
                  <p className="text-slate-400 text-sm">
                    Start recruiting talented students for your research projects
                  </p>
                </div>
                <button
                  onClick={() => setIsPostJobModalOpen(true)}
                  className={cn(
                    "w-full rounded-md border border-teal-500 bg-teal-500/10 px-6 py-4",
                    "text-base font-semibold text-teal-400 transition-all",
                    "hover:bg-teal-500/20 hover:shadow-[0_0_25px_rgba(0,128,128,0.5)]"
                  )}
                >
                  Post New Grant
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "jobs" && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">My Jobs</h3>
            <button
              onClick={() => setIsPostJobModalOpen(true)}
              className={cn(
                "flex items-center gap-2 rounded-md border border-teal-500 bg-teal-500/10 px-4 py-2",
                "text-teal-400 hover:bg-teal-500/20 transition-all"
              )}
            >
              <Plus size={16} />
              Post New Job
            </button>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No jobs posted yet</p>
              <button
                onClick={() => setIsPostJobModalOpen(true)}
                className={cn(
                  "rounded-md border border-teal-500 bg-teal-500/10 px-6 py-3",
                  "text-teal-400 hover:bg-teal-500/20 transition-all"
                )}
              >
                Post Your First Job
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-teal-500/30 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white mb-2">{job.title}</h4>
                      <p className="text-sm text-gray-400 mb-2">
                        {job.university} • {job.country} • {job.degree}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {job.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="text-xs bg-white/5 text-gray-300 px-2 py-1 rounded border border-white/5"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "applicants" && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">My Applicants</h3>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No applications yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Student</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Job</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">University</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">R-Score</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application) => (
                    <tr key={application.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                            <User className="w-5 h-5 text-teal-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {application.student_profile?.full_name || "Anonymous"}
                            </p>
                            <p className="text-xs text-gray-400">
                              {application.student_profile?.university || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-white">{application.job?.title || "N/A"}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-300">
                          {application.student_profile?.university || "N/A"}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-white">
                          {application.student_profile?.r_score ?? "Pending"}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(application.status)}
                          <span className="text-sm text-gray-300">
                            {getStatusText(application.status)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button className="text-teal-400 hover:text-teal-300 transition-colors">
                            <FileText size={16} />
                          </button>
                          <button className="text-teal-400 hover:text-teal-300 transition-colors">
                            <Mail size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <PostJobModal
        isOpen={isPostJobModalOpen}
        onClose={() => setIsPostJobModalOpen(false)}
        onSuccess={() => {
          fetchJobs();
          setActiveTab("jobs");
        }}
      />

      <ClaimProfileModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        onSuccess={() => {
          fetchProfile();
        }}
      />
    </>
  );
}
