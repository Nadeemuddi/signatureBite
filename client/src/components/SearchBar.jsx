import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

const CITIES = ['All Cities', 'Hyderabad', 'Chennai', 'Bengaluru', 'Pune', 'Delhi', 'Kolkata', 'Amritsar'];

// Hero search bar with a location selector. Navigates to /search on submit.
export default function SearchBar({ compact = false }) {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [city, setCity] = useState('All Cities');

  const submit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (city !== 'All Cities') params.set('city', city);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={submit}
      className={`flex w-full flex-col gap-2 rounded-2xl bg-white p-2 shadow-card dark:bg-gray-900 sm:flex-row ${
        compact ? '' : 'sm:rounded-full'
      }`}
    >
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 dark:border-gray-700 sm:w-52 sm:rounded-full sm:border-0">
        <FaMapMarkerAlt className="text-brand-500" />
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full bg-transparent py-2.5 text-sm outline-none"
        >
          {CITIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="hidden w-px bg-gray-200 dark:bg-gray-700 sm:block" />

      <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 px-3 dark:border-gray-700 sm:rounded-full sm:border-0">
        <FaSearch className="text-gray-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search 'Best Biryani', 'Paneer Butter Masala', 'Pizza'…"
          className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-gray-400"
        />
      </div>

      <button type="submit" className="btn-primary sm:px-8">
        Search
      </button>
    </form>
  );
}
