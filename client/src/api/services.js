import client from './client.js';

// ---- Restaurants ----
export const fetchCollections = () =>
  client.get('/restaurants/collections').then((r) => r.data);

export const fetchRestaurants = (params = {}) =>
  client.get('/restaurants', { params }).then((r) => r.data);

export const fetchRestaurant = (id) =>
  client.get(`/restaurants/${id}`).then((r) => r.data);

export const fetchNearby = (lng, lat, radius = 5) =>
  client.get('/restaurants/nearby', { params: { lng, lat, radius } }).then((r) => r.data);

export const createRestaurant = (payload) =>
  client.post('/restaurants', payload).then((r) => r.data);

export const updateRestaurant = (id, payload) =>
  client.put(`/restaurants/${id}`, payload).then((r) => r.data);

export const deleteRestaurant = (id) =>
  client.delete(`/restaurants/${id}`).then((r) => r.data);

// ---- Dishes ----
export const fetchTrendingDishes = () =>
  client.get('/dishes/trending').then((r) => r.data);

export const fetchRecommendations = (category) =>
  client.get('/dishes/recommendations', { params: { category } }).then((r) => r.data);

export const fetchDishes = (params = {}) =>
  client.get('/dishes', { params }).then((r) => r.data);

export const likeDish = (id) => client.post(`/dishes/${id}/like`).then((r) => r.data);

export const createDish = (payload) => client.post('/dishes', payload).then((r) => r.data);

// ---- Reviews ----
export const fetchReviews = (restaurantId) =>
  client.get(`/reviews/restaurant/${restaurantId}`).then((r) => r.data);

export const submitReview = (restaurantId, payload) =>
  client.post(`/reviews/restaurant/${restaurantId}`, payload).then((r) => r.data);

// ---- User ----
export const fetchFavourites = () => client.get('/users/favourites').then((r) => r.data);
export const toggleFavourite = (id) =>
  client.post(`/users/favourites/${id}`).then((r) => r.data);
export const fetchRecent = () => client.get('/users/recent').then((r) => r.data);
export const addRecent = (id) => client.post(`/users/recent/${id}`).then((r) => r.data);

// ---- Auth ----
export const loginRequest = (payload) => client.post('/auth/login', payload).then((r) => r.data);
export const registerRequest = (payload) =>
  client.post('/auth/register', payload).then((r) => r.data);
export const fetchMe = () => client.get('/auth/me').then((r) => r.data);

// ---- Admin ----
export const fetchAnalytics = () => client.get('/admin/analytics').then((r) => r.data);
