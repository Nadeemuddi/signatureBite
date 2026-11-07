import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch, FaSlidersH } from 'react-icons/fa';
import RestaurantCard from '../components/RestaurantCard.jsx';
import Filters from '../components/Filters.jsx';
import { RestaurantCardSkeleton, Grid } from '../components/Skeletons.jsx';
import { fetchRestaurants } from '../api/services.js';

const FILTER_KEYS = ['veg', 'nonVeg', 'price', 'minRating', 'openNow', 'delivery', 'cuisine', 'city', 'sort'];

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';

  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Read filters straight from the URL so they're shareable/bookmarkable.
  const filters = useMemo(() => {
    const f = {};
    FILTER_KEYS.forEach((k) => {
      const v = searchParams.get(k);
      if (v) f[k] = v;
    });
    return f;
  }, [searchParams]);

  const queryString = searchParams.toString();

  // Reset to page 1 whenever the query or filters change.
  useEffect(() => {
    setRestaurants([]);
    setPage(1);
  }, [queryString]);

  // Fetch a page whenever page or query changes.
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchRestaurants({ ...filters, q, page, limit: 8 })
      .then((data) => {
        if (!active) return;
        setPages(data.pages);
        setTotal(data.total);
        setRestaurants((prev) => (page === 1 ? data.restaurants : [...prev, ...data.restaurants]));
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, queryString]);

  // Infinite scroll — observe a sentinel at the bottom of the list.
  const sentinel = useRef(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && page < pages) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: '400px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loading, page, pages]);

  const updateFilter = useCallback(
    (key, value) => {
      const next = new URLSearchParams(searchParams);
      if (value) next.set(key, value);
      else next.delete(key);
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  const resetFilters = () => {
    const next = new URLSearchParams();
    if (q) next.set('q', q);
    setSearchParams(next);
  };

  const heading = q ? `Results for “${q}”` : filters.cuisine ? `${filters.cuisine} places` : 'Explore restaurants';

  return (
    <div className="container-page py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">{heading}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {loading && page === 1 ? 'Searching…' : `${total} place${total === 1 ? '' : 's'} found`}
            {filters.city && ` in ${filters.city}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filters.sort || 'rating'}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="input w-auto"
          >
            <option value="rating">Sort: Rating</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
          <button
            onClick={() => setShowFilters((s) => !s)}
            className="btn-outline lg:hidden"
          >
            <FaSlidersH /> Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
          <div className="lg:sticky lg:top-20">
            <Filters filters={filters} onChange={updateFilter} onReset={resetFilters} />
          </div>
        </aside>

        {/* Results */}
        <div>
          {error && (
            <div className="card p-8 text-center text-red-500">
              {error}
            </div>
          )}

          {!error && restaurants.length === 0 && !loading && (
            <div className="card flex flex-col items-center gap-3 p-12 text-center">
              <FaSearch className="text-4xl text-gray-300" />
              <p className="font-display text-lg font-semibold">No restaurants found</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Try a different search or reset your filters.
              </p>
              <button onClick={resetFilters} className="btn-primary mt-2">
                Reset filters
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {restaurants.map((r) => (
              <RestaurantCard key={r._id} restaurant={r} />
            ))}
          </div>

          {loading && (
            <div className="mt-5">
              <Grid count={6} Comp={RestaurantCardSkeleton} />
            </div>
          )}

          {/* Infinite-scroll sentinel */}
          <div ref={sentinel} className="h-10" />

          {!loading && page >= pages && restaurants.length > 0 && (
            <p className="py-8 text-center text-sm text-gray-400">You’ve reached the end 🍽️</p>
          )}
        </div>
      </div>
    </div>
  );
}
