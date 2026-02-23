import { BuildingCoordinate } from '../types';

// Cornell University campus coordinates
// Main campus centered around: 42.4500° N, -76.4800° W

export const BUILDING_COORDINATES: BuildingCoordinate[] = [
  // === ARTS QUAD (center) ===
  { name: 'Goldwin Smith Hall', lat: 42.449080, lng: -76.483512 },
  { name: 'Lincoln Hall', lat: 42.450170, lng: -76.483477 },
  { name: 'Morrill Hall', lat: 42.448638, lng: -76.485322 },
  { name: 'White Hall', lat: 42.450243, lng: -76.485387 },
  { name: 'Rockefeller Hall', lat: 42.449141, lng: -76.481889 },
  { name: 'Stimson Hall', lat: 42.447809, lng: -76.483351 },
  { name: 'Baker Laboratory', lat: 42.450406, lng: -76.481964 },
  { name: 'Olin Library', lat: 42.447724, lng: -76.484582 },
  { name: 'Uris Library', lat: 42.447708, lng: -76.485282 },

  // === ENGINEERING QUAD (east of Arts Quad) ===
  { name: 'Olin Hall', lat: 42.445638, lng: -76.484587 },
  { name: 'Upson Hall', lat: 42.443771, lng: -76.482101 },
  { name: 'Phillips Hall', lat: 42.444607, lng: -76.482002 },
  { name: 'Hollister Hall', lat: 42.444440, lng: -76.484679 },
  { name: 'Frank H T Rhodes Hall', lat: 42.443407, lng: -76.481583 },
  { name: 'Bill and Melinda Gates Hll', lat: 42.444943, lng: -76.480851 },
  { name: 'Carpenter Hall', lat: 42.444735, lng: -76.484182 },
  { name: 'Computing Information Sci', lat: 42.444340, lng: -76.480232 },

  // === AG QUAD (north of Arts Quad) ===
  { name: 'Mann Library', lat: 42.448866, lng: -76.476149 },
  { name: 'Warren Hall', lat: 42.449189, lng: -76.477148 },
  { name: 'Kennedy Hall', lat: 42.448092, lng: -76.479228 },
  { name: 'Caldwell Hall', lat: 42.449213, lng: -76.478282 },
  { name: 'Fernow Hall', lat: 42.448436, lng: -76.475250 },
  // { name: 'Plant Science Building', lat: 42.4520, lng: -76.4790 },
  { name: 'Bradfield Hall', lat: 42.447903, lng: -76.475786 },
  { name: 'Emerson Hall', lat: 42.448179, lng: -76.475649 },
  { name: 'Riley-Robb Hall', lat: 42.445913, lng: -76.471187 },
  { name: 'Stocking Hall', lat: 42.447103, lng: -76.470878 },
  { name: 'Morrison Hall', lat: 42.446712, lng: -76.469332 },

  // // === CENTRAL CAMPUS (south of Arts Quad) ===
  { name: 'Statler Hall', lat: 42.445523, lng: -76.482060 },
  { name: 'Malott Hall', lat: 42.448186, lng: -76.480190 },
  { name: 'Malott Hall 228-Bache', lat: 42.448186, lng: -76.480190 },
  { name: 'Uris Hall', lat: 42.447147, lng: -76.482199 },
  { name: 'Sage Graduate Hall', lat: 42.445887, lng: -76.483249 },
  // { name: 'Barnes Hall', lat: 42.4480, lng: -76.4870 },
  { name: 'Anabel Taylor Hall', lat: 42.444837, lng: -76.485995 },
  // { name: 'Willard Straight Hall', lat: 42.446466, lng: -76.485605 },

  // // === PHYSICAL SCIENCES (between Arts and Engineering) ===
  { name: 'Physical Sciences Building', lat: 42.449870, lng: -76.481791 },
  { name: 'Clark Hall', lat: 42.449784, lng: -76.481120 },
  { name: 'Space Sciences Building', lat: 42.448898, lng: -76.481090 },
  { name: 'Snee Hall Geological Sci', lat: 42.443666, lng: -76.484939 },

  // // === WEST CAMPUS / HUMAN ECOLOGY ===
  { name: 'Human Ecology Building', lat: 42.450386, lng: -76.478501 },
  { name: 'M Van Rensselaer Hall', lat: 42.450036, lng: -76.478125 },
  { name: 'Savage Hall', lat: 42.449715, lng: -76.480125 },
  { name: 'Comstock Hall-Academic II', lat: 42.446687, lng: -76.479379 },

  // // === LAW / WEST ===
  { name: 'Myron Taylor Hall', lat: 42.443834, lng: -76.485785 },
  { name: 'Hughes Hall', lat: 42.443777, lng: -76.486471 },

  // // === ARCHITECTURE (west of Arts Quad) ===
  { name: 'Sibley Hall', lat: 42.450923, lng: -76.484099 },
  { name: 'Milstein Hall', lat: 42.451203, lng: -76.483604 },
  { name: 'Rand Hall', lat: 42.451210, lng: -76.482897 },
  { name: 'Olive Tjaden Hall', lat: 42.450890, lng: -76.485395 },

  // // === PERFORMING ARTS / SOUTH ===
  { name: 'Schwartz Ctr-Perform Arts', lat: 42.442503, lng: -76.485845 },

  // // === ATHLETICS / EAST ===
  { name: 'Barton Hall', lat: 42.445936, lng: -76.480709 },
  { name: 'Teagle Hall', lat: 42.445752, lng: -76.479016 },
  { name: 'Helen Newman Hall', lat: 42.452956, lng: -76.477356 },

  // // === VET COLLEGE (far east) ===
  { name: 'Vet Education Center', lat: 42.447627, lng: -76.465843 },
  // { name: 'CVM Center', lat: 42.4470, lng: -76.4655 },

  // // === KLARMAN / SOUTH ARTS ===
  { name: 'Klarman Hall', lat: 42.449042, lng: -76.483091 },

  // // === ILR / BUSINESS ===
  { name: 'Ives Hall', lat: 42.446997, lng: -76.480719 },

  // // === HOTEL ===
  // { name: 'Breazzano Family Ctr', lat: 42.4450, lng: -76.4810 },

  // // === WEILL / BIOTECH ===
  { name: 'Weill Hall', lat: 42.446839, lng: -76.477662 },

  // // === AFRICANA ===
  // { name: 'Africana Ctr', lat: 42.4485, lng: -76.4912 },

  // // === KIMBALL (Music) ===
  { name: 'Kimball Hall', lat: 42.443978, lng: -76.483237 },

  // // === BAILEY ===
  { name: 'Bailey Hall', lat: 42.449303, lng: -76.480119 },

  // // === WING ===
  { name: 'Wing Hall', lat: 42.446600, lng: -76.471442 },
];

// Create a lookup map for quick access
export const BUILDING_COORDINATE_MAP: Map<string, BuildingCoordinate> = new Map(
  BUILDING_COORDINATES.map((b) => [b.name, b])
);

// Get coordinate for a building, with fallback for unmapped buildings
export function getBuildingCoordinate(
  buildingName: string
): BuildingCoordinate | null {
  return BUILDING_COORDINATE_MAP.get(buildingName) || null;
}

// Campus area bounds for navigation
export const CAMPUS_AREAS = {
  central: {
    name: 'Central Campus',
    center: { lat: 42.4482, lng: -76.4787 },
    zoom: 17,
  },
  west: {
    name: 'West Campus',
    center: { lat: 42.4486, lng: -76.4895 },
    zoom: 17,
  },
  east: {
    name: 'East Campus',
    center: { lat: 42.4474, lng: -76.4660 },
    zoom: 17,
  },
  north: {
    name: 'North Campus',
    center: { lat: 42.4548, lng: -76.4770 },
    zoom: 17,
  },
  south: {
    name: 'South Campus',
    center: { lat: 42.4442, lng: -76.4806 },
    zoom: 17,
  },
};

// Full campus view
export const CAMPUS_CENTER = { lat: 42.4480, lng: -76.4800 };
export const CAMPUS_DEFAULT_ZOOM = 16.5;
