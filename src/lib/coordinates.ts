// src/lib/coordinates.ts
// Country to Latitude/Longitude/Altitude mapping for Globe navigation

export interface CountryCoordinates {
  lat: number;
  lng: number;
  altitude: number; // Camera altitude for zoom level
}

export const countryCoordinates: Record<string, CountryCoordinates> = {
  // Source Countries
  Pakistan: { lat: 30.3753, lng: 69.3451, altitude: 2.0 },
  India: { lat: 20.5937, lng: 78.9629, altitude: 2.0 },
  
  // Destination Countries
  Germany: { lat: 51.1657, lng: 10.4515, altitude: 1.5 },
  USA: { lat: 37.0902, lng: -95.7129, altitude: 1.5 },
  UK: { lat: 55.3781, lng: -3.4360, altitude: 1.8 },
  "Saudi Arabia": { lat: 23.8859, lng: 45.0792, altitude: 1.8 },
  Singapore: { lat: 1.3521, lng: 103.8198, altitude: 2.0 },
  "South Korea": { lat: 35.9078, lng: 127.7669, altitude: 1.8 },
  Canada: { lat: 56.1304, lng: -106.3468, altitude: 1.5 },
};

// University-specific coordinates for markers
export const universityCoordinates: Record<string, { lat: number; lng: number }> = {
  "TUM Munich": { lat: 48.1496, lng: 11.5679 },
  "Max Planck Institute": { lat: 52.5200, lng: 13.4050 },
  "KAUST": { lat: 22.3092, lng: 39.1042 },
  "UIUC": { lat: 40.1020, lng: -88.2272 },
  "UC Berkeley": { lat: 37.8719, lng: -122.2585 },
  "NUS Singapore": { lat: 1.2966, lng: 103.7764 },
  "KAIST": { lat: 36.3736, lng: 127.3620 },
  "Mila / U of Montreal": { lat: 45.5017, lng: -73.5673 },
};

// Get coordinates for a country, with fallback
export function getCountryCoordinates(country: string): CountryCoordinates {
  return countryCoordinates[country] || { lat: 0, lng: 0, altitude: 2.0 };
}

// Get coordinates for a university
export function getUniversityCoordinates(university: string): { lat: number; lng: number } | null {
  return universityCoordinates[university] || null;
}

