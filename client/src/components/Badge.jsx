// Small coloured pill badges used across cards.
const styles = {
  mustTry: 'bg-brand-500 text-white',
  veg: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  nonVeg: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  gem: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  trending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  neutral: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
};

export default function Badge({ variant = 'neutral', children, className = '' }) {
  return <span className={`chip ${styles[variant] || styles.neutral} ${className}`}>{children}</span>;
}

// Veg/non-veg square indicator (Indian food-labelling convention).
export const VegDot = ({ veg }) => (
  <span
    className={`inline-flex h-4 w-4 items-center justify-center rounded-sm border ${
      veg ? 'border-green-600' : 'border-red-600'
    }`}
    title={veg ? 'Vegetarian' : 'Non-vegetarian'}
  >
    <span className={`h-2 w-2 rounded-full ${veg ? 'bg-green-600' : 'bg-red-600'}`} />
  </span>
);
