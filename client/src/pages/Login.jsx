import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUtensils } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fill = (role) =>
    setForm(
      role === 'admin'
        ? { email: 'admin@foodspot.com', password: 'admin123' }
        : { email: 'user@foodspot.com', password: 'user123' }
    );

  return (
    <div className="container-page grid min-h-[calc(100vh-4rem)] place-items-center py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand-500 text-white">
            <FaUtensils className="text-xl" />
          </span>
          <h1 className="mt-3 font-display text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Log in to save your favourite spots</p>
        </div>

        <form onSubmit={submit} className="card space-y-4 p-6">
          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/20">
              {error}
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              required
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              required
              className="input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>
          <button disabled={loading} className="btn-primary w-full">
            {loading ? 'Logging in…' : 'Log in'}
          </button>

          <div className="flex gap-2 text-xs">
            <button type="button" onClick={() => fill('user')} className="btn-ghost flex-1 !py-1.5">
              Demo user
            </button>
            <button type="button" onClick={() => fill('admin')} className="btn-ghost flex-1 !py-1.5">
              Demo admin
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          New here?{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
