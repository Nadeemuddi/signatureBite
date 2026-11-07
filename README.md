# 🍽️ FoodSpot

Discover the **signature dishes** each hotel & restaurant is famous for — not just another menu.

> Paradise Biryani → *Chicken Dum Biryani* · A2B → *Mini Tiffin* · KFC → *Hot & Crispy Chicken* · Pizza Hut → *Margherita Pizza*

A production-style **MERN** app (MongoDB · Express · React · Node) with JWT auth, an admin dashboard, dark/light mode, infinite scroll, skeleton loading and a premium Zomato/Swiggy-inspired UI.

---

## ✨ Features

- **Home** — hero + search, location selector, categories, trending restaurants, trending signature dishes, hidden gems, top-rated, AI-style recommendations.
- **Restaurant details** — cover, info, gallery, signature + popular dishes, reviews, contact & OpenStreetMap map, share, save.
- **Signature dishes** — large imagery, Must-Try badge, popularity score, recommend count, likes.
- **Search & filters** — by name / dish / cuisine / area / city, plus diet, price, rating, open-now, delivery. URL-driven & shareable.
- **User** — register/login (JWT), save favourites, recently viewed, like dishes, write reviews, share.
- **Admin** — analytics dashboard, add restaurants & dishes.
- **UX** — dark mode, responsive, skeletons, lazy images, infinite scroll, smooth animations.

## 🧱 Tech Stack

| Layer     | Tech |
|-----------|------|
| Frontend  | React 18, Vite, Tailwind CSS, React Router, Axios, react-icons |
| Backend   | Node.js, Express, express-validator, morgan |
| Database  | MongoDB + Mongoose |
| Auth      | JWT + bcryptjs |
| Images    | URL-based (Cloudinary-ready) |

---

## 🚀 Quick Start

Requires **Node 18+**. No MongoDB install needed for a demo — the server auto-starts an
in-memory MongoDB and seeds sample data on boot.

### 1. Backend

```bash
cd server
npm install
cp .env.example .env      # optional — defaults work out of the box
npm run dev               # → http://localhost:5000  (auto-seeds sample data)
```

### 2. Frontend

```bash
cd client
npm install
npm run dev               # → http://localhost:5173
```

Open **http://localhost:5173**.

### 🔑 Demo logins (seeded)

| Role  | Email                | Password   |
|-------|----------------------|------------|
| Admin | admin@foodspot.com   | `admin123` |
| User  | user@foodspot.com    | `user123`  |

---

## 🗄️ Using a real MongoDB

Set `MONGO_URI` in `server/.env` (local `mongodb://127.0.0.1:27017/foodspot` or an Atlas URI),
then seed once:

```bash
cd server
npm run seed          # import sample data
npm run seed:destroy  # wipe
```

With a real `MONGO_URI` the server no longer auto-seeds on boot.

---

## 📚 API Overview

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` · `/auth/login` | Auth (returns JWT) |
| GET  | `/auth/me` | Current user 🔒 |
| GET  | `/restaurants` | List + filter + paginate |
| GET  | `/restaurants/collections` | Homepage sections |
| GET  | `/restaurants/nearby?lng=&lat=` | Geo search |
| GET  | `/restaurants/:id` | Details + dishes + reviews |
| POST/PUT/DELETE | `/restaurants/:id` | CRUD 🔒 admin |
| GET  | `/dishes/trending` · `/dishes/recommendations` | Dish feeds |
| POST | `/dishes/:id/like` | Like a dish 🔒 |
| GET/POST | `/reviews/restaurant/:id` | Read / upsert review |
| GET/POST | `/users/favourites` · `/users/recent` | Saved & recent 🔒 |
| GET  | `/admin/analytics` | Dashboard stats 🔒 admin |

🔒 = requires `Authorization: Bearer <token>`

---

## 📁 Structure

```
foodspot/
├── server/                 # Express API
│   ├── config/db.js        # Mongo (+ in-memory fallback)
│   ├── models/             # User, Restaurant, Dish, Review
│   ├── controllers/        # Business logic
│   ├── routes/             # REST endpoints
│   ├── middleware/         # auth, validation, errors
│   ├── seed/               # sample data + seeder
│   └── server.js
└── client/                 # Vite + React
    └── src/
        ├── api/            # axios client + services
        ├── components/     # reusable UI
        ├── context/        # Auth + Theme
        ├── hooks/          # useFetch
        └── pages/          # Home, Details, Search, Auth, Favorites, Admin
```

## 🌐 Deployment notes

- **Frontend** → Vercel / Netlify (`npm run build` → `client/dist`). Set an env/proxy so `/api` points to your API.
- **Backend** → Render / Railway / Fly. Set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`.
- **DB** → MongoDB Atlas.
- **Images** → wire `CLOUDINARY_*` for real uploads (currently URL-based).

---

Built for food lovers. 🍕🍚🍗
