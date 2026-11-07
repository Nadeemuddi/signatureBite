import { Link } from 'react-router-dom';
import { FaUtensils, FaInstagram, FaTwitter, FaFacebookF } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="container-page grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-white">
              <FaUtensils />
            </span>
            <span className="font-display text-lg font-extrabold">
              Food<span className="text-brand-500">Spot</span>
            </span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-gray-500 dark:text-gray-400">
            Discover the signature dishes each restaurant is truly famous for — not just another
            menu.
          </p>
          <div className="mt-4 flex gap-3">
            {[FaInstagram, FaTwitter, FaFacebookF].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-9 w-9 place-items-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-brand-500 hover:text-white dark:bg-gray-800"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {[
          { title: 'Explore', links: ['Trending', 'Hidden Gems', 'Top Rated', 'Nearby'] },
          { title: 'Company', links: ['About', 'Careers', 'Blog', 'Contact'] },
          { title: 'Legal', links: ['Privacy', 'Terms', 'Cookies', 'Licenses'] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-display text-sm font-semibold">{col.title}</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-500 dark:text-gray-400">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="transition hover:text-brand-500">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100 py-4 text-center text-xs text-gray-400 dark:border-gray-800">
        © {new Date().getFullYear()} FoodSpot. Built for food lovers. 🍽️
      </div>
    </footer>
  );
}
