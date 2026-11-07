import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../utils/format.js';

// Horizontal row of clickable food categories.
export default function CategoryRow() {
  const navigate = useNavigate();
  return (
    <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
      {CATEGORIES.map((c) => (
        <button
          key={c.name}
          onClick={() => navigate(`/search?cuisine=${encodeURIComponent(c.name)}`)}
          className="group flex min-w-[92px] flex-col items-center gap-2"
        >
          <span className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 text-4xl shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-card dark:from-gray-800 dark:to-gray-900">
            {c.icon}
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{c.name}</span>
        </button>
      ))}
    </div>
  );
}
