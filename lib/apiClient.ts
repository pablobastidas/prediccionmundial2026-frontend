import axios from 'axios';
import { supabase } from './supabase';
import { showToast } from '@/components/ui/Toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000, // 10s timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  if (config.url && config.url.startsWith('/') && !config.url.startsWith('/api/')) {
    config.url = `/api${config.url}`;
  } else if (config.url && !config.url.startsWith('/') && !config.url.startsWith('api/')) {
    config.url = `/api/${config.url}`;
  }
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (e) {
    console.warn('No active session found or Supabase error:', e);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined') {
      if (!error.response) {
        // Network errors or timeout
        if (error.code === 'ECONNABORTED') {
          showToast('La solicitud tardó demasiado. Intenta de nuevo.', 'error');
        } else {
          showToast('Error de conexión. Revisa tu red.', 'error');
        }
      } else {
        const status = error.response.status;
        if (status === 401) {
          window.location.href = '/login?message=session_expired';
        } else if (status === 403) {
          showToast('No tienes permisos para realizar esta acción.', 'error');
        } else if (status >= 500) {
          showToast('Error en el servidor. Intenta de nuevo más tarde.', 'error');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
