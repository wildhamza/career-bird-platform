"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile, Job } from "@/lib/supabase/types";
import { 
  Users, 
  Briefcase, 
  GraduationCap, 
  Trash2, 
  UserCheck,
  Shield,
  AlertCircle,
  Database,
  CheckCircle
} from "lucide-react";
import { grants } from "@/lib/data";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalProfessors: 0,
    totalGrants: 0,
  });
  const [users, setUsers] = useState<Profile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const supabase = createClient();

      // Count students (role = 'student' or null/undefined)
      const { count: studentsCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .or("role.is.null,role.eq.student");

      // Count professors (role = 'professor')
      const { count: professorsCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "professor");

      // Count all jobs/grants
      const { count: grantsCount } = await supabase
        .from("jobs")
        .select("*", { count: "exact", head: true });

      setStats({
        totalStudents: studentsCount || 0,
        totalProfessors: professorsCount || 0,
        totalGrants: grantsCount || 0,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users");
        return;
      }

      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchUsers()]);
      setLoading(false);
    };
    loadData();
  }, [fetchStats, fetchUsers]);

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    setActionLoading(userId);
    try {
      const supabase = createClient();
      
      // Delete user's profile
      const { error: deleteError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (deleteError) {
        console.error("Error deleting user:", deleteError);
        setError("Failed to delete user");
        return;
      }

      // Refresh data
      await Promise.all([fetchStats(), fetchUsers()]);
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  };

  const handlePromoteToProfessor = async (userId: string) => {
    setActionLoading(userId);
    try {
      const supabase = createClient();
      
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ role: "professor" })
        .eq("id", userId);

      if (updateError) {
        console.error("Error promoting user:", updateError);
        setError("Failed to promote user");
        return;
      }

      // Refresh data
      await Promise.all([fetchStats(), fetchUsers()]);
    } catch (err) {
      console.error("Error promoting user:", err);
      setError("Failed to promote user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSeedDatabase = async () => {
    if (isSeeding) return; // Prevent double-clicking

    setIsSeeding(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError("User not authenticated");
        setIsSeeding(false);
        return;
      }

      // Map grants to jobs table structure
      const jobsPayload = grants.map((grant) => ({
        professor_id: user.id,
        title: grant.title,
        university: grant.university,
        country: grant.country,
        funding: grant.funding,
        type: grant.type,
        skills: grant.skills,
        degree: grant.degree,
        field: grant.field,
        description: grant.type && grant.field 
          ? `${grant.type} - ${grant.field}. ${grant.professor ? `Professor: ${grant.professor}` : ''}`.trim()
          : grant.type || grant.field || null,
        tryout: grant.tryout || false,
      }));

      // Batch insert into jobs table
      const { error: insertError } = await supabase
        .from("jobs")
        .insert(jobsPayload);

      if (insertError) {
        console.error("Error seeding database:", insertError);
        setError(`Failed to seed database: ${insertError.message}`);
        setIsSeeding(false);
        return;
      }

      // Show success message
      setSuccessMessage(`Successfully seeded ${grants.length} grants!`);
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);

      // Refresh stats
      await fetchStats();
    } catch (err: any) {
      console.error("Error seeding database:", err);
      setError(err.message || "Failed to seed database");
    } finally {
      setIsSeeding(false);
    }
  };

  const getRoleBadge = (role: string | null | undefined) => {
    if (role === "admin") {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-medium">
          <Shield className="w-3 h-3 mr-1" />
          Admin
        </span>
      );
    } else if (role === "professor") {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-medium">
          <Briefcase className="w-3 h-3 mr-1" />
          Professor
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-lg bg-teal-500/20 border border-teal-500/30 text-teal-400 text-xs font-medium">
          <GraduationCap className="w-3 h-3 mr-1" />
          Student
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-400">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-purple-400" />
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        </div>
        <p className="text-gray-400">
          Platform management and user administration
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-300"
          >
            ×
          </button>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 flex items-center gap-2 text-green-400">
          <CheckCircle className="w-5 h-5" />
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage(null)}
            className="ml-auto text-green-400 hover:text-green-300"
          >
            ×
          </button>
        </div>
      )}

      {/* Widget 1: Platform Health */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg">
        <h2 className="text-lg font-semibold text-white mb-6">Platform Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <GraduationCap className="w-6 h-6 text-teal-400" />
              <h3 className="text-sm font-medium text-gray-400">Total Students</h3>
            </div>
            <div className="text-4xl font-bold text-white">{stats.totalStudents}</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Briefcase className="w-6 h-6 text-blue-400" />
              <h3 className="text-sm font-medium text-gray-400">Total Professors</h3>
            </div>
            <div className="text-4xl font-bold text-white">{stats.totalProfessors}</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Briefcase className="w-6 h-6 text-purple-400" />
              <h3 className="text-sm font-medium text-gray-400">Total Grants</h3>
            </div>
            <div className="text-4xl font-bold text-white">{stats.totalGrants}</div>
          </div>
        </div>
      </div>

      {/* Widget: Database Operations */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg">
        <h2 className="text-lg font-semibold text-white mb-6">Database Operations</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={handleSeedDatabase}
            disabled={isSeeding}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
              ${isSeeding 
                ? "bg-blue-500/30 border border-blue-500/50 text-blue-300 cursor-not-allowed" 
                : "bg-white/5 hover:bg-white/10 border border-white/20 text-white hover:border-blue-500/50"}
            `}
          >
            <Database className="w-5 h-5" />
            {isSeeding ? "Seeding Database..." : "Seed Database with Scraped Grants"}
          </button>
          <p className="text-sm text-gray-400">
            Import {grants.length} grants from the static dataset
          </p>
        </div>
      </div>

      {/* Widget 2: User Management */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg">
        <h2 className="text-lg font-semibold text-white mb-6">User Management</h2>
        
        {users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-500 mx-auto mb-4 opacity-50" />
            <p className="text-gray-400">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400">User</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400">Email</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400">Role</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400">University</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400">Joined</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr 
                    key={user.id} 
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                          <Users className="w-5 h-5 text-teal-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {user.full_name || "Anonymous"}
                          </p>
                          <p className="text-xs text-gray-400">ID: {user.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-300">
                        {user.user_id.slice(0, 20)}...
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-300">
                        {user.university || "N/A"}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-xs text-gray-400">
                        {user.created_at 
                          ? new Date(user.created_at).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {user.role !== "admin" && user.role !== "professor" && (
                          <button
                            onClick={() => handlePromoteToProfessor(user.id)}
                            disabled={actionLoading === user.id}
                            className="text-xs bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 font-medium px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                          >
                            <UserCheck className="w-3 h-3" />
                            {actionLoading === user.id ? "Promoting..." : "Promote"}
                          </button>
                        )}
                        {user.role !== "admin" && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={actionLoading === user.id}
                            className="text-xs bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-medium px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            {actionLoading === user.id ? "Deleting..." : "Delete"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
