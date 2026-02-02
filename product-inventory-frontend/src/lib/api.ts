import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      
      if (status === 401) {
        // Clear invalid token and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('userEmail');
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
      }
      
      return Promise.reject({
        status,
        message: (data as { message?: string })?.message || 'An error occurred',
        data,
      });
    }
    
    if (error.request) {
      // Request made but no response
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.',
      });
    }
    
    return Promise.reject({
      status: 0,
      message: error.message || 'An unexpected error occurred',
    });
  }
);

// Auth API helpers
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (email: string, password: string, role?: string) =>
    api.post('/auth/register', { email, password, role }),
};

// Product API helpers
export const productsApi = {
  getAll: () => api.get('/api/products'),
  getById: (id: number) => api.get(`/products/${id}`),
  create: (data: { name: string; description?: string; price: number; quantity: number; categoryId?: number }) =>
    api.post('/products', data),
  update: (id: number, data: Partial<{ name: string; description: string; price: number; quantity: number; categoryId: number }>) =>
    api.patch(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
};

// Cart API helpers
export const cartApi = {
  getCart: () => api.get('/orders/my-cart'),
  addToCart: (productId: number, quantity: number) =>
    api.post('/orders/my-cart', { productId, quantity }),
  updateCartItem: (productId: number, quantity: number) =>
    api.patch('/orders/my-cart', { productId, quantity }),
  removeFromCart: (productId: number) =>
    api.delete(`/orders/my-cart/${productId}`),
  clearCart: () => api.delete('/orders/my-cart'),
};

export default api;
