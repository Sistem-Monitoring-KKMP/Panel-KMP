import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Building2, Users2, TrendingUp, CheckCircle2, Clock, AlertCircle, ChevronRight, FileText } from "lucide-react";
import { getKuesionerProgress } from "@/lib/kuesioner-api";

interface KuesionerSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  progress: number;
  status: "belum_mulai" | "sedang_mengisi" | "selesai";
  totalQuestions: number;
  answeredQuestions: number;
}

export function Kuesioner() {
  const navigate = useNavigate();
  const [sections, setSections] = useState<KuesionerSection[]>([
    {
      id: "organisasi",
      title: "Kuesioner Organisasi",
      description: "Pertanyaan seputar struktur organisasi, tata kelola, dan rencana strategis koperasi Anda",
      icon: <Users2 className="h-8 w-8" />,
      path: "/kuesioner/organisasi",
      progress: 0,
      status: "belum_mulai",
      totalQuestions: 25,
      answeredQuestions: 0,
    },
    {
      id: "bisnis",
      title: "Kuesioner Bisnis & Keuangan",
      description: "Pertanyaan seputar performa bisnis, keuangan, dan hubungan dengan lembaga mitra",
      icon: <Building2 className="h-8 w-8" />,
      path: "/kuesioner/bisnis",
      progress: 0,
      status: "belum_mulai",
      totalQuestions: 30,
      answeredQuestions: 0,
    },
  ]);

  const [overallProgress, setOverallProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  console.log("🎯 [Kuesioner] Component rendered, isLoading:", isLoading, "loadError:", loadError);

  // Load progress from API
  useEffect(() => {
    async function loadProgress() {
      try {
        setIsLoading(true);
        setLoadError(null);
        console.log("🔄 [Kuesioner] Loading progress...");
        const progress = await getKuesionerProgress();
        console.log("✅ [Kuesioner] Progress loaded:", progress);

        // Update sections with progress
        setSections((prev) =>
          prev.map((section) => {
            const sectionProgress = section.id === "organisasi" ? progress.organisasi : progress.bisnis;
            const answeredQuestions = Math.round((sectionProgress / 100) * section.totalQuestions);

            let status: "belum_mulai" | "sedang_mengisi" | "selesai" = "belum_mulai";
            if (sectionProgress === 100) status = "selesai";
            else if (sectionProgress > 0) status = "sedang_mengisi";

            return {
              ...section,
              progress: sectionProgress,
              status,
              answeredQuestions,
            };
          })
        );

        setOverallProgress(progress.total);
      } catch (error: any) {
        console.error("❌ [Kuesioner] Error loading progress:", error);
        setLoadError(error.message || "Gagal memuat progress kuesioner");
        // Don't show error toast, just set error state for display
      } finally {
        console.log("🏁 [Kuesioner] Loading finished");
        setIsLoading(false);
      }
    }

    loadProgress().catch((err) => {
      console.error("❌ [Kuesioner] Uncaught error:", err);
      setLoadError(err.message || "Terjadi kesalahan");
      setIsLoading(false);
    });
  }, []);

  const getStatusBadge = (status: KuesionerSection["status"]) => {
    switch (status) {
      case "selesai":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Selesai
          </Badge>
        );
      case "sedang_mengisi":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Sedang Mengisi
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <AlertCircle className="h-3 w-3 mr-1" />
            Belum Mulai
          </Badge>
        );
    }
  };

  const getStatusColor = (status: KuesionerSection["status"]) => {
    switch (status) {
      case "selesai":
        return "border-green-200 bg-green-50/50";
      case "sedang_mengisi":
        return "border-yellow-200 bg-yellow-50/50";
      default:
        return "";
    }
  };

  console.log("🖼️ [Kuesioner] About to render, isLoading:", isLoading, "loadError:", loadError);

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <ClipboardList className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tight">Kuesioner Koperasi</h2>
          <p className="text-muted-foreground">Silahkan isi kuesioner berikut untuk membantu kami mengevaluasi kinerja koperasi</p>
        </div>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Memuat progress kuesioner...</p>
            </div>
          </CardContent>
        </Card>
      ) : loadError ? (
        <>
          {/* Error state - but still show sections */}
          <Card className="border-yellow-200 bg-yellow-50/50">
            <CardContent className="py-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-yellow-900">Tidak dapat memuat progress</h4>
                  <p className="text-sm text-yellow-700 mt-1">{loadError}</p>
                  <p className="text-sm text-yellow-600 mt-2">Anda tetap dapat mengisi kuesioner. Progress akan dimuat saat Anda membuka halaman kuesioner.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section Cards - Always visible */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pilih Kategori Kuesioner</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {sections.map((section) => (
                <Card key={section.id} className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50" onClick={() => navigate(section.path)}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary">{section.icon}</div>
                      <Badge variant="secondary">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Belum Mulai
                      </Badge>
                    </div>
                    <CardTitle className="mt-4">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{section.totalQuestions} pertanyaan</span>
                      <Button size="sm" className="gap-1">
                        Mulai
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Instructions Card */}
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                Petunjuk Pengisian
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                <li>Jawab semua pertanyaan dengan jujur dan sesuai kondisi koperasi Anda saat ini</li>
                <li>Data yang Anda masukkan akan digunakan untuk evaluasi dan pengembangan koperasi</li>
                <li>Anda dapat menyimpan progress dan melanjutkan pengisian di lain waktu</li>
                <li>Pastikan semua bagian kuesioner telah terisi sebelum mengirimkan</li>
                <li>Jika ada pertanyaan, silahkan hubungi pengurus koperasi Anda</li>
              </ul>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* Progress Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Progress Pengisian
              </CardTitle>
              <CardDescription>Status pengisian kuesioner Anda secara keseluruhan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress Keseluruhan</span>
                <span className="text-sm font-bold text-primary">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary">{sections.reduce((acc, s) => acc + s.totalQuestions, 0)}</p>
                  <p className="text-xs text-muted-foreground">Total Pertanyaan</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{sections.reduce((acc, s) => acc + s.answeredQuestions, 0)}</p>
                  <p className="text-xs text-muted-foreground">Sudah Dijawab</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg col-span-2 md:col-span-1">
                  <p className="text-2xl font-bold text-yellow-600">{sections.reduce((acc, s) => acc + (s.totalQuestions - s.answeredQuestions), 0)}</p>
                  <p className="text-xs text-muted-foreground">Belum Dijawab</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pilih Kategori Kuesioner</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {sections.map((section) => (
                <Card key={section.id} className={`cursor-pointer transition-all hover:shadow-md hover:border-primary/50 ${getStatusColor(section.status)}`} onClick={() => navigate(section.path)}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-lg ${section.status === "selesai" ? "bg-green-100 text-green-600" : section.status === "sedang_mengisi" ? "bg-yellow-100 text-yellow-600" : "bg-primary/10 text-primary"}`}>
                        {section.icon}
                      </div>
                      {getStatusBadge(section.status)}
                    </div>
                    <CardTitle className="mt-4">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{section.progress}%</span>
                      </div>
                      <Progress value={section.progress} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {section.answeredQuestions} dari {section.totalQuestions} pertanyaan
                      </span>
                      <Button size="sm" className="gap-1">
                        {section.status === "belum_mulai" ? "Mulai" : section.status === "sedang_mengisi" ? "Lanjutkan" : "Lihat"}
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Instructions Card */}
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                Petunjuk Pengisian
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                <li>Jawab semua pertanyaan dengan jujur dan sesuai kondisi koperasi Anda saat ini</li>
                <li>Data yang Anda masukkan akan digunakan untuk evaluasi dan pengembangan koperasi</li>
                <li>Anda dapat menyimpan progress dan melanjutkan pengisian di lain waktu</li>
                <li>Pastikan semua bagian kuesioner telah terisi sebelum mengirimkan</li>
                <li>Jika ada pertanyaan, silahkan hubungi pengurus koperasi Anda</li>
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
