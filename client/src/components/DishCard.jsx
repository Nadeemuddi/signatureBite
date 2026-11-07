import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFire, FaHeart, FaRegHeart, FaThumbsUp } from 'react-icons/fa';
import LazyImage from './LazyImage.jsx';
import Badge, { VegDot } from './Badge.jsx';
import { formatPrice, formatCount } from '../utils/format.js';
import { likeDish } from '../api/services.js';
import { useAuth } from '../context/AuthContext.jsx';

// Card for a signature / popular dish.
export default function DishCard({ dish }) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(dish.likes || 0);
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    if (!user) return alert('Please log in to like dishes.');
    try {
      const res = await likeDish(dish._id);
      setLiked(res.liked);
      setLikes(res.likes);
    } catch (err) {
      alert(err.message);
    }
  };

  const restaurant = dish.restaurant;

  return (
    <div className="card group animate-fade-up overflow-hidden hover:-translate-y-1 hover:shadow-card-hover">
      <div className="relative">
        <LazyImage
          src={dish.image}
          alt={dish.name}
          className="h-40 w-full"
          imgClassName="group-hover:scale-105 transition-transform duration-500"
        />
        {dish.isMustTry && (
          <div className="absolute left-3 top-3">
            <Badge variant="mustTry" className="shadow">
              <FaFire className="text-[10px]" /> Must Try
            </Badge>
          </div>
        )}
        {/* Popularity meter */}
        <div className="absolute right-3 top-3 rounded-full bg-black/70 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur">
          🔥 {dish.popularity}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <VegDot veg={dish.isVeg} />
            <h3 className="truncate font-display text-base font-semibold">{dish.name}</h3>
          </div>
          <span className="shrink-0 font-semibold text-brand-600 dark:text-brand-400">
            {formatPrice(dish.price)}
          </span>
        </div>

        {dish.description && (
          <p className="mt-1.5 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
            {dish.description}
          </p>
        )}

        {restaurant?.name && (
          <Link
            to={`/restaurant/${restaurant._id}`}
            className="mt-2 inline-block text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
          >
            @ {restaurant.name}
          </Link>
        )}

        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <FaThumbsUp className="text-green-500" /> {formatCount(dish.recommends)} recommend
          </span>
          <button
            onClick={handleLike}
            className="flex items-center gap-1 font-medium text-brand-500 transition hover:scale-105"
          >
            {liked ? <FaHeart /> : <FaRegHeart />} {formatCount(likes)}
          </button>
        </div>
      </div>
    </div>
  );
}
