import { createBrowserRouter, Navigate, Outlet, useNavigate } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Login } from "@/pages/Login";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getAllRoutes } from "@/config/routes.config";

// Root layout with AuthProvider
function RootLayout() {
  const navigate = useNavigate();

  // ✅ Handle unauthorized event
  useEffect(() => {
    const handleUnauthorized = () => {
      navigate("/login", { replace: true });
    };

    window.addEventListener("unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("unauthorized", handleUnauthorized);
    };
  }, [navigate]);
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

// Loading fallback
function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
        <p className="mt-4 text-sm text-muted-foreground">Memuat...</p>
      </div>
    </div>
  );
}

// Generate route elements from config
const generateRouteElements = () => {
  const allRoutes = getAllRoutes();

  return allRoutes
    .filter((route) => route.component) // Only routes with components
    .map((route) => ({
      path: route.path.replace("/", ""), // Remove leading slash
      element: (
        <ProtectedRoute allowedRoles={route.roles}>
          <Suspense fallback={<LoadingFallback />}>
            <route.component />
          </Suspense>
        </ProtectedRoute>
      ),
    }));
};

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/manajemen-koperasi/profil" replace />,
          },
          ...generateRouteElements(),
        ],
      },
      {
        path: "*",
        element: (
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold">404</h1>
              <p className="mt-2 text-lg">Halaman Tidak Ditemukan</p>
            </div>
          </div>
        ),
      },
    ],
  },
]);
