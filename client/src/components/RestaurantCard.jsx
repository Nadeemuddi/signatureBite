import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaMotorcycle, FaUtensils, FaHeart, FaRegHeart } from 'react-icons/fa';
import LazyImage from './LazyImage.jsx';
import Badge, { VegDot } from './Badge.jsx';
import { formatPrice, fakeDistance } from '../utils/format.js';
import { useAuth } from '../context/AuthContext.jsx';
import { toggleFavourite } from '../api/services.js';
import { useState } from 'react';

export default function RestaurantCard({ restaurant, saved = false, onToggleSaved }) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(saved);
  const [busy, setBusy] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return alert('Please log in to save favourites.');
    setBusy(true);
    try {
      const res = await toggleFavourite(restaurant._id);
      setIsSaved(res.saved);
      onToggleSaved?.(restaurant._id, res.saved);
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Link
      to={`/restaurant/${restaurant._id}`}
      className="card group animate-fade-up overflow-hidden hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="relative">
        <LazyImage
          src={restaurant.coverImage || restaurant.images?.[0]}
          alt={restaurant.name}
          className="h-44 w-full"
          imgClassName="group-hover:scale-105 transition-transform duration-500"
        />
        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={busy}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-brand-500 shadow backdrop-blur transition hover:scale-110 dark:bg-gray-900/80"
          aria-label="Save to favourites"
        >
          {isSaved ? <FaHeart /> : <FaRegHeart />}
        </button>
        {/* Signature dish ribbon */}
        {restaurant.signatureDishName && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2 pt-8">
            <p className="text-[11px] font-medium uppercase tracking-wide text-brand-200">
              Famous for
            </p>
            <p className="truncate text-sm font-semibold text-white">
              {restaurant.signatureDishName}
            </p>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate font-display text-base font-semibold">{restaurant.name}</h3>
          <span className="flex shrink-0 items-center gap-1 rounded-md bg-green-600 px-1.5 py-0.5 text-xs font-bold text-white">
            {restaurant.rating?.toFixed(1)} <FaStar className="text-[10px]" />
          </span>
        </div>

        <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">
          {restaurant.cuisine?.slice(0, 3).join(' • ')}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <FaMapMarkerAlt className="text-brand-400" /> {restaurant.area || restaurant.city}
          </span>
          <span>·</span>
          <span>{fakeDistance(restaurant._id)}</span>
          <span>·</span>
          <span>{formatPrice(restaurant.costForTwo)} for two</span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {restaurant.isVeg && <Badge variant="veg"><VegDot veg /> Pure Veg</Badge>}
          {restaurant.delivery && (
            <Badge variant="neutral">
              <FaMotorcycle /> Delivery
            </Badge>
          )}
          {restaurant.dineIn && (
            <Badge variant="neutral">
              <FaUtensils /> Dine-in
            </Badge>
          )}
        </div>

        <span className="btn-primary mt-4 w-full">View Details</span>
      </div>
    </Link>
  );
}
