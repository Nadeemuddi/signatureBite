import { useState } from 'react';
import { FaStore, FaUtensils, FaCommentDots, FaUsers, FaPlus } from 'react-icons/fa';
import useFetch from '../hooks/useFetch.js';
import { fetchAnalytics, createRestaurant, createDish, fetchRestaurants } from '../api/services.js';

const StatCard = ({ icon, label, value, color }) => (
  <div className="card flex items-center gap-4 p-5">
    <span className={`grid h-12 w-12 place-items-center rounded-xl text-white ${color}`}>{icon}</span>
    <div>
      <p className="text-2xl font-bold">{value ?? '—'}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  </div>
);

export default function Admin() {
  const { data, loading, refetch } = useFetch(fetchAnalytics, []);
  const { data: rest } = useFetch(() => fetchRestaurants({ limit: 50 }), []);
  const [tab, setTab] = useState('overview');

  return (
    <div className="container-page py-8">
      <h1 className="mb-1 font-display text-2xl font-bold sm:text-3xl">Admin Dashboard</h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Manage FoodSpot content and view analytics</p>

      <div className="mb-6 flex gap-2 border-b border-gray-200 dark:border-gray-800">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'restaurant', label: 'Add Restaurant' },
          { id: 'dish', label: 'Add Dish' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition ${
              tab === t.id
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-gray-500 hover:text-brand-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <Overview data={data} loading={loading} />
      )}
      {tab === 'restaurant' && <RestaurantForm onCreated={refetch} />}
      {tab === 'dish' && <DishForm restaurants={rest?.restaurants || []} onCreated={refetch} />}
    </div>
  );
}

function Overview({ data, loading }) {
  const t = data?.totals || {};
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={<FaStore />} label="Restaurants" value={loading ? '…' : t.restaurants} color="bg-brand-500" />
        <StatCard icon={<FaUtensils />} label="Dishes" value={loading ? '…' : t.dishes} color="bg-amber-500" />
        <StatCard icon={<FaCommentDots />} label="Reviews" value={loading ? '…' : t.reviews} color="bg-green-500" />
        <StatCard icon={<FaUsers />} label="Users" value={loading ? '…' : t.users} color="bg-purple-500" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="mb-4 font-display font-semibold">Top Rated Restaurants</h3>
          <ul className="space-y-3">
            {data?.topRestaurants?.map((r, i) => (
              <li key={r._id} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-gray-100 text-xs font-bold dark:bg-gray-800">
                    {i + 1}
                  </span>
                  {r.name} <span className="text-gray-400">· {r.city}</span>
                </span>
                <span className="font-semibold text-green-600">{r.rating?.toFixed(1)}★</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-5">
          <h3 className="mb-4 font-display font-semibold">Most Popular Dishes</h3>
          <ul className="space-y-3">
            {data?.topDishes?.map((d, i) => (
              <li key={d._id} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-gray-100 text-xs font-bold dark:bg-gray-800">
                    {i + 1}
                  </span>
                  {d.name}
                </span>
                <span className="font-semibold text-brand-600">🔥 {d.popularity}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-5 lg:col-span-2">
          <h3 className="mb-4 font-display font-semibold">Restaurants by City</h3>
          <div className="space-y-2">
            {data?.restaurantsByCity?.map((c) => {
              const max = data.restaurantsByCity[0].count || 1;
              return (
                <div key={c._id} className="flex items-center gap-3 text-sm">
                  <span className="w-24 shrink-0">{c._id}</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div className="h-full rounded-full bg-brand-500" style={{ width: `${(c.count / max) * 100}%` }} />
                  </div>
                  <span className="w-6 text-right font-medium">{c.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

function RestaurantForm({ onCreated }) {
  const [form, setForm] = useState({
    name: '', address: '', city: '', area: '', cuisine: '', priceRange: '$$',
    costForTwo: 500, phone: '', coverImage: '', signatureDishName: '', description: '',
  });
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    try {
      const payload = {
        ...form,
        costForTwo: Number(form.costForTwo),
        cuisine: form.cuisine.split(',').map((c) => c.trim()).filter(Boolean),
        images: form.coverImage ? [form.coverImage] : [],
      };
      const res = await createRestaurant(payload);
      setMsg(`✔ Created “${res.restaurant.name}”`);
      setForm({ ...form, name: '', address: '', signatureDishName: '', description: '' });
      onCreated?.();
    } catch (err) {
      setMsg(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="card grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
      <Field label="Name *"><input required className="input" value={form.name} onChange={set('name')} /></Field>
      <Field label="Signature dish"><input className="input" value={form.signatureDishName} onChange={set('signatureDishName')} /></Field>
      <Field label="Address *"><input required className="input" value={form.address} onChange={set('address')} /></Field>
      <Field label="Area"><input className="input" value={form.area} onChange={set('area')} /></Field>
      <Field label="City *"><input required className="input" value={form.city} onChange={set('city')} /></Field>
      <Field label="Cuisine (comma separated)"><input className="input" value={form.cuisine} onChange={set('cuisine')} placeholder="Biryani, North Indian" /></Field>
      <Field label="Price range">
        <select className="input" value={form.priceRange} onChange={set('priceRange')}>
          <option>$</option><option>$$</option><option>$$$</option><option>$$$$</option>
        </select>
      </Field>
      <Field label="Cost for two (₹)"><input type="number" className="input" value={form.costForTwo} onChange={set('costForTwo')} /></Field>
      <Field label="Phone"><input className="input" value={form.phone} onChange={set('phone')} /></Field>
      <Field label="Cover image URL"><input className="input" value={form.coverImage} onChange={set('coverImage')} /></Field>
      <div className="sm:col-span-2">
        <Field label="Description"><textarea rows={3} className="input resize-none" value={form.description} onChange={set('description')} /></Field>
      </div>
      <div className="flex items-center gap-3 sm:col-span-2">
        <button disabled={busy} className="btn-primary"><FaPlus /> {busy ? 'Saving…' : 'Add Restaurant'}</button>
        {msg && <span className="text-sm text-gray-500">{msg}</span>}
      </div>
    </form>
  );
}

function DishForm({ restaurants, onCreated }) {
  const [form, setForm] = useState({
    restaurant: '', name: '', price: 200, category: 'Other', description: '', image: '',
    isVeg: false, isSignature: true, isMustTry: true, popularity: 80, recommends: 100,
  });
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) =>
    setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.restaurant) return setMsg('Please select a restaurant.');
    setBusy(true);
    setMsg('');
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        popularity: Number(form.popularity),
        recommends: Number(form.recommends),
      };
      const res = await createDish(payload);
      setMsg(`✔ Added “${res.dish.name}”`);
      setForm({ ...form, name: '', description: '', image: '' });
      onCreated?.();
    } catch (err) {
      setMsg(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="card grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
      <Field label="Restaurant *">
        <select required className="input" value={form.restaurant} onChange={set('restaurant')}>
          <option value="">Select…</option>
          {restaurants.map((r) => (
            <option key={r._id} value={r._id}>{r.name} · {r.city}</option>
          ))}
        </select>
      </Field>
      <Field label="Dish name *"><input required className="input" value={form.name} onChange={set('name')} /></Field>
      <Field label="Price (₹) *"><input type="number" required className="input" value={form.price} onChange={set('price')} /></Field>
      <Field label="Category">
        <select className="input" value={form.category} onChange={set('category')}>
          {['Biryani', 'Pizza', 'South Indian', 'Chinese', 'Desserts', 'Drinks', 'North Indian', 'Other'].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </Field>
      <Field label="Image URL"><input className="input" value={form.image} onChange={set('image')} /></Field>
      <Field label="Popularity (0-100)"><input type="number" className="input" value={form.popularity} onChange={set('popularity')} /></Field>
      <Field label="Recommended by (count)"><input type="number" className="input" value={form.recommends} onChange={set('recommends')} /></Field>
      <div className="sm:col-span-2">
        <Field label="Description"><textarea rows={2} className="input resize-none" value={form.description} onChange={set('description')} /></Field>
      </div>
      <div className="flex flex-wrap gap-4 sm:col-span-2">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isVeg} onChange={set('isVeg')} /> Veg</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isSignature} onChange={set('isSignature')} /> Signature dish</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isMustTry} onChange={set('isMustTry')} /> Must Try</label>
      </div>
      <div className="flex items-center gap-3 sm:col-span-2">
        <button disabled={busy} className="btn-primary"><FaPlus /> {busy ? 'Saving…' : 'Add Dish'}</button>
        {msg && <span className="text-sm text-gray-500">{msg}</span>}
      </div>
    </form>
  );
}
