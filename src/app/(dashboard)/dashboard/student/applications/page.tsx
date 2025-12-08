"use client";

import React from "react";
import { Briefcase, Calendar, Building2, CheckCircle2, Clock, XCircle } from "lucide-react";

// Dummy data for applications
const dummyApplications = [
  {
    id: "1",
    jobTitle: "Deep Learning for Medical Imaging",
    university: "TUM Munich",
    status: "Applied",
    date: "2024-01-15",
    statusColor: "text-blue-400",
    statusBg: "bg-blue-500/20",
    statusBorder: "border-blue-500/30",
  },
  {
    id: "2",
    jobTitle: "Privacy-Preserving Machine Learning",
    university: "Max Planck Institute",
    status: "Under Review",
    date: "2024-01-10",
    statusColor: "text-yellow-400",
    statusBg: "bg-yellow-500/20",
    statusBorder: "border-yellow-500/30",
  },
  {
    id: "3",
    jobTitle: "6G Wireless Communication Systems",
    university: "KAUST",
    status: "Interview Scheduled",
    date: "2024-01-05",
    statusColor: "text-purple-400",
    statusBg: "bg-purple-500/20",
    statusBorder: "border-purple-500/30",
  },
  {
    id: "4",
    jobTitle: "Generative AI for Visual Computing",
    university: "KAUST",
    status: "Rejected",
    date: "2023-12-20",
    statusColor: "text-red-400",
    statusBg: "bg-red-500/20",
    statusBorder: "border-red-500/30",
  },
];

function getStatusIcon(status: string) {
  switch (status) {
    case "Applied":
      return <CheckCircle2 className="w-4 h-4" />;
    case "Under Review":
      return <Clock className="w-4 h-4" />;
    case "Interview Scheduled":
      return <Calendar className="w-4 h-4" />;
    case "Rejected":
      return <XCircle className="w-4 h-4" />;
    default:
      return <Briefcase className="w-4 h-4" />;
  }
}

export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg">
        <h1 className="text-3xl font-bold text-white mb-2">My Applications</h1>
        <p className="text-gray-400">Track the status of your grant applications</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                  Job Title
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                  University
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {dummyApplications.map((application) => (
                <tr
                  key={application.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-teal-400" />
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {application.jobTitle}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      {application.university}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 ${application.statusBg} ${application.statusColor} ${application.statusBorder} border px-3 py-1 rounded-full text-xs font-medium`}
                    >
                      {getStatusIcon(application.status)}
                      {application.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      {new Date(application.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {dummyApplications.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No applications yet</p>
            <p className="text-gray-500 text-sm mt-2">
              Start applying to grants to see them here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
