export interface User {
  id: string;
  email: string;
  username: string;
  role: "superadmin" | "admin" | "anggota";
  anggota_id: string | null;
}

// Update LoginResponse to match actual backend response
export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
