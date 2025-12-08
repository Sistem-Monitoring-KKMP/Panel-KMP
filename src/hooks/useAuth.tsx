import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { postFetcher, getAuthToken, clearAuth } from "@/lib/api";
import type { User, LoginResponse, AuthContextType } from "@/types/auth";
import Cookies from "js-cookie";
import { toast } from "sonner";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = () => {
      const token = getAuthToken();

      if (token) {
        const userCookie = Cookies.get("user");

        if (userCookie) {
          try {
            const userData = JSON.parse(userCookie);
            setUser(userData);
          } catch (error) {
            console.error("Failed to parse user data:", error);
            clearAuth();
            Cookies.remove("user", { path: "/" });
          }
        } else {
          clearAuth();
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await postFetcher<LoginResponse>("/api/auth/login", {
        email,
        password,
      });

      if (!response.success) {
        const errorMsg = response.message || "Login failed";
        throw new Error(errorMsg);
      }

      const { token, user: userData } = response;

      if (!token || !userData) {
        throw new Error("Invalid response from server");
      }

      const cookieOptions = {
        expires: 7,
        secure: false,
        sameSite: "lax" as const,
        path: "/",
      };

      Cookies.set("token", token, cookieOptions);
      Cookies.set("user", JSON.stringify(userData), cookieOptions);

      const verifyToken = Cookies.get("token");
      const verifyUser = Cookies.get("user");

      if (!verifyToken || !verifyUser) {
        throw new Error("Failed to save authentication data");
      }

      // Update state immediately
      setUser(userData);

      // Navigate instead of window.location.href
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      clearAuth();
      Cookies.remove("user", { path: "/" });

      let errorMessage = "Login failed. Please check your credentials.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    clearAuth();
    Cookies.remove("user", { path: "/" });
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
