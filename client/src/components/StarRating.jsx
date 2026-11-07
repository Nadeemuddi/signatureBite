import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

// Read-only or interactive star rating.
export default function StarRating({ value = 0, size = 'text-sm', onChange, className = '' }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className={`flex items-center gap-0.5 text-gold ${size} ${className}`}>
      {stars.map((s) => {
        const Icon = value >= s ? FaStar : value >= s - 0.5 ? FaStarHalfAlt : FaRegStar;
        return (
          <button
            key={s}
            type="button"
            disabled={!onChange}
            onClick={() => onChange?.(s)}
            className={onChange ? 'transition hover:scale-110' : 'cursor-default'}
            aria-label={`${s} star${s > 1 ? 's' : ''}`}
          >
            <Icon />
          </button>
        );
      })}
    </div>
  );
}
