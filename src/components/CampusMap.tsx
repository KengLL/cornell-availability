import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  BUILDING_COORDINATES,
  CAMPUS_AREAS,
  CAMPUS_CENTER,
  CAMPUS_DEFAULT_ZOOM,
} from '../data/buildingCoordinates';
import { useAvailabilityContext } from '../context/AvailabilityContext';

// Abbreviate building name (first 4 chars or smart abbreviation)
function abbreviateName(name: string): string {
  // Common abbreviations
  const abbrevMap: Record<string, string> = {
    'Goldwin Smith Hall': 'GSH',
    'Lincoln Hall': 'LINC',
    'Morrill Hall': 'MORR',
    'White Hall': 'WHTE',
    'Rockefeller Hall': 'ROCK',
    'Stimson Hall': 'STIM',
    'Baker Laboratory': 'BAKR',
    'Olin Library': 'OLIB',
    'Uris Library': 'ULIB',
    'Olin Hall': 'OLIN',
    'Upson Hall': 'UPSN',
    'Phillips Hall': 'PHIL',
    'Hollister Hall': 'HOLL',
    'Frank H T Rhodes Hall': 'RHDS',
    'Bill and Melinda Gates Hll': 'GATE',
    'Carpenter Hall': 'CARP',
    'Computing Information Sci': 'CIS',
    'Mann Library': 'MANN',
  };
  return abbrevMap[name] || name.substring(0, 4).toUpperCase();
}

// Create a custom marker icon for buildings
function createBuildingIcon(name: string, availableRooms: number, totalRooms: number) {
  const ratio = totalRooms > 0 ? availableRooms / totalRooms : 0;
  // Color gradient based on availability ratio
  let bgColor: string;
  if (ratio >= 0.5) {
    bgColor = '#16A34A'; // green-600
  } else if (ratio >= 0.25) {
    bgColor = '#CA8A04'; // yellow-600
  } else if (ratio > 0) {
    bgColor = '#EA580C'; // orange-600
  } else {
    bgColor = '#DC2626'; // red-600
  }

  const abbrev = abbreviateName(name);
  return L.divIcon({
    className: 'custom-building-marker',
    html: `
      <div style="
        position: relative;
        background: ${bgColor};
        color: white;
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 700;
        white-space: nowrap;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        cursor: pointer;
        border: 2px solid white;
        text-align: center;
        min-width: 50px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
      ">
        <span>${abbrev}</span>
        <span style="font-size: 10px; font-weight: 600; opacity: 0.9;">${availableRooms}/${totalRooms}</span>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [30, 20],
  });
}

// Component to handle map navigation
function MapController({ area }: { area: { center: { lat: number; lng: number }; zoom: number; key: number } | null }) {
  const map = useMap();
  const processedKeyRef = useRef<number | null>(null);

  useEffect(() => {
    if (area && area.key !== processedKeyRef.current) {
      processedKeyRef.current = area.key;
      map.flyTo([area.center.lat, area.center.lng], map.getZoom(), {
        duration: 0.8,
      });
    }
  }, [area, map]);

  return null;
}

function TrackpadPanController() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    const handleWheel = (event: WheelEvent) => {
      if (event.deltaX !== 0 || event.deltaY !== 0) {
        event.preventDefault();
        map.panBy([event.deltaX, event.deltaY], { animate: false });
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [map]);

  return null;
}

// Component to track map center and mouse position
// function CoordinateTracker({
//   onCenterChange,
//   onMouseMove,
// }: {
//   onCenterChange: (lat: number, lng: number) => void;
//   onMouseMove: (lat: number, lng: number) => void;
// }) {
//   const map = useMapEvents({
//     moveend: () => {
//       const center = map.getCenter();
//       onCenterChange(center.lat, center.lng);
//     },
//     mousemove: (e) => {
//       onMouseMove(e.latlng.lat, e.latlng.lng);
//     },
//   });

//   // Get initial center
//   useEffect(() => {
//     const center = map.getCenter();
//     onCenterChange(center.lat, center.lng);
//   }, [map, onCenterChange]);

//   return null;
// }

export function CampusMap() {
  const { buildings, setSelectedBuilding } = useAvailabilityContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [targetArea, setTargetArea] = useState<{ center: { lat: number; lng: number }; zoom: number; key: number } | null>(null);
  // const [mapCenter, setMapCenter] = useState({ lat: CAMPUS_CENTER.lat, lng: CAMPUS_CENTER.lng });
  // const [mousePos, setMousePos] = useState<{ lat: number; lng: number } | null>(null);

  const handleAreaClick = (areaKey: keyof typeof CAMPUS_AREAS) => {
    const area = CAMPUS_AREAS[areaKey];
    setTargetArea({ ...area, key: Date.now() });
  };

  // Get buildings with coordinates and their availability status
  const buildingsWithCoords = BUILDING_COORDINATES.map((coord) => {
    const buildingData = buildings.find((b) => b.name === coord.name);
    return {
      ...coord,
      availableRooms: buildingData?.availableRooms ?? 0,
      totalRooms: buildingData?.totalRooms ?? 0,
    };
  });

  return (
    <div className="relative h-full">
      {/* Map container - full size */}
      <MapContainer
        center={[CAMPUS_CENTER.lat, CAMPUS_CENTER.lng]}
        zoom={CAMPUS_DEFAULT_ZOOM}
        minZoom={CAMPUS_DEFAULT_ZOOM}
        maxZoom={CAMPUS_DEFAULT_ZOOM}
        className="w-full h-full"
        style={{ minHeight: '500px' }}
        zoomControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        dragging={false}
        boxZoom={false}
        keyboard={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController area={targetArea} />
        <TrackpadPanController />
        {/* <CoordinateTracker
          onCenterChange={(lat, lng) => setMapCenter({ lat, lng })}
          onMouseMove={(lat, lng) => setMousePos({ lat, lng })}
        /> */}
        {/* Building markers */}
        {buildingsWithCoords.map((building) => (
          <Marker
            key={building.name}
            position={[building.lat, building.lng]}
            icon={createBuildingIcon(building.name, building.availableRooms, building.totalRooms)}
            eventHandlers={{
              click: () => setSelectedBuilding(building.name),
            }}
          />
        ))}
      </MapContainer>

      {/* Floating controls overlay */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-wrap gap-4 items-center justify-between pointer-events-none">
        {/* Search input */}
        <div className="relative flex-1 min-w-[200px] max-w-md pointer-events-auto">
          <input
            type="text"
            placeholder="Search buildings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white shadow-lg focus:ring-2 focus:ring-cornell-red focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-1 pointer-events-auto bg-white rounded-lg shadow-lg p-1">
          {(['west', 'north', 'central', 'south', 'east'] as const).map((area) => (
            <button
              key={area}
              onClick={() => handleAreaClick(area)}
              className="px-3 py-1.5 text-xs font-semibold rounded-md bg-gray-100 text-gray-700 hover:bg-cornell-red hover:text-white transition-colors"
            >
              {area.charAt(0).toUpperCase() + area.slice(1, 4).toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Coordinate display - bottom left */}
      {/* <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 rounded-lg shadow-lg p-3 font-mono text-xs pointer-events-none">
        <div className="text-gray-600 mb-1">
          <span className="font-semibold text-gray-800">Map Center:</span>
        </div>
        <div className="text-gray-800">
          lat: {mapCenter.lat.toFixed(4)}, lng: {mapCenter.lng.toFixed(4)}
        </div>
        <div className="text-gray-600 mt-2 mb-1">
          <span className="font-semibold text-gray-800">Pointer:</span>
        </div>
        <div className="text-gray-800">
          {mousePos
            ? `lat: ${mousePos.lat.toFixed(4)}, lng: ${mousePos.lng.toFixed(4)}`
            : 'Move mouse over map'}
        </div>
      </div> */}
    </div>
  );
}
