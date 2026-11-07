import { Link } from 'react-router-dom';

// Reusable titled section with an optional "see all" link.
export default function Section({ title, subtitle, emoji, to, children }) {
  return (
    <section className="py-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold sm:text-2xl">
            {emoji && <span className="mr-2">{emoji}</span>}
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
        {to && (
          <Link to={to} className="shrink-0 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400">
            See all →
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

// Horizontal scroller for card rows on mobile / dense sections.
export function Scroller({ children }) {
  return (
    <div className="no-scrollbar -mx-1 flex snap-x gap-5 overflow-x-auto px-1 pb-2">
      {children}
    </div>
  );
}
