import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor with cookies session (MUCH SIMPLER NOW)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // no longer need to pull from localStorage! 
    // browser automatically attaches the 'accessToken' cookie.
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (The "Refresh" Logic)
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If the error is 401 (Unauthorized) and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark that we are trying a refresh

      try {
        // Hit you refresh endpoint
        // Note: This request will automatically include the 'refreshToken' cookie
        await axios.post(
          `${apiClient.defaults.baseURL}/auth/refreshToken`,
          {},
          { withCredentials: true }
        );

        // If successful, the backend has set a NEW 'accessToken' cookie.
        // Now, retry the original request that failed!
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails (e.g., refresh token is also expired)
        // Full logout
        if (typeof window !== 'undefined') {
          // You don't clear cookies here (JS can't touch httpOnly cookies)
          // Just redirect; your backend 'logout' or expiry handles the rest
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API helpers
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  
  register: (email: string, password: string, role?: string) =>
    apiClient.post('/auth/register', { email, password, role }),

  logout: () =>
    apiClient.post('/auth/logout')
};

// Product API helpers
export const productsApi = {
  getAll: () => apiClient.get('/products'),
  getById: (id: number) => apiClient.get(`/products/${id}`),
  getBySlug: (slug: string) => apiClient.get(`/products/slug/${slug}`),
  create: (data: { name: string; description?: string; price: number; quantity: number; categoryId?: number }) =>
    apiClient.post('/products', data),
  update: (id: number, data: Partial<{ name: string; description: string; price: number; quantity: number; categoryId: number }>) =>
    apiClient.patch(`/products/${id}`, data),
  delete: (id: number) => apiClient.delete(`/products/${id}`),
};

export const cartApi = {
  // GET /cart
  getCart: () => apiClient.get('/cart'),
  
  // POST /cart
  addToCart: (productId: string, quantity: number) =>
    apiClient.post('/cart', { productId, quantity }),
    
  // PATCH /cart
  updateCartItem: (productId: string, quantity: number) =>
    apiClient.patch(`/cart/${productId}`, { quantity }),
    
  // DELETE /cart/:id
  removeFromCart: (productId: string) =>
    apiClient.delete(`/cart/${productId}`),

  // Clear cart product
  clearCart: () => apiClient.delete('/cart'),
};

export const categoryApi = {
  // GET /categories
  getAll: () => apiClient.get('/categories'),

  // GET /categories/:id
  getById: (id: string) => apiClient.get(`/categories/${id}`),

  // POST /categories -> admin only
  create: (data: { name: string; slug: string }) => apiClient.post('/categories', data),

  // PATCH /categories/:id -> admin only
  update: (id: string, data: { name: string; slug: string }) => apiClient.patch(`/categories/${id}`, data),

  // DELETE /categories/:id -> admin only
  delete: (id: string) => apiClient.delete(`/categories/${id}`),
};

export const storeApi = {
  getMyStore: () => apiClient.get('/stores/my-store'), // Create this endpoint in NestJS
  createStore: (data: { name: string; slug: string }) => apiClient.post('/stores', data),
};

export default apiClient;
