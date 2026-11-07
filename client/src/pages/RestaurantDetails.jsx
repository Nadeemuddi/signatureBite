import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  FaStar, FaMapMarkerAlt, FaClock, FaPhoneAlt, FaHeart, FaRegHeart, FaShareAlt,
  FaMotorcycle, FaUtensils, FaCheckCircle,
} from 'react-icons/fa';
import LazyImage from '../components/LazyImage.jsx';
import DishCard from '../components/DishCard.jsx';
import StarRating from '../components/StarRating.jsx';
import Badge, { VegDot } from '../components/Badge.jsx';
import { DishCardSkeleton, Grid } from '../components/Skeletons.jsx';
import { formatPrice } from '../utils/format.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  fetchRestaurant, toggleFavourite, addRecent, submitReview, fetchReviews,
} from '../api/services.js';

export default function RestaurantDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [reviews, setReviews] = useState([]);

  // Review form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchRestaurant(id)
      .then((res) => {
        if (!active) return;
        setData(res);
        setReviews(res.reviews || []);
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    // Track in "recently viewed" for logged-in users.
    if (user) addRecent(id).catch(() => {});
    return () => {
      active = false;
    };
  }, [id, user]);

  const handleSave = async () => {
    if (!user) return alert('Please log in to save favourites.');
    try {
      const res = await toggleFavourite(id);
      setSaved(res.saved);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: data?.restaurant?.name, url });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please log in to write a review.');
    if (!rating) return setFormMsg('Please select a rating.');
    setSubmitting(true);
    setFormMsg('');
    try {
      await submitReview(id, { rating, comment });
      const fresh = await fetchReviews(id);
      setReviews(fresh.reviews);
      setComment('');
      setRating(0);
      setFormMsg('Thanks for your review!');
    } catch (err) {
      setFormMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container-page py-8">
        <div className="skeleton h-72 w-full rounded-2xl" />
        <div className="mt-8">
          <Grid count={4} Comp={DishCardSkeleton} />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return <div className="container-page py-20 text-center text-red-500">{error || 'Not found'}</div>;
  }

  const { restaurant: r, signatureDishes, popularDishes } = data;

  return (
    <div>
      {/* ---- Cover ---- */}
      <div className="relative h-72 w-full sm:h-96">
        <LazyImage src={r.coverImage || r.images?.[0]} alt={r.name} className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="container-page absolute inset-x-0 bottom-0 pb-6 text-white">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex flex-wrap gap-2">
                {r.cuisine?.slice(0, 3).map((c) => (
                  <Badge key={c} className="bg-white/20 text-white backdrop-blur">
                    {c}
                  </Badge>
                ))}
              </div>
              <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{r.name}</h1>
              <p className="mt-1 flex items-center gap-2 text-white/90">
                <FaMapMarkerAlt /> {r.area}, {r.city}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 font-bold">
                {r.rating?.toFixed(1)} <FaStar /> <span className="text-xs font-normal">({r.numReviews})</span>
              </span>
              <button onClick={handleSave} className="grid h-11 w-11 place-items-center rounded-lg bg-white/20 backdrop-blur transition hover:bg-white/30">
                {saved ? <FaHeart className="text-brand-400" /> : <FaRegHeart />}
              </button>
              <button onClick={handleShare} className="grid h-11 w-11 place-items-center rounded-lg bg-white/20 backdrop-blur transition hover:bg-white/30">
                <FaShareAlt />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page grid grid-cols-1 gap-8 py-8 lg:grid-cols-[1fr_340px]">
        {/* ---- Main column ---- */}
        <div className="space-y-10">
          {/* Info bar */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-card dark:bg-gray-900">
              <FaClock className="text-brand-500" />
              <div>
                <p className="text-xs text-gray-400">Open hours</p>
                <p className="text-sm font-medium">{r.openingHours}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-card dark:bg-gray-900">
              <span className="text-brand-500">{r.priceRange}</span>
              <div>
                <p className="text-xs text-gray-400">Cost for two</p>
                <p className="text-sm font-medium">{formatPrice(r.costForTwo)}</p>
              </div>
            </div>
            {r.isOpenNow && (
              <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                <FaCheckCircle /> <span className="text-sm font-semibold">Open Now</span>
              </div>
            )}
            {r.delivery && <Badge variant="neutral" className="px-4 py-3"><FaMotorcycle /> Delivery</Badge>}
            {r.dineIn && <Badge variant="neutral" className="px-4 py-3"><FaUtensils /> Dine-in</Badge>}
          </div>

          {r.description && (
            <p className="text-gray-600 dark:text-gray-300">{r.description}</p>
          )}

          {/* Signature dishes */}
          {signatureDishes?.length > 0 && (
            <section>
              <h2 className="mb-1 font-display text-2xl font-bold">⭐ Signature Dishes</h2>
              <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
                What {r.name} is truly famous for
              </p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {signatureDishes.map((d) => (
                  <DishCard key={d._id} dish={d} />
                ))}
              </div>
            </section>
          )}

          {/* Popular dishes */}
          {popularDishes?.length > 0 && (
            <section>
              <h2 className="mb-5 font-display text-2xl font-bold">Popular Dishes</h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {popularDishes.map((d) => (
                  <DishCard key={d._id} dish={d} />
                ))}
              </div>
            </section>
          )}

          {/* Gallery */}
          {r.images?.length > 0 && (
            <section>
              <h2 className="mb-5 font-display text-2xl font-bold">Gallery</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {r.images.map((src, i) => (
                  <LazyImage key={i} src={src} alt={`${r.name} ${i + 1}`} className="h-40 rounded-xl" />
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          <section>
            <h2 className="mb-5 font-display text-2xl font-bold">
              Reviews <span className="text-base font-normal text-gray-400">({reviews.length})</span>
            </h2>

            {/* Write a review */}
            <form onSubmit={handleReview} className="card mb-6 p-5">
              <p className="mb-2 font-semibold">Write a review</p>
              <StarRating value={rating} onChange={setRating} size="text-2xl" className="mb-3" />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Share your experience…"
                className="input mb-3 resize-none"
              />
              <div className="flex items-center gap-3">
                <button disabled={submitting} className="btn-primary">
                  {submitting ? 'Posting…' : 'Post review'}
                </button>
                {formMsg && <span className="text-sm text-gray-500">{formMsg}</span>}
              </div>
            </form>

            <div className="space-y-4">
              {reviews.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No reviews yet — be the first!
                </p>
              )}
              {reviews.map((rev) => (
                <div key={rev._id} className="card p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-100 font-bold text-brand-600 dark:bg-brand-900/40">
                        {rev.userName?.[0]?.toUpperCase()}
                      </span>
                      <div>
                        <p className="font-medium">{rev.userName}</p>
                        <StarRating value={rev.rating} />
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {rev.comment && (
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{rev.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ---- Sidebar: contact + map ---- */}
        <aside className="space-y-5">
          <div className="card p-5 lg:sticky lg:top-20">
            <h3 className="mb-3 font-display font-bold">Contact & Location</h3>
            <div className="space-y-3 text-sm">
              <p className="flex items-start gap-2">
                <FaMapMarkerAlt className="mt-0.5 shrink-0 text-brand-500" /> {r.address}
              </p>
              {r.phone && (
                <a href={`tel:${r.phone}`} className="flex items-center gap-2 text-brand-600 hover:underline dark:text-brand-400">
                  <FaPhoneAlt /> {r.phone}
                </a>
              )}
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <FaClock className="text-brand-500" /> {r.openingHours}
              </p>
            </div>

            {/* Map (OpenStreetMap embed, no API key needed) */}
            <div className="mt-4 overflow-hidden rounded-xl">
              <iframe
                title="map"
                className="h-48 w-full border-0"
                loading="lazy"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                  r.location.coordinates[0] - 0.01
                },${r.location.coordinates[1] - 0.01},${r.location.coordinates[0] + 0.01},${
                  r.location.coordinates[1] + 0.01
                }&marker=${r.location.coordinates[1]},${r.location.coordinates[0]}`}
              />
            </div>
            <a
              href={`https://www.openstreetmap.org/?mlat=${r.location.coordinates[1]}&mlon=${r.location.coordinates[0]}#map=16/${r.location.coordinates[1]}/${r.location.coordinates[0]}`}
              target="_blank"
              rel="noreferrer"
              className="btn-outline mt-3 w-full"
            >
              Get Directions
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
