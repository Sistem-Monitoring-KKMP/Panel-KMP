import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, TrendingUp, Users, MapPin, ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import { getFetcher } from "@/lib/api";
import type { Koperasi } from "@/types/koperasi";
import { LokasiTab } from "@/components/LokasiTab";
import { PengurusTab } from "@/components/PengurusTab";
import { RespondenTab } from "@/components/RespondenTab";
import { PerformaTab } from "@/components/PerformaTab";

export function PanelKoperasi() {
  const { koperasiId } = useParams<{ koperasiId: string }>();
  const navigate = useNavigate();
  const [koperasi, setKoperasi] = useState<Koperasi | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("performa");

  useEffect(() => {
    const fetchKoperasi = async () => {
      if (!koperasiId) return;

      try {
        setIsLoading(true);
        const result = await getFetcher<Koperasi>(`/api/koperasi/${koperasiId}`);

        if (result.success && result.data) {
          setKoperasi(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch koperasi:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKoperasi();
  }, [koperasiId]);

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

  if (!koperasi) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold">404</h1>
          <p className="mt-2 text-lg">Koperasi Tidak Ditemukan</p>
          <Button onClick={() => navigate("/manajemen-koperasi")} className="mt-4">
            Kembali ke Manajemen Koperasi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/manajemen-koperasi/profil")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tight">Panel Koperasi</h2>
          <p className="text-muted-foreground">{koperasi.nama}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Koperasi</CardTitle>
          <CardDescription>Detail informasi koperasi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nama Koperasi</p>
              <p className="font-medium">{koperasi.nama}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">No. Badan Hukum</p>
              <p className="font-medium">{koperasi.no_badan_hukum || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium">{koperasi.status === "Aktif" ? "Aktif" : koperasi.status === "TidakAktif" ? "Tidak Aktif" : "Pembentukan"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performa" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Performa</span>
          </TabsTrigger>
          <TabsTrigger value="pengurus" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Pengurus</span>
          </TabsTrigger>
          <TabsTrigger value="lokasi" className="gap-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Lokasi</span>
          </TabsTrigger>
          <TabsTrigger value="responden" className="gap-2">
            <ClipboardList className="h-4 w-4" />
            <span className="hidden sm:inline">Responden</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performa" className="space-y-4">
          {koperasiId && <PerformaTab koperasiId={koperasiId} />}
        </TabsContent>

        <TabsContent value="pengurus" className="space-y-4">
          {koperasiId && <PengurusTab koperasiId={koperasiId} />}
        </TabsContent>

        <TabsContent value="lokasi" className="space-y-4">
          {koperasiId && <LokasiTab koperasiId={koperasiId} />}
        </TabsContent>

        {/* ✅ Tab Responden - Ganti dengan RespondenTab component */}
        <TabsContent value="responden" className="space-y-4">
          {koperasiId && <RespondenTab koperasiId={koperasiId} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
