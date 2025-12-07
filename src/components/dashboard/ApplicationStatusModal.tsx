"use client";

import React from "react";
import { X, CheckCircle2, Loader2 } from "lucide-react";

interface ApplicationStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  grantTitle?: string;
  grantUniversity?: string;
}

export default function ApplicationStatusModal({
  isOpen,
  onClose,
  grantTitle,
  grantUniversity,
}: ApplicationStatusModalProps) {
  if (!isOpen) return null;

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
          <h3 className="text-xl font-semibold text-white">Application Status</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {grantTitle && (
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-1">{grantTitle}</h4>
            {grantUniversity && (
              <p className="text-sm text-gray-400">{grantUniversity}</p>
            )}
          </div>
        )}

        {/* Timeline */}
        <div className="space-y-6">
          {/* Step 1: Applied */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 border-2 border-teal-500 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-teal-400" />
              </div>
              <div className="w-0.5 h-16 bg-teal-500/20 mt-2" />
            </div>
            <div className="flex-1 pt-1">
              <p className="text-sm font-medium text-white">Applied</p>
              <p className="text-xs text-gray-400 mt-1">Your application has been submitted</p>
              <p className="text-xs text-teal-400 mt-1">Completed</p>
            </div>
          </div>

          {/* Step 2: Under Review */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 border-2 border-teal-500 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />
              </div>
            </div>
            <div className="flex-1 pt-1">
              <p className="text-sm font-medium text-white">Under Review</p>
              <p className="text-xs text-gray-400 mt-1">Your application is being reviewed by the lab</p>
              <p className="text-xs text-teal-400 mt-1">In Progress</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 text-teal-400 font-medium py-3 rounded-lg transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

