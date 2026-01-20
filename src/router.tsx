import { createBrowserRouter, Outlet, useNavigate } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardRedirect } from "@/components/DashboardRedirect";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
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

  // Filter routes that have components and deduplicate by path
  const seenPaths = new Set<string>();

  return allRoutes
    .filter((route) => {
      // Skip routes without components
      if (!route.component) return false;

      // Skip parent routes that return null
      if (route.component.toString().includes("null")) return false;

      // Skip duplicate paths
      if (seenPaths.has(route.path)) {
        console.log("⚠️ [Router] Skipping duplicate route:", route.path);
        return false;
      }

      seenPaths.add(route.path);
      return true;
    })
    .map((route) => {
      const cleanPath = route.path.startsWith("/") ? route.path.substring(1) : route.path;
      console.log("📍 [Router] Registering route:", route.path, "→", cleanPath, "roles:", route.roles);

      return {
        path: cleanPath,
        element: (
          <ProtectedRoute allowedRoles={route.roles}>
            <Suspense fallback={<LoadingFallback />}>
              <route.component />
            </Suspense>
          </ProtectedRoute>
        ),
      };
    });
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
        path: "/register",
        element: <Register />,
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
            element: <DashboardRedirect />,
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
