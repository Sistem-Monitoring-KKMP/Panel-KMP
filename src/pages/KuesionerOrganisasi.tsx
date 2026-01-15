import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Users2, Building, FileCheck, GraduationCap, Calendar, Save, CheckCircle2, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { loadKuesionerOrganisasi, saveKuesionerOrganisasi } from "@/lib/kuesioner-api";
import type { KuesionerOrganisasiFormData } from "@/types/kuesioner";

interface FormData {
  // Data Organisasi
  jumlah_pengurus: number | null;
  jumlah_pengawas: number | null;
  jumlah_karyawan: number | null;
  status: "Aktif" | "TidakAktif" | "Pembentukan" | "";
  total_anggota: number | null;
  anggota_aktif: number | null;
  anggota_tidak_aktif: number | null;

  // Tata Kelola
  general_manager: boolean | null;
  rapat_tepat_waktu: boolean | null;
  rapat_luar_biasa: boolean | null;
  pergantian_pengurus: boolean | null;
  pergantian_pengawas: boolean | null;

  // Rencana Strategis
  rencana_strategis: {
    visi: boolean;
    misi: boolean;
    rencana_strategis: boolean;
    sasaran_operasional: boolean;
    art: boolean;
  };

  // Prinsip Koperasi
  prinsip_koperasi: {
    sukarela_terbuka: number | null;
    demokratis: number | null;
    ekonomi: number | null;
    kemandirian: number | null;
    pendidikan: number | null;
    kerja_sama: number | null;
    kepedulian: number | null;
  };

  // Pelatihan
  pelatihan: {
    pelatihan: string;
    akumulasi: number | null;
  }[];

  // Rapat Koordinasi
  rapat_koordinasi: {
    rapat_pengurus: string;
    rapat_pengawas: string;
    rapat_gabungan: string;
    rapat_pengurus_karyawan: string;
    rapat_pengurus_anggota: string;
  };
}

const steps = [
  { id: 1, title: "Data Organisasi", icon: Users2, description: "Struktur dan keanggotaan" },
  { id: 2, title: "Tata Kelola", icon: Building, description: "Manajemen dan rapat" },
  { id: 3, title: "Rencana Strategis", icon: FileCheck, description: "Visi, misi, dan perencanaan" },
  { id: 4, title: "Prinsip Koperasi", icon: GraduationCap, description: "Nilai-nilai koperasi" },
  { id: 5, title: "Pelatihan & Rapat", icon: Calendar, description: "Pengembangan SDM" },
];

export function KuesionerOrganisasi() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    jumlah_pengurus: null,
    jumlah_pengawas: null,
    jumlah_karyawan: null,
    status: "",
    total_anggota: null,
    anggota_aktif: null,
    anggota_tidak_aktif: null,
    general_manager: null,
    rapat_tepat_waktu: null,
    rapat_luar_biasa: null,
    pergantian_pengurus: null,
    pergantian_pengawas: null,
    rencana_strategis: {
      visi: false,
      misi: false,
      rencana_strategis: false,
      sasaran_operasional: false,
      art: false,
    },
    prinsip_koperasi: {
      sukarela_terbuka: null,
      demokratis: null,
      ekonomi: null,
      kemandirian: null,
      pendidikan: null,
      kerja_sama: null,
      kepedulian: null,
    },
    pelatihan: [],
    rapat_koordinasi: {
      rapat_pengurus: "",
      rapat_pengawas: "",
      rapat_gabungan: "",
      rapat_pengurus_karyawan: "",
      rapat_pengurus_anggota: "",
    },
  });

  // Load data from API on mount
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await loadKuesionerOrganisasi();
        if (data) {
          setFormData(data as FormData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Gagal memuat data kuesioner");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value === "" ? null : value,
    }));
  };

  const handleNestedChange = (section: keyof FormData, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as object),
        [field]: value === "" ? null : value,
      },
    }));
  };

  const handleBooleanQuestion = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value === "ya",
    }));
  };

  const addPelatihan = () => {
    setFormData((prev) => ({
      ...prev,
      pelatihan: [...prev.pelatihan, { pelatihan: "", akumulasi: null }],
    }));
  };

  const removePelatihan = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      pelatihan: prev.pelatihan.filter((_, i) => i !== index),
    }));
  };

  const updatePelatihan = (index: number, field: "pelatihan" | "akumulasi", value: any) => {
    setFormData((prev) => ({
      ...prev,
      pelatihan: prev.pelatihan.map((item, i) => (i === index ? { ...item, [field]: value === "" ? null : value } : item)),
    }));
  };

  const calculateProgress = () => {
    let filled = 0;
    let total = 20; // Approximate total questions

    // Count filled fields
    if (formData.jumlah_pengurus !== null) filled++;
    if (formData.jumlah_pengawas !== null) filled++;
    if (formData.jumlah_karyawan !== null) filled++;
    if (formData.status !== "") filled++;
    if (formData.total_anggota !== null) filled++;
    if (formData.anggota_aktif !== null) filled++;
    if (formData.anggota_tidak_aktif !== null) filled++;
    if (formData.general_manager !== null) filled++;
    if (formData.rapat_tepat_waktu !== null) filled++;
    if (formData.rapat_luar_biasa !== null) filled++;
    if (formData.pergantian_pengurus !== null) filled++;
    if (formData.pergantian_pengawas !== null) filled++;

    // Rencana Strategis
    Object.values(formData.rencana_strategis).forEach((v) => {
      if (v) filled++;
    });

    // Prinsip Koperasi
    Object.values(formData.prinsip_koperasi).forEach((v) => {
      if (v !== null) filled++;
    });

    return Math.round((filled / total) * 100);
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await saveKuesionerOrganisasi(formData as KuesionerOrganisasiFormData);
      toast.success("Progress berhasil disimpan!");
    } catch (error: any) {
      console.error("Error saving:", error);
      toast.error(error?.message || "Gagal menyimpan data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await saveKuesionerOrganisasi(formData as KuesionerOrganisasiFormData);
      toast.success("Kuesioner organisasi berhasil disimpan!");
      navigate("/kuesioner");
    } catch (error: any) {
      console.error("Error submitting:", error);
      toast.error(error?.message || "Gagal mengirim kuesioner");
    } finally {
      setIsSubmitting(false);
    }
  };

  const rapatOptions = [
    { value: "satu_minggu", label: "1 Minggu Sekali" },
    { value: "dua_minggu", label: "2 Minggu Sekali" },
    { value: "satu_bulan", label: "1 Bulan Sekali" },
    { value: "dua_bulan", label: "2 Bulan Sekali" },
    { value: "tiga_bulan_lebih", label: "3 Bulan Lebih" },
  ];

  const pelatihanOptions = [
    { value: "Pengurus", label: "Pengurus" },
    { value: "Pengawas", label: "Pengawas" },
    { value: "GeneralManager", label: "General Manager" },
    { value: "Karyawan", label: "Karyawan" },
    { value: "Anggota", label: "Anggota" },
    { value: "NonAnggota", label: "Non-Anggota" },
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Jumlah SDM */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Berapa jumlah SDM di koperasi Anda?
                </CardTitle>
                <CardDescription>Masukkan jumlah pengurus, pengawas, dan karyawan koperasi</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-base">Jumlah Pengurus</Label>
                  <Input type="number" placeholder="Masukkan jumlah" value={formData.jumlah_pengurus ?? ""} onChange={(e) => handleInputChange("jumlah_pengurus", parseInt(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Jumlah Pengawas</Label>
                  <Input type="number" placeholder="Masukkan jumlah" value={formData.jumlah_pengawas ?? ""} onChange={(e) => handleInputChange("jumlah_pengawas", parseInt(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Jumlah Karyawan</Label>
                  <Input type="number" placeholder="Masukkan jumlah" value={formData.jumlah_karyawan ?? ""} onChange={(e) => handleInputChange("jumlah_karyawan", parseInt(e.target.value))} />
                </div>
              </CardContent>
            </Card>

            {/* Status Koperasi */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Apa status koperasi Anda saat ini?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.status} onValueChange={(value) => handleInputChange("status", value)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Label htmlFor="status-aktif" className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${formData.status === "Aktif" ? "border-primary bg-primary/5" : "hover:bg-muted"}`}>
                    <RadioGroupItem value="Aktif" id="status-aktif" />
                    <div>
                      <p className="font-medium">Aktif</p>
                      <p className="text-sm text-muted-foreground">Beroperasi normal</p>
                    </div>
                  </Label>
                  <Label htmlFor="status-tidak-aktif" className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${formData.status === "TidakAktif" ? "border-primary bg-primary/5" : "hover:bg-muted"}`}>
                    <RadioGroupItem value="TidakAktif" id="status-tidak-aktif" />
                    <div>
                      <p className="font-medium">Tidak Aktif</p>
                      <p className="text-sm text-muted-foreground">Tidak beroperasi</p>
                    </div>
                  </Label>
                  <Label htmlFor="status-pembentukan" className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${formData.status === "Pembentukan" ? "border-primary bg-primary/5" : "hover:bg-muted"}`}>
                    <RadioGroupItem value="Pembentukan" id="status-pembentukan" />
                    <div>
                      <p className="font-medium">Pembentukan</p>
                      <p className="text-sm text-muted-foreground">Dalam proses</p>
                    </div>
                  </Label>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Jumlah Anggota */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Berapa jumlah anggota koperasi?
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-base">Total Anggota</Label>
                  <Input type="number" placeholder="Masukkan jumlah" value={formData.total_anggota ?? ""} onChange={(e) => handleInputChange("total_anggota", parseInt(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Anggota Aktif</Label>
                  <Input type="number" placeholder="Masukkan jumlah" value={formData.anggota_aktif ?? ""} onChange={(e) => handleInputChange("anggota_aktif", parseInt(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Anggota Tidak Aktif</Label>
                  <Input type="number" placeholder="Masukkan jumlah" value={formData.anggota_tidak_aktif ?? ""} onChange={(e) => handleInputChange("anggota_tidak_aktif", parseInt(e.target.value))} />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* General Manager */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Apakah koperasi memiliki General Manager?
                </CardTitle>
                <CardDescription>General Manager adalah pengelola profesional yang menjalankan operasional koperasi</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.general_manager === null ? "" : formData.general_manager ? "ya" : "tidak"} onValueChange={(value) => handleBooleanQuestion("general_manager", value)} className="flex gap-4">
                  <Label htmlFor="gm-ya" className={`flex items-center space-x-3 border rounded-lg px-6 py-4 cursor-pointer transition-colors ${formData.general_manager === true ? "border-primary bg-primary/5" : "hover:bg-muted"}`}>
                    <RadioGroupItem value="ya" id="gm-ya" />
                    <span className="font-medium">Ya</span>
                  </Label>
                  <Label htmlFor="gm-tidak" className={`flex items-center space-x-3 border rounded-lg px-6 py-4 cursor-pointer transition-colors ${formData.general_manager === false ? "border-primary bg-primary/5" : "hover:bg-muted"}`}>
                    <RadioGroupItem value="tidak" id="gm-tidak" />
                    <span className="font-medium">Tidak</span>
                  </Label>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Rapat Tepat Waktu */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Apakah Rapat Anggota Tahunan (RAT) dilaksanakan tepat waktu?
                </CardTitle>
                <CardDescription>RAT wajib dilaksanakan paling lambat 6 bulan setelah tutup buku tahun</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.rapat_tepat_waktu === null ? "" : formData.rapat_tepat_waktu ? "ya" : "tidak"} onValueChange={(value) => handleBooleanQuestion("rapat_tepat_waktu", value)} className="flex gap-4">
                  <Label htmlFor="rat-ya" className={`flex items-center space-x-3 border rounded-lg px-6 py-4 cursor-pointer transition-colors ${formData.rapat_tepat_waktu === true ? "border-primary bg-primary/5" : "hover:bg-muted"}`}>
                    <RadioGroupItem value="ya" id="rat-ya" />
                    <span className="font-medium">Ya, Tepat Waktu</span>
                  </Label>
                  <Label htmlFor="rat-tidak" className={`flex items-center space-x-3 border rounded-lg px-6 py-4 cursor-pointer transition-colors ${formData.rapat_tepat_waktu === false ? "border-primary bg-primary/5" : "hover:bg-muted"}`}>
                    <RadioGroupItem value="tidak" id="rat-tidak" />
                    <span className="font-medium">Tidak</span>
                  </Label>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Rapat Luar Biasa */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Apakah pernah dilaksanakan Rapat Anggota Luar Biasa?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.rapat_luar_biasa === null ? "" : formData.rapat_luar_biasa ? "ya" : "tidak"} onValueChange={(value) => handleBooleanQuestion("rapat_luar_biasa", value)} className="flex gap-4">
                  <Label htmlFor="rlb-ya" className={`flex items-center space-x-3 border rounded-lg px-6 py-4 cursor-pointer transition-colors ${formData.rapat_luar_biasa === true ? "border-primary bg-primary/5" : "hover:bg-muted"}`}>
                    <RadioGroupItem value="ya" id="rlb-ya" />
                    <span className="font-medium">Ya, Pernah</span>
                  </Label>
                  <Label htmlFor="rlb-tidak" className={`flex items-center space-x-3 border rounded-lg px-6 py-4 cursor-pointer transition-colors ${formData.rapat_luar_biasa === false ? "border-primary bg-primary/5" : "hover:bg-muted"}`}>
                    <RadioGroupItem value="tidak" id="rlb-tidak" />
                    <span className="font-medium">Belum Pernah</span>
                  </Label>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Pergantian Pengurus */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Apakah ada pergantian pengurus dalam periode ini?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.pergantian_pengurus === null ? "" : formData.pergantian_pengurus ? "ya" : "tidak"} onValueChange={(value) => handleBooleanQuestion("pergantian_pengurus", value)} className="flex gap-4">
                  <Label htmlFor="pp-ya" className={`flex items-center space-x-3 border rounded-lg px-6 py-4 cursor-pointer transition-colors ${formData.pergantian_pengurus === true ? "border-primary bg-primary/5" : "hover:bg-muted"}`}>
                    <RadioGroupItem value="ya" id="pp-ya" />
                    <span className="font-medium">Ya</span>
                  </Label>
                  <Label htmlFor="pp-tidak" className={`flex items-center space-x-3 border rounded-lg px-6 py-4 cursor-pointer transition-colors ${formData.pergantian_pengurus === false ? "border-primary bg-primary/5" : "hover:bg-muted"}`}>
                    <RadioGroupItem value="tidak" id="pp-tidak" />
                    <span className="font-medium">Tidak</span>
                  </Label>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Pergantian Pengawas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Apakah ada pergantian pengawas dalam periode ini?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.pergantian_pengawas === null ? "" : formData.pergantian_pengawas ? "ya" : "tidak"} onValueChange={(value) => handleBooleanQuestion("pergantian_pengawas", value)} className="flex gap-4">
                  <Label htmlFor="paw-ya" className={`flex items-center space-x-3 border rounded-lg px-6 py-4 cursor-pointer transition-colors ${formData.pergantian_pengawas === true ? "border-primary bg-primary/5" : "hover:bg-muted"}`}>
                    <RadioGroupItem value="ya" id="paw-ya" />
                    <span className="font-medium">Ya</span>
                  </Label>
                  <Label
                    htmlFor="paw-tidak"
                    className={`flex items-center space-x-3 border rounded-lg px-6 py-4 cursor-pointer transition-colors ${formData.pergantian_pengawas === false ? "border-primary bg-primary/5" : "hover:bg-muted"}`}
                  >
                    <RadioGroupItem value="tidak" id="paw-tidak" />
                    <span className="font-medium">Tidak</span>
                  </Label>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Rencana Strategis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Dokumen apa saja yang dimiliki koperasi?
                </CardTitle>
                <CardDescription>Pilih semua dokumen perencanaan yang sudah dimiliki koperasi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: "visi", label: "Visi Koperasi", desc: "Gambaran masa depan koperasi" },
                    { key: "misi", label: "Misi Koperasi", desc: "Langkah untuk mencapai visi" },
                    { key: "rencana_strategis", label: "Rencana Strategis", desc: "Rencana jangka panjang" },
                    { key: "sasaran_operasional", label: "Sasaran Operasional", desc: "Target kerja tahunan" },
                    { key: "art", label: "AD/ART", desc: "Anggaran Dasar dan Rumah Tangga" },
                  ].map((item) => (
                    <Label
                      key={item.key}
                      className={`flex items-start space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                        formData.rencana_strategis[item.key as keyof typeof formData.rencana_strategis] ? "border-primary bg-primary/5" : "hover:bg-muted"
                      }`}
                    >
                      <Checkbox checked={formData.rencana_strategis[item.key as keyof typeof formData.rencana_strategis]} onCheckedChange={(checked) => handleNestedChange("rencana_strategis", item.key, checked as boolean)} />
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </Label>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Bagaimana penerapan prinsip-prinsip koperasi?
                </CardTitle>
                <CardDescription>Berikan penilaian 1-4 untuk setiap prinsip koperasi (1 = Sangat Kurang, 4 = Sangat Baik)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    key: "sukarela_terbuka",
                    label: "Keanggotaan Bersifat Sukarela dan Terbuka",
                    desc: "Koperasi adalah organisasi sukarela yang terbuka bagi semua orang",
                  },
                  {
                    key: "demokratis",
                    label: "Pengendalian oleh Anggota secara Demokratis",
                    desc: "Anggota berpartisipasi aktif dalam pengambilan keputusan",
                  },
                  {
                    key: "ekonomi",
                    label: "Partisipasi Ekonomi Anggota",
                    desc: "Anggota berkontribusi secara adil dan mengendalikan modal",
                  },
                  {
                    key: "kemandirian",
                    label: "Otonomi dan Kemandirian",
                    desc: "Koperasi adalah organisasi mandiri yang dikendalikan anggota",
                  },
                  {
                    key: "pendidikan",
                    label: "Pendidikan, Pelatihan, dan Informasi",
                    desc: "Koperasi menyelenggarakan pendidikan dan pelatihan",
                  },
                  {
                    key: "kerja_sama",
                    label: "Kerja Sama Antar Koperasi",
                    desc: "Koperasi melayani anggota melalui kerja sama antar koperasi",
                  },
                  {
                    key: "kepedulian",
                    label: "Kepedulian terhadap Masyarakat",
                    desc: "Koperasi bekerja untuk pembangunan berkelanjutan",
                  },
                ].map((prinsip) => (
                  <div key={prinsip.key} className="border rounded-lg p-4 space-y-3">
                    <div>
                      <p className="font-medium">{prinsip.label}</p>
                      <p className="text-sm text-muted-foreground">{prinsip.desc}</p>
                    </div>
                    <RadioGroup
                      value={formData.prinsip_koperasi[prinsip.key as keyof typeof formData.prinsip_koperasi]?.toString() || ""}
                      onValueChange={(value) => handleNestedChange("prinsip_koperasi", prinsip.key, parseInt(value))}
                      className="flex gap-2 flex-wrap"
                    >
                      {[1, 2, 3, 4].map((value) => (
                        <Label
                          key={value}
                          className={`flex items-center justify-center w-14 h-14 border rounded-lg cursor-pointer transition-colors ${
                            formData.prinsip_koperasi[prinsip.key as keyof typeof formData.prinsip_koperasi] === value ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"
                          }`}
                        >
                          <RadioGroupItem value={value.toString()} className="sr-only" />
                          <span className="font-bold text-lg">{value}</span>
                        </Label>
                      ))}
                    </RadioGroup>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Sangat Kurang</span>
                      <span>Sangat Baik</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            {/* Pelatihan */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Pelatihan apa saja yang sudah dilaksanakan?
                </CardTitle>
                <CardDescription>Tambahkan data pelatihan yang telah diikuti oleh anggota koperasi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.pelatihan.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Pelatihan {index + 1}</span>
                      <Button type="button" variant="destructive" size="sm" onClick={() => removePelatihan(index)}>
                        Hapus
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Jenis Peserta</Label>
                        <Select value={item.pelatihan} onValueChange={(value) => updatePelatihan(index, "pelatihan", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih jenis peserta" />
                          </SelectTrigger>
                          <SelectContent>
                            {pelatihanOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Jumlah Akumulasi Peserta</Label>
                        <Input type="number" placeholder="Jumlah peserta" value={item.akumulasi ?? ""} onChange={(e) => updatePelatihan(index, "akumulasi", parseInt(e.target.value))} />
                      </div>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" className="w-full" onClick={addPelatihan}>
                  + Tambah Pelatihan
                </Button>
              </CardContent>
            </Card>

            {/* Rapat Koordinasi */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Seberapa sering dilakukan rapat koordinasi?
                </CardTitle>
                <CardDescription>Pilih frekuensi pelaksanaan rapat untuk setiap jenis rapat</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: "rapat_pengurus", label: "Rapat Pengurus" },
                  { key: "rapat_pengawas", label: "Rapat Pengawas" },
                  { key: "rapat_gabungan", label: "Rapat Gabungan (Pengurus & Pengawas)" },
                  { key: "rapat_pengurus_karyawan", label: "Rapat Pengurus dengan Karyawan" },
                  { key: "rapat_pengurus_anggota", label: "Rapat Pengurus dengan Anggota" },
                ].map((rapat) => (
                  <div key={rapat.key} className="border rounded-lg p-4 space-y-2">
                    <Label className="font-medium">{rapat.label}</Label>
                    <Select value={formData.rapat_koordinasi[rapat.key as keyof typeof formData.rapat_koordinasi]} onValueChange={(value) => handleNestedChange("rapat_koordinasi", rapat.key, value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih frekuensi rapat" />
                      </SelectTrigger>
                      <SelectContent>
                        {rapatOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Memuat data kuesioner...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/kuesioner")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h2 className="text-2xl font-bold tracking-tight">Kuesioner Organisasi</h2>
              <p className="text-muted-foreground">Pertanyaan seputar struktur organisasi dan tata kelola koperasi</p>
            </div>
            <Badge variant="secondary" className="text-sm">
              {calculateProgress()}% Selesai
            </Badge>
          </div>

          {/* Progress Bar */}
          <Progress value={calculateProgress()} className="h-2" />

          {/* Step Indicator */}
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {steps.map((step, index) => (
              <div key={step.id} className={`flex items-center ${index < steps.length - 1 ? "flex-1" : ""}`}>
                <div className={`flex items-center gap-2 cursor-pointer ${currentStep >= step.id ? "text-primary" : "text-muted-foreground"}`} onClick={() => setCurrentStep(step.id)}>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                      currentStep === step.id ? "border-primary bg-primary text-primary-foreground" : currentStep > step.id ? "border-primary bg-primary/20 text-primary" : "border-muted-foreground"
                    }`}
                  >
                    {currentStep > step.id ? <CheckCircle2 className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.id ? "bg-primary" : "bg-muted"}`} />}
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="min-h-[400px]">{renderStep()}</div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Sebelumnya
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSave} disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                Simpan Progress
              </Button>
              {currentStep === steps.length ? (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Selesai & Kirim
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Selanjutnya
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
