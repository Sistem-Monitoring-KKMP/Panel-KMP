import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function DashboardRedirect() {
  const { user, isLoading } = useAuth();

  console.log("🔀 [DashboardRedirect] isLoading:", isLoading, "user:", user);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  // Redirect based on user role
  if (user?.role === "anggota") {
    console.log("✅ [DashboardRedirect] Redirecting anggota to /kuesioner");
    return <Navigate to="/kuesioner" replace />;
  }

  // For superadmin and admin, redirect to koperasi management
  console.log("✅ [DashboardRedirect] Redirecting", user?.role, "to /manajemen-koperasi/profil");
  return <Navigate to="/manajemen-koperasi/profil" replace />;
}
