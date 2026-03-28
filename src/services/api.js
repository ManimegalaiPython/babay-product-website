import axios from 'axios';

// ================= BASE URLs =================
// Use environment variables (Vite .env files) to automatically switch
// between localhost (development) and deployed backend (production)
export const API_BASE_URL = import.meta.env.VITE_API_URL || "https://manipraveen1.pythonanywhere.com/api/";
export const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_URL || "https://manipraveen1.pythonanywhere.com/";

// ================= AXIOS INSTANCE =================
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // ✅ Required if CORS_ALLOW_CREDENTIALS = True
});

// ================= JWT INTERCEPTOR =================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refresh')
    ) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(
          `${API_BASE_URL}token/refresh/`,
          { refresh: localStorage.getItem('refresh') },
          { withCredentials: true } // ✅ include credentials
        );
        localStorage.setItem('access', data.access);
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ================= AUTH =================
export const login = (username, password) =>
  api.post('token/', { username, password });

export const register = (userData) =>
  api.post('register/', userData);

export const refreshToken = (refresh) =>
  api.post('token/refresh/', { refresh });

export const forgotPassword = (email) =>
  api.post('forgot-password/', { email });

// ================= CATEGORIES =================
export const fetchCategories = () => api.get('categories/');

// ================= PRODUCTS =================
export const fetchProducts = (params = {}) =>
  api.get('products/', { params });

export const fetchProductBySlug = (slug) =>
  api.get(`products/${slug}/`);

// ================= CART =================
export const getCart = () => api.get('cart/');
export const fetchCart = getCart;

export const addToCart = (productId, quantity) =>
  api.post('cart/add_item/', { product_id: productId, quantity });

export const updateCartItem = (itemId, quantity) =>
  api.post('cart/update_quantity/', { item_id: itemId, quantity });

export const removeFromCart = (itemId) =>
  api.post('cart/remove_item/', { item_id: itemId });

export const clearCart = () => api.delete('cart/clear/');

// ================= ORDERS =================
export const placeOrder = (payload) => api.post('orders/create/', payload);
export const verifyPayment = (payload) => api.post('orders/verify-payment/', payload);
export const fetchOrderDetail = (orderId) =>
  api.get(`orders/${orderId}/detail/`);
export const fetchMyOrders = () => api.get('orders/');

// ================= BRANDS =================
export const fetchBrands = () => api.get('brands/');

// ================= REVIEWS =================
export const fetchReviews = () => api.get('reviews/');
export const likeReview = (id) => api.post(`reviews/${id}/like/`);
export const dislikeReview = (id) => api.post(`reviews/${id}/dislike/`);

// ================= CONTACT =================
export const sendContactMessage = (formData) => api.post('contact/', formData);

// ================= FORUM =================
export const fetchForumGroups = () => api.get('forum/groups/');
export const forumRegister = (userData) => api.post('forum/register/', userData);
export const fetchForumMessages = (groupId) =>
  api.get('forum/messages/', { params: { group_id: groupId } });
export const sendForumMessage = (messageData) => api.post('forum/message/', messageData);
export const fetchForumBlogs = () => api.get('forum/blogs/');

// ================= PARENTING =================
export const fetchParentingClasses = () => api.get('parenting/classes/');
export const joinParentingClass = (enrollData) => api.post('parenting/join-class/', enrollData);
export const fetchWorkshops = () => api.get('parenting/workshops/');
export const registerWorkshop = (regData) => api.post('parenting/register-workshop/', regData);

// ================= DEFAULT EXPORT =================
export default api;
