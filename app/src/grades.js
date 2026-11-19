// Colour grades: five sunset / neon looks. A grade is a small palette the
// renderer uses for the sky, the photo tint, the title gradient and the
// accents, so one photo can wear five different moods.

export const GRADES = {
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    skyTop: '#2b1055',
    skyBottom: '#ff7e5f',
    sunCore: '#ffd76e',
    sunRing: '#ff5e78',
    tint: 'rgba(255, 94, 120, 0.20)',
    tintDeep: 'rgba(255, 126, 95, 0.16)',
    titleTop: '#fff3b0',
    titleBottom: '#ff7e5f',
    titleOutline: '#2b1055',
    accent: '#ffd76e',
    filter: 'saturate(1.35) contrast(1.06)',
  },
  neon: {
    id: 'neon',
    name: 'Neon Night',
    skyTop: '#12002e',
    skyBottom: '#ff2e88',
    sunCore: '#7df9ff',
    sunRing: '#ff2e88',
    tint: 'rgba(255, 46, 136, 0.22)',
    tintDeep: 'rgba(0, 229, 255, 0.12)',
    titleTop: '#7df9ff',
    titleBottom: '#ff2e88',
    titleOutline: '#12002e',
    accent: '#00e5ff',
    filter: 'saturate(1.5) contrast(1.1)',
  },
  golden: {
    id: 'golden',
    name: 'Golden Hour',
    skyTop: '#7a2e0e',
    skyBottom: '#ffc46b',
    sunCore: '#fff1a8',
    sunRing: '#ff9e2c',
    tint: 'rgba(255, 158, 44, 0.18)',
    tintDeep: 'rgba(255, 196, 107, 0.14)',
    titleTop: '#fff8dc',
    titleBottom: '#ffb03a',
    titleOutline: '#4a1e05',
    accent: '#ffcf5c',
    filter: 'saturate(1.3) contrast(1.04) brightness(1.03)',
  },
  teal: {
    id: 'teal',
    name: 'Teal Dusk',
    skyTop: '#062a33',
    skyBottom: '#2ec4b6',
    sunCore: '#ffe9a8',
    sunRing: '#ff8c42',
    tint: 'rgba(46, 196, 182, 0.18)',
    tintDeep: 'rgba(6, 42, 51, 0.22)',
    titleTop: '#e8fff9',
    titleBottom: '#2ec4b6',
    titleOutline: '#062a33',
    accent: '#ffe9a8',
    filter: 'saturate(1.25) contrast(1.05)',
  },
  mono: {
    id: 'mono',
    name: 'Mono Noir',
    skyTop: '#111111',
    skyBottom: '#5a5a5a',
    sunCore: '#f5f5f5',
    sunRing: '#9a9a9a',
    tint: 'rgba(0, 0, 0, 0.10)',
    tintDeep: 'rgba(255, 255, 255, 0.06)',
    titleTop: '#ffffff',
    titleBottom: '#c9c9c9',
    titleOutline: '#000000',
    accent: '#ffffff',
    filter: 'grayscale(1) contrast(1.12)',
  },
};

/** The grade object for an id, falling back to Sunset. */
export function gradeById(id) {
  return GRADES[id] ?? GRADES.sunset;
}

/** The grade ids in display order. */
export function gradeIds() {
  return ['sunset', 'neon', 'golden', 'teal', 'mono'];
}
