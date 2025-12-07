"use client";

import React, { useRef, useEffect, useMemo } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import { grants } from "@/lib/data";
import { getCountryCoordinates, getUniversityCoordinates, countryCoordinates } from "@/lib/coordinates";

interface Globe3DProps {
  searchQuery?: string;
  onGlobeReady?: (globeRef: GlobeMethods) => void;
}

export default function Globe3D({ searchQuery, onGlobeReady }: Globe3DProps) {
  const globeRef = useRef<GlobeMethods>(null);

  // Source countries (Pakistan/India)
  const sourceCountries = [
    { lat: 30.3753, lng: 69.3451 }, // Pakistan
    { lat: 20.5937, lng: 78.9629 }, // India
  ];

  // Generate arcs from source countries to grant destinations
  const arcs = useMemo(() => {
    const uniqueDestinations = new Set<string>();
    grants.forEach((grant) => {
      if (grant.country && grant.country !== "Pakistan" && grant.country !== "India") {
        uniqueDestinations.add(grant.country);
      }
    });

    const arcData: Array<{
      startLat: number;
      startLng: number;
      endLat: number;
      endLng: number;
      country: string;
    }> = [];

    uniqueDestinations.forEach((country) => {
      const destCoords = getCountryCoordinates(country);
      sourceCountries.forEach((source) => {
        arcData.push({
          startLat: source.lat,
          startLng: source.lng,
          endLat: destCoords.lat,
          endLng: destCoords.lng,
          country,
        });
      });
    });

    return arcData;
  }, []);

  // Generate markers for universities
  const markers = useMemo(() => {
    return grants
      .map((grant) => {
        const coords = getUniversityCoordinates(grant.university);
        if (!coords) return null;
        return {
          id: grant.id,
          lat: coords.lat,
          lng: coords.lng,
          size: 0.15,
          color: grant.tryout ? "#fbbf24" : "#06b6d4", // Gold for tryout, cyan for others
          grant,
        };
      })
      .filter((m): m is NonNullable<typeof m> => m !== null);
  }, []);

  // Filter markers based on search query
  const filteredMarkers = useMemo(() => {
    if (!searchQuery) return markers;
    const query = searchQuery.toLowerCase();
    return markers.filter(
      (marker) =>
        marker.grant.country.toLowerCase().includes(query) ||
        marker.grant.university.toLowerCase().includes(query) ||
        marker.grant.title.toLowerCase().includes(query) ||
        marker.grant.skills.some((skill) => skill.toLowerCase().includes(query))
    );
  }, [markers, searchQuery]);

  // Filter arcs based on search query
  const filteredArcs = useMemo(() => {
    if (!searchQuery) return arcs;
    const query = searchQuery.toLowerCase();
    return arcs.filter((arc) => arc.country.toLowerCase().includes(query));
  }, [arcs, searchQuery]);

  // Expose flyTo function via ref
  useEffect(() => {
    if (globeRef.current && onGlobeReady) {
      onGlobeReady(globeRef.current);
    }
  }, [onGlobeReady]);

  // Handle search query changes - fly to country
  useEffect(() => {
    if (!globeRef.current || !searchQuery) return;

    // First, try to match directly against country names
    const matchingCountry = Object.keys(countryCoordinates).find(
      (country) => country.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matchingCountry) {
      const coords = getCountryCoordinates(matchingCountry);
      if (coords.lat !== 0 && coords.lng !== 0) {
        globeRef.current.pointOfView(
          {
            lat: coords.lat,
            lng: coords.lng,
            altitude: coords.altitude,
          },
          2000 // Animation duration in ms
        );
        return;
      }
    }

    // Fallback: Try to find a matching country from grants
    const matchingGrant = grants.find(
      (grant) =>
        grant.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grant.university.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matchingGrant) {
      const coords = getCountryCoordinates(matchingGrant.country);
      if (coords.lat !== 0 && coords.lng !== 0) {
        globeRef.current.pointOfView(
          {
            lat: coords.lat,
            lng: coords.lng,
            altitude: coords.altitude,
          },
          2000 // Animation duration in ms
        );
      }
    }
  }, [searchQuery]);

  return (
    <div className="h-full w-full">
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      arcsData={filteredArcs}
      arcStartLat={(d: any) => d.startLat}
      arcStartLng={(d: any) => d.startLng}
      arcEndLat={(d: any) => d.endLat}
      arcEndLng={(d: any) => d.endLng}
      arcColor={(d: any) => {
        // Gradient from teal to purple
        return d.country === "Germany" || d.country === "USA" || d.country === "UK"
          ? ["rgba(6, 182, 212, 0.6)", "rgba(168, 85, 247, 0.6)"] // Teal to Purple
          : ["rgba(6, 182, 212, 0.4)", "rgba(168, 85, 247, 0.4)"];
      }}
      arcDashLength={0.4}
      arcDashGap={0.2}
      arcDashAnimateTime={2000}
      arcStroke={1.5}
      pointsData={filteredMarkers}
      pointLat="lat"
      pointLng="lng"
      pointColor="color"
      pointRadius="size"
      pointResolution={2}
      pointLabel={(d: any) => `
        <div style="
          background: rgba(11, 15, 25, 0.95);
          border: 1px solid rgba(6, 182, 212, 0.3);
          border-radius: 8px;
          padding: 12px;
          color: white;
          font-size: 12px;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        ">
          <div style="font-weight: 600; color: #06b6d4; margin-bottom: 4px;">
            ${d.grant.university}
          </div>
          <div style="font-size: 11px; color: #94a3b8; margin-bottom: 4px;">
            ${d.grant.title}
          </div>
          <div style="font-size: 10px; color: #fbbf24;">
            ${d.grant.funding}
          </div>
        </div>
      `}
      onPointHover={(point: any, prevPoint: any) => {
        // Optional: Add hover effects
      }}
      // Custom atmosphere
      showAtmosphere={true}
      atmosphereColor="#fbbf24"
      atmosphereAltitude={0.15}
      // Initial camera position
      initialCameraPosition={{ lat: 0, lng: 0, altitude: 2.5 }}
      />
    </div>
  );
}

// Export flyTo function for external use
export function flyToCountry(globeRef: React.RefObject<GlobeMethods>, country: string) {
  if (!globeRef.current) return;
  
  const coords = getCountryCoordinates(country);
  if (coords.lat !== 0 && coords.lng !== 0) {
    globeRef.current.pointOfView(
      {
        lat: coords.lat,
        lng: coords.lng,
        altitude: coords.altitude,
      },
      2000
    );
  }
}

