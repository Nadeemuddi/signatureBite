import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-page grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="font-display text-7xl font-extrabold text-brand-500">404</p>
        <h1 className="mt-2 font-display text-2xl font-bold">Dish not found 🍽️</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          The page you’re looking for isn’t on the menu.
        </p>
        <Link to="/" className="btn-primary mt-6">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
