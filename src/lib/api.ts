import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";
import Cookies from "js-cookie";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true, // Important for cookies
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      Cookies.remove("token", { path: "/" });
      Cookies.remove("user", { path: "/" });
      // Trigger custom event untuk redirect
      window.dispatchEvent(new CustomEvent("unauthorized"));
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error("Access forbidden");
    }

    return Promise.reject(error);
  }
);

// Generic response type
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

// GET Request
export async function getFetcher<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await apiClient.get(url, config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    }
    throw error;
  }
}

// POST Request
export async function postFetcher<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  // Changed return type from ApiResponse<T> to T
  try {
    const response: AxiosResponse<T> = await apiClient.post(url, data, config);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    }
    throw error;
  }
}

// POST Request with FormData
export async function postFormDataFetcher<T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await apiClient.post(url, formData, {
      ...config,
      headers: {
        "Content-Type": "multipart/form-data",
        ...config?.headers,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    }
    throw error;
  }
}

// PUT Request
export async function putFetcher<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await apiClient.put(url, data, config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    }
    throw error;
  }
}

// PUT Request with FormData
export async function putFormDataFetcher<T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await apiClient.put(url, formData, {
      ...config,
      headers: {
        "Content-Type": "multipart/form-data",
        ...config?.headers,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    }
    throw error;
  }
}

// PATCH Request
export async function patchFetcher<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await apiClient.patch(url, data, config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    }
    throw error;
  }
}

// PATCH Request with FormData
export async function patchFormDataFetcher<T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await apiClient.patch(url, formData, {
      ...config,
      headers: {
        "Content-Type": "multipart/form-data",
        ...config?.headers,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    }
    throw error;
  }
}

// DELETE Request
export async function deleteFetcher<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await apiClient.delete(url, config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    }
    throw error;
  }
}

// Cookie options - optimized for localhost development
const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: false, // false for localhost HTTP
  sameSite: "lax" as const, // lax for better compatibility
  path: "/",
};

// Helper function to set auth token in cookie
export function setAuthToken(token: string | null) {
  if (token) {
    Cookies.set("token", token, COOKIE_OPTIONS);
    console.log("🍪 Token cookie set");
  } else {
    Cookies.remove("token", { path: "/" });
    console.log("🍪 Token cookie removed");
  }
}

// Helper function to get auth token from cookie
export function getAuthToken(): string | undefined {
  return Cookies.get("token");
}

// Helper function to check if user is authenticated
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

// Helper function to clear all auth data
export function clearAuth() {
  Cookies.remove("token", { path: "/" });
  Cookies.remove("user", { path: "/" });
  console.log("🍪 All auth cookies cleared");
}

// Export axios instance for custom usage
export { apiClient };
