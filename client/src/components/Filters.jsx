import { FaFilter } from 'react-icons/fa';

// Filter sidebar/bar used on the search results page.
// `filters` is a plain object; `onChange(key, value)` updates one field.
export default function Filters({ filters, onChange, onReset }) {
  const toggle = (key) => onChange(key, filters[key] === 'true' ? '' : 'true');

  const chip = (active) =>
    `chip cursor-pointer border transition ${
      active
        ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-900/30'
        : 'border-gray-200 text-gray-600 hover:border-brand-300 dark:border-gray-700 dark:text-gray-300'
    }`;

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-display font-semibold">
          <FaFilter className="text-brand-500" /> Filters
        </h3>
        <button onClick={onReset} className="text-xs font-medium text-brand-600 hover:underline">
          Reset
        </button>
      </div>

      {/* Diet */}
      <div className="mb-5">
        <p className="mb-2 text-xs font-semibold uppercase text-gray-400">Diet</p>
        <div className="flex flex-wrap gap-2">
          <span className={chip(filters.veg === 'true')} onClick={() => toggle('veg')}>
            🟢 Pure Veg
          </span>
          <span className={chip(filters.nonVeg === 'true')} onClick={() => toggle('nonVeg')}>
            🔴 Non-Veg
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="mb-5">
        <p className="mb-2 text-xs font-semibold uppercase text-gray-400">Price range</p>
        <div className="flex flex-wrap gap-2">
          {['$', '$$', '$$$', '$$$$'].map((p) => (
            <span
              key={p}
              className={chip(filters.price === p)}
              onClick={() => onChange('price', filters.price === p ? '' : p)}
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="mb-5">
        <p className="mb-2 text-xs font-semibold uppercase text-gray-400">Minimum rating</p>
        <div className="flex flex-wrap gap-2">
          {[3, 3.5, 4, 4.5].map((r) => (
            <span
              key={r}
              className={chip(filters.minRating === String(r))}
              onClick={() => onChange('minRating', filters.minRating === String(r) ? '' : String(r))}
            >
              {r}★ & up
            </span>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase text-gray-400">Availability</p>
        <div className="flex flex-wrap gap-2">
          <span className={chip(filters.openNow === 'true')} onClick={() => toggle('openNow')}>
            Open Now
          </span>
          <span className={chip(filters.delivery === 'true')} onClick={() => toggle('delivery')}>
            Delivery
          </span>
        </div>
      </div>
    </div>
  );
}
