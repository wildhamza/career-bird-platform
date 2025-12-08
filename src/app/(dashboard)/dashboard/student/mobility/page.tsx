"use client";

import React, { useState } from "react";
import { 
  Shield, 
  Landmark, 
  Plane, 
  Wifi, 
  Home, 
  Users, 
  CreditCard,
  X,
  CheckCircle2
} from "lucide-react";

interface MobilityService {
  id: string;
  title: string;
  provider: string;
  category: "Bureaucracy" | "Lifestyle" | "Community & Finance";
  priority: "High Priority" | "High Volume" | "Sticky";
  icon: React.ReactNode;
  badge?: string;
  action: string;
  price?: string;
  status?: string;
  recommended?: boolean;
}

const mobilityServices: MobilityService[] = [
  // Category A: Bureaucracy (High Priority)
  {
    id: "health-insurance",
    title: "Health Insurance",
    provider: "Feather/TK",
    category: "Bureaucracy",
    priority: "High Priority",
    icon: <Shield className="w-6 h-6" />,
    badge: "Mandatory for Visa",
    action: "Get Quote",
    recommended: true,
  },
  {
    id: "blocked-account",
    title: "Blocked Account",
    provider: "Fintiba",
    category: "Bureaucracy",
    priority: "High Priority",
    icon: <Landmark className="w-6 h-6" />,
    badge: "Instant Setup",
    action: "Open Account",
  },
  {
    id: "visa-processing",
    title: "Visa Processing",
    provider: "LegalTech",
    category: "Bureaucracy",
    priority: "High Priority",
    icon: <Landmark className="w-6 h-6" />,
    status: "Consultation Available",
    action: "View Details",
  },
  // Category B: Lifestyle (High Volume)
  {
    id: "housing",
    title: "Housing",
    provider: "UniPlaces",
    category: "Lifestyle",
    priority: "High Volume",
    icon: <Home className="w-6 h-6" />,
    badge: "Verified Dorms",
    action: "Browse Rooms",
  },
  {
    id: "travel",
    title: "Travel",
    provider: "StudentUniverse",
    category: "Lifestyle",
    priority: "High Volume",
    icon: <Plane className="w-6 h-6" />,
    badge: "Student Fares",
    action: "Book Flight",
  },
  {
    id: "connectivity",
    title: "Connectivity",
    provider: "Airalo",
    category: "Lifestyle",
    priority: "High Volume",
    icon: <Wifi className="w-6 h-6" />,
    badge: "eSIM Ready",
    action: "Get Data",
  },
  // Category C: Community & Finance (Sticky)
  {
    id: "mentorship",
    title: "Mentorship",
    provider: "Career Bird",
    category: "Community & Finance",
    priority: "Sticky",
    icon: <Users className="w-6 h-6" />,
    action: "Connect",
    price: "$50/session",
  },
  {
    id: "bridge-loan",
    title: "Bridge Loan",
    provider: "Career Bird Finance",
    category: "Community & Finance",
    priority: "Sticky",
    icon: <CreditCard className="w-6 h-6" />,
    status: "Apply with Offer Letter",
    action: "View Details",
  },
];

interface RedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerName: string;
}

function RedirectModal({ isOpen, onClose, providerName }: RedirectModalProps) {
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
          <h3 className="text-xl font-semibold text-white">Redirecting to Partner</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-teal-400" />
            <p className="text-white">
              Redirecting to <span className="font-semibold text-teal-400">{providerName}</span>...
            </p>
          </div>
          <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-4">
            <p className="text-sm text-teal-400">
              <span className="font-semibold">Commission Tracking:</span> Active
            </p>
            <p className="text-xs text-teal-400/70 mt-1">
              Your referral will be tracked automatically.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 text-teal-400 font-medium py-3 rounded-lg transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MobilityOSPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleServiceClick = (service: MobilityService) => {
    setSelectedService(service.provider);
    setIsModalOpen(true);
  };

  const groupedServices = {
    Bureaucracy: mobilityServices.filter(s => s.category === "Bureaucracy"),
    Lifestyle: mobilityServices.filter(s => s.category === "Lifestyle"),
    "Community & Finance": mobilityServices.filter(s => s.category === "Community & Finance"),
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Mobility Command Center
        </h1>
        <p className="text-slate-400 text-lg">
          The entire relocation process, handled.
        </p>
      </div>

      {/* Service Categories */}
      {Object.entries(groupedServices).map(([category, services]) => (
        <div key={category} className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-white">{category}</h2>
            <span className="text-xs text-slate-500 bg-white/5 px-2 py-1 rounded">
              {services[0]?.priority}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:border-teal-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/10 hover:-translate-y-1"
              >
                {/* Recommended Badge */}
                {service.recommended && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-teal-500/20 text-teal-400 border border-teal-500/30 px-2 py-1 rounded-full text-xs font-medium">
                      Recommended
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className="mb-4 text-teal-400 group-hover:text-teal-300 transition-colors">
                  {service.icon}
                </div>

                {/* Title & Provider */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-teal-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-400">{service.provider}</p>
                </div>

                {/* Badge or Status */}
                {service.badge && (
                  <div className="mb-4">
                    <span className="inline-block bg-white/5 text-slate-300 border border-white/10 px-3 py-1 rounded-full text-xs">
                      {service.badge}
                    </span>
                  </div>
                )}

                {service.status && (
                  <div className="mb-4">
                    <p className="text-sm text-slate-400">{service.status}</p>
                  </div>
                )}

                {/* Price */}
                {service.price && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-teal-400">{service.price}</p>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => handleServiceClick(service)}
                  className="w-full bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-400 font-medium py-3 rounded-lg transition-all group-hover:border-teal-400 group-hover:text-teal-300"
                >
                  {service.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Redirect Modal */}
      <RedirectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedService(null);
        }}
        providerName={selectedService || "Partner"}
      />
    </div>
  );
}
