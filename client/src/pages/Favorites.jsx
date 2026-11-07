import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import RestaurantCard from '../components/RestaurantCard.jsx';
import { RestaurantCardSkeleton, Grid } from '../components/Skeletons.jsx';
import { fetchFavourites, fetchRecent } from '../api/services.js';

export default function Favorites() {
  const [favourites, setFavourites] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([fetchFavourites(), fetchRecent()])
      .then(([f, r]) => {
        setFavourites(f.favourites || []);
        setRecent(r.recentlyViewed || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleToggle = (id, saved) => {
    if (!saved) setFavourites((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <div className="container-page py-8">
      <h1 className="mb-1 flex items-center gap-2 font-display text-2xl font-bold sm:text-3xl">
        <FaHeart className="text-brand-500" /> Your Favourites
      </h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Restaurants you’ve saved for later
      </p>

      {loading ? (
        <Grid count={4} Comp={RestaurantCardSkeleton} />
      ) : favourites.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 p-12 text-center">
          <FaHeart className="text-4xl text-gray-300" />
          <p className="font-display text-lg font-semibold">No favourites yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tap the heart on any restaurant to save it here.
          </p>
          <Link to="/search" className="btn-primary mt-2">
            Explore restaurants
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favourites.map((r) => (
            <RestaurantCard key={r._id} restaurant={r} saved onToggleSaved={handleToggle} />
          ))}
        </div>
      )}

      {/* Recently viewed */}
      {recent.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-5 font-display text-xl font-bold">🕘 Recently Viewed</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recent.map((r) => (
              <RestaurantCard key={r._id} restaurant={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
