import { Link } from 'react-router-dom';
import { FaGem, FaFire, FaStar, FaRobot } from 'react-icons/fa';
import SearchBar from '../components/SearchBar.jsx';
import CategoryRow from '../components/CategoryRow.jsx';
import RestaurantCard from '../components/RestaurantCard.jsx';
import DishCard from '../components/DishCard.jsx';
import Section from '../components/Section.jsx';
import { RestaurantCardSkeleton, DishCardSkeleton, Grid } from '../components/Skeletons.jsx';
import useFetch from '../hooks/useFetch.js';
import { fetchCollections, fetchTrendingDishes, fetchRecommendations } from '../api/services.js';

export default function Home() {
  const { data: collections, loading: loadingCol } = useFetch(fetchCollections, []);
  const { data: trending, loading: loadingDishes } = useFetch(fetchTrendingDishes, []);
  const { data: recs, loading: loadingRecs } = useFetch(fetchRecommendations, []);

  return (
    <div>
      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="container-page relative py-20 text-center text-white sm:py-28">
          <span className="chip mx-auto mb-4 bg-white/20 text-white backdrop-blur">
            🍽️ Famous for its flavour
          </span>
          <h1 className="mx-auto max-w-3xl font-display text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
            Discover the <span className="text-gold">signature dish</span> every place is known for
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
            Skip the endless menus. Find exactly what to order at Paradise Biryani, A2B, KFC and
            thousands more.
          </p>
          <div className="mx-auto mt-8 max-w-3xl">
            <SearchBar />
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm text-white/80">
            <span>Popular:</span>
            {['Best Biryani', 'Paneer Butter Masala', 'Pizza', 'Hyderabad'].map((t) => (
              <Link
                key={t}
                to={`/search?q=${encodeURIComponent(t)}`}
                className="chip bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="container-page">
        {/* ---- Categories ---- */}
        <Section title="What are you craving?" subtitle="Browse by category">
          <CategoryRow />
        </Section>

        {/* ---- Trending signature dishes ---- */}
        <Section
          title="Trending Signature Dishes"
          subtitle="The most-loved dishes right now"
          emoji="🔥"
          to="/search"
        >
          {loadingDishes ? (
            <Grid count={4} Comp={DishCardSkeleton} />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {trending?.dishes?.slice(0, 8).map((d) => (
                <DishCard key={d._id} dish={d} />
              ))}
            </div>
          )}
        </Section>

        {/* ---- AI recommendations ---- */}
        <Section
          title="Recommended for You"
          subtitle="AI-picked dishes based on popularity and love"
          emoji="🤖"
        >
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-brand-50 p-3 text-sm text-brand-700 dark:bg-brand-900/20 dark:text-brand-300">
            <FaRobot /> Our recommender ranks dishes by popularity, recommendations and likes.
          </div>
          {loadingRecs ? (
            <Grid count={4} Comp={DishCardSkeleton} />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {recs?.dishes?.slice(0, 4).map((d) => (
                <DishCard key={d._id} dish={d} />
              ))}
            </div>
          )}
        </Section>

        {/* ---- Trending restaurants ---- */}
        <Section title="Trending Restaurants" emoji={<FaFire className="inline text-brand-500" />} to="/search">
          {loadingCol ? (
            <Grid count={4} Comp={RestaurantCardSkeleton} />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {collections?.trending?.map((r) => (
                <RestaurantCard key={r._id} restaurant={r} />
              ))}
            </div>
          )}
        </Section>

        {/* ---- Hidden gems ---- */}
        <Section
          title="Hidden Gems"
          subtitle="Underrated spots the locals love"
          emoji={<FaGem className="inline text-purple-500" />}
        >
          {loadingCol ? (
            <Grid count={4} Comp={RestaurantCardSkeleton} />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {collections?.hiddenGems?.map((r) => (
                <RestaurantCard key={r._id} restaurant={r} />
              ))}
            </div>
          )}
        </Section>

        {/* ---- Top rated ---- */}
        <Section
          title="Top Rated"
          subtitle="Highest rated across all cities"
          emoji={<FaStar className="inline text-gold" />}
          to="/search?sort=rating"
        >
          {loadingCol ? (
            <Grid count={4} Comp={RestaurantCardSkeleton} />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {collections?.topRated?.slice(0, 4).map((r) => (
                <RestaurantCard key={r._id} restaurant={r} />
              ))}
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}
