// Small formatting helpers shared across the UI.

export const formatPrice = (n) =>
  typeof n === 'number' ? `₹${n.toLocaleString('en-IN')}` : n;

export const formatCount = (n = 0) => {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(n);
};

// Deterministic pseudo-distance so cards feel real without real geolocation.
export const fakeDistance = (id = '') => {
  const seed = String(id).slice(-4).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return `${((seed % 90) / 10 + 0.4).toFixed(1)} km`;
};

export const CATEGORIES = [
  { name: 'Biryani', icon: '🍚' },
  { name: 'Pizza', icon: '🍕' },
  { name: 'South Indian', icon: '🥘' },
  { name: 'Chinese', icon: '🍜' },
  { name: 'Desserts', icon: '🍰' },
  { name: 'Drinks', icon: '🥤' },
];
