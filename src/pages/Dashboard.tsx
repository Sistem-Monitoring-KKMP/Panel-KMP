import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, TrendingUp, DollarSign } from "lucide-react";

export function Dashboard() {
  const { user } = useAuth();

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "superadmin":
        return "bg-red-500 text-white";
      case "admin":
        return "bg-blue-500 text-white";
      case "anggota":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Anggota</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">+20 dari bulan lalu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Simpanan</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 45.2M</div>
            <p className="text-xs text-muted-foreground">+12% dari bulan lalu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pinjaman Aktif</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">+4 dari bulan lalu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktivitas Hari Ini</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Transaksi baru</p>
          </CardContent>
        </Card>
      </div>

      {/* User Info Card */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Selamat Datang Kembali!</CardTitle>
            <CardDescription>Anda berhasil masuk ke sistem</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Username</p>
                  <p className="text-2xl font-bold">{user?.username}</p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-lg">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Role</p>
                  <span className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium ${getRoleBadgeColor(user?.role || "")}`}>{user?.role}</span>
                </div>
              </div>

              {user?.anggota_id && (
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Anggota ID</p>
                    <p className="text-lg font-mono">{user.anggota_id}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Role-specific content */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>
              {user?.role === "superadmin" && "Panel Superadmin"}
              {user?.role === "admin" && "Panel Admin"}
              {user?.role === "anggota" && "Dashboard Anggota"}
            </CardTitle>
            <CardDescription>
              {user?.role === "superadmin" && "Akses penuh ke sistem"}
              {user?.role === "admin" && "Kelola organisasi Anda"}
              {user?.role === "anggota" && "Informasi pribadi Anda"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {user?.role === "superadmin" && (
                <>
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="text-sm">Status Akun</span>
                    <span className="text-sm font-medium text-green-600">Aktif</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="text-sm">Level Akses</span>
                    <span className="text-sm font-medium">Penuh</span>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">Sebagai superadmin, Anda dapat mengelola semua user, koperasi, dan pengaturan sistem.</p>
                </>
              )}

              {user?.role === "admin" && (
                <>
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="text-sm">Status Akun</span>
                    <span className="text-sm font-medium text-green-600">Aktif</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="text-sm">Level Akses</span>
                    <span className="text-sm font-medium">Terbatas</span>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">Sebagai admin, Anda dapat mengelola user dan koperasi di organisasi Anda.</p>
                </>
              )}

              {user?.role === "anggota" && (
                <>
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="text-sm">Status Keanggotaan</span>
                    <span className="text-sm font-medium text-green-600">Aktif</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="text-sm">Saldo Simpanan</span>
                    <span className="text-sm font-medium">Rp 5.000.000</span>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">Lihat dan kelola informasi pribadi serta aktivitas Anda.</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
