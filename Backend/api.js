import axios from 'axios';

const API_URL = 'http://localhost:5000/api';  // Your backend base URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token if needed
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // or your auth storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getReviews = () => api.get('/reviews');
export const createReview = (data) => api.post('/reviews', data);
export const likeReview = (id) => api.put(`/reviews/${id}/like`);
export const addReply = (id, reply) => api.post(`/reviews/${id}/reply`, { text: reply });

// Export default if you want
export default api;
