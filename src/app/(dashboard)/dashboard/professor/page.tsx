"use client";

import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Profile, Job, Application } from "@/lib/supabase/types";
import { 
  Plus, 
  Briefcase, 
  Users, 
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  User
} from "lucide-react";
import PostGrantModal from "@/components/dashboard/professor/PostGrantModal";
import ApplicantModal from "@/components/dashboard/professor/ApplicantModal";

export default function ProfessorDashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isApplicantModalOpen, setIsApplicantModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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

      // Fetch jobs where professor_id matches current user
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("professor_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching jobs:", error);
        return;
      }

      setJobs(data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  }, []);

  const fetchApplications = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      // Fetch applications joined with jobs and student profiles
      // Only get applications for jobs posted by this professor
      const { data: jobsData } = await supabase
        .from("jobs")
        .select("id")
        .eq("professor_id", user.id);

      if (!jobsData || jobsData.length === 0) {
        setApplications([]);
        return;
      }

      const jobIds = jobsData.map(job => job.id);

      const { data, error } = await supabase
        .from("applications")
        .select(`
          *,
          job:jobs(*),
          student_profile:profiles!applications_student_id_fkey(*)
        `)
        .in("job_id", jobIds)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching applications:", error);
        return;
      }

      setApplications(data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchProfile(),
        fetchJobs(),
        fetchApplications()
      ]);
      setLoading(false);
    };
    loadData();
  }, [fetchProfile, fetchJobs, fetchApplications]);

  const handleAcceptApplication = async (applicationId: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("applications")
        .update({ status: "accepted" })
        .eq("id", applicationId);

      if (error) {
        console.error("Error accepting application:", error);
        return;
      }

      // Refresh applications
      await fetchApplications();
      setIsApplicantModalOpen(false);
      setSelectedApplication(null);
    } catch (error) {
      console.error("Error accepting application:", error);
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("applications")
        .update({ status: "rejected" })
        .eq("id", applicationId);

      if (error) {
        console.error("Error rejecting application:", error);
        return;
      }

      // Refresh applications
      await fetchApplications();
      setIsApplicantModalOpen(false);
      setSelectedApplication(null);
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
  };

  const handleReviewApplicant = (application: Application) => {
    setSelectedApplication(application);
    setIsApplicantModalOpen(true);
  };

  const displayName = profile?.full_name || "Professor";

  // Calculate stats
  const pendingApplications = applications.filter(a => a.status === "pending");
  const reviewedApplications = applications.filter(a => a.status === "reviewed");
  const acceptedApplications = applications.filter(a => a.status === "accepted");
  const rejectedApplications = applications.filter(a => a.status === "rejected");

  // Recent applicants (last 10)
  const recentApplicants = applications.slice(0, 10);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Lab Command Center
            </h1>
            <p className="text-gray-400">
              Welcome, {displayName}. Manage your research opportunities and talent pipeline.
            </p>
          </div>
          <button
            onClick={() => setIsPostJobModalOpen(true)}
            className={cn(
              "flex items-center gap-2 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30",
              "text-teal-400 font-medium px-6 py-3 rounded-lg transition-all",
              "hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            )}
          >
            <Plus size={20} />
            Post New Opportunity
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Widget 1: Active Grants (Top Left) */}
        <div className="md:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg hover:border-teal-500/30 transition-all">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm font-medium text-gray-400">Active Grants</h3>
          </div>
          <div className="flex flex-col items-center justify-center py-4 mb-4">
            <span className="text-5xl font-bold text-white mb-2">{jobs.length}</span>
            <span className="text-sm text-gray-400">Active Opportunities</span>
          </div>
          {jobs.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {jobs.slice(0, 5).map((job) => (
                <div
                  key={job.id}
                  className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-teal-500/20 transition-all"
                >
                  <h4 className="text-sm font-semibold text-white mb-1 truncate">
                    {job.title}
                  </h4>
                  <p className="text-xs text-gray-400 truncate">
                    {job.university} • {job.degree}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Briefcase className="w-12 h-12 text-gray-500 mx-auto mb-3 opacity-50" />
              <p className="text-sm text-gray-400 mb-3">No active grants</p>
              <button
                onClick={() => setIsPostJobModalOpen(true)}
                className="text-xs text-teal-400 hover:text-teal-300 transition-colors"
              >
                Post your first grant →
              </button>
            </div>
          )}
        </div>

        {/* Widget 2: Talent Pipeline (Top Right) */}
        <div className="md:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg hover:border-teal-500/30 transition-all">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm font-medium text-gray-400">Talent Pipeline</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-sm text-gray-400">Pending Review</p>
                  <p className="text-2xl font-bold text-white">{pendingApplications.length}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Interviewing</p>
                  <p className="text-2xl font-bold text-white">{reviewedApplications.length}</p>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Total Applicants</span>
                <span className="text-xl font-bold text-white">{applications.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Widget 3: Recent Applicants (Main - Spans 2 columns) */}
        <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm font-medium text-gray-400">Recent Applicants</h3>
          </div>
          
          {recentApplicants.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-500 mx-auto mb-4 opacity-50" />
              <p className="text-gray-400">No applications yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-400">Candidate</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-400">R-Score</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-400">Applied For</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-400">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplicants.map((application) => {
                    const studentProfile = application.student_profile as Profile | undefined;
                    const job = application.job as Job | undefined;
                    const status = application.status;
                    
                    return (
                      <tr 
                        key={application.id} 
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
                              <User className="w-4 h-4 text-teal-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">
                                {studentProfile?.full_name || "Anonymous"}
                              </p>
                              <p className="text-xs text-gray-400">
                                {studentProfile?.university || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {studentProfile?.r_score !== null && studentProfile?.r_score !== undefined ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-lg bg-teal-500/20 border border-teal-500/30 text-teal-400 text-xs font-medium">
                              {studentProfile.r_score}/100
                            </span>
                          ) : (
                            <span className="text-xs text-gray-500">Pending</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-white">{job?.title || "N/A"}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-xs text-gray-400">
                            {application.created_at 
                              ? new Date(application.created_at).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleReviewApplicant(application)}
                            className="text-xs bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 text-teal-400 font-medium px-3 py-1.5 rounded-lg transition-all"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <PostGrantModal
        isOpen={isPostJobModalOpen}
        onClose={() => setIsPostJobModalOpen(false)}
        onSuccess={() => {
          fetchJobs();
          fetchApplications();
        }}
      />

      <ApplicantModal
        isOpen={isApplicantModalOpen}
        onClose={() => {
          setIsApplicantModalOpen(false);
          setSelectedApplication(null);
        }}
        application={selectedApplication}
        onAccept={handleAcceptApplication}
        onReject={handleRejectApplication}
      />
    </div>
  );
}
