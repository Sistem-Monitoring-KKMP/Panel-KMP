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
import { ArrowLeft, ArrowRight, Building2, Store, Banknote, TrendingUp, AlertTriangle, Plus, Save, CheckCircle2, HelpCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { loadKuesionerBisnis, saveKuesionerBisnis } from "@/lib/kuesioner-api";
import type { KuesionerBisnisFormData } from "@/types/kuesioner";

interface HubunganLembagaItem {
  lembaga: string;
  kemudahan: number | null;
  intensitas: number | null;
  dampak: number | null;
}

interface UnitUsahaItem {
  unit: string;
  volume_usaha: number | null;
  investasi: number | null;
  model_kerja: number | null;
  surplus: number | null;
  jumlah_sdm: number | null;
  jumlah_anggota: number | null;
}

interface FormData {
  // Proyeksi Keuangan
  proyeksi_rugi_laba: boolean | null;
  proyeksi_arus_kas: boolean | null;

  // Hubungan Lembaga
  hubungan_lembaga: HubunganLembagaItem[];

  // Unit Usaha
  unit_usaha: UnitUsahaItem[];

  // Keuangan
  keuangan: {
    pinjaman_bank: number | null;
    investasi: number | null;
    modal_kerja: number | null;
    simpanan_anggota: number | null;
    hibah: number | null;
    omset: number | null;
    operasional: number | null;
    surplus: number | null;
  };

  // Neraca Aktiva
  neraca_aktiva: {
    kas: number | null;
    piutang: number | null;
    aktiva_lancar: number | null;
    tanah: number | null;
    bangunan: number | null;
    kendaraan: number | null;
    aktiva_tetap: number | null;
    total_aktiva: number | null;
  };

  // Neraca Passiva
  neraca_passiva: {
    hutang_lancar: number | null;
    hutang_jangka_panjang: number | null;
    total_hutang: number | null;
    modal: number | null;
    total_passiva: number | null;
  };

  // Masalah Keuangan
  masalah_keuangan: {
    rugi_keseluruhan: boolean;
    rugi_sebagian: boolean;
    arus_kas: boolean;
    piutang: boolean;
    jatuh_tempo: boolean;
    kredit: boolean;
    penggelapan: boolean;
  };
}

const steps = [
  { id: 1, title: "Proyeksi & Mitra", icon: Building2, description: "Proyeksi dan hubungan lembaga" },
  { id: 2, title: "Unit Usaha", icon: Store, description: "Data unit usaha" },
  { id: 3, title: "Keuangan", icon: Banknote, description: "Sumber dan penggunaan dana" },
  { id: 4, title: "Neraca", icon: TrendingUp, description: "Aktiva dan passiva" },
  { id: 5, title: "Masalah Keuangan", icon: AlertTriangle, description: "Kendala keuangan" },
];

export function KuesionerBisnis() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    proyeksi_rugi_laba: null,
    proyeksi_arus_kas: null,
    hubungan_lembaga: [],
    unit_usaha: [],
    keuangan: {
      pinjaman_bank: null,
      investasi: null,
      modal_kerja: null,
      simpanan_anggota: null,
      hibah: null,
      omset: null,
      operasional: null,
      surplus: null,
    },
    neraca_aktiva: {
      kas: null,
      piutang: null,
      aktiva_lancar: null,
      tanah: null,
      bangunan: null,
      kendaraan: null,
      aktiva_tetap: null,
      total_aktiva: null,
    },
    neraca_passiva: {
      hutang_lancar: null,
      hutang_jangka_panjang: null,
      total_hutang: null,
      modal: null,
      total_passiva: null,
    },
    masalah_keuangan: {
      rugi_keseluruhan: false,
      rugi_sebagian: false,
      arus_kas: false,
      piutang: false,
      jatuh_tempo: false,
      kredit: false,
      penggelapan: false,
    },
  });

  // Load data from API on mount
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await loadKuesionerBisnis();
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

  const lembagaOptions = ["Perbankan Pemerintah", "Perbankan Swasta", "Keuangan Non-Bank", "BUMN", "Pemerintah Daerah", "Swasta", "Masyarakat"];

  const unitOptions = ["Gerai Sembako", "Klinik Desa", "Gerai Obat", "Jasa Logistik", "Gudang", "Simpan Pinjam", "Unit Lain"];

  const handleBooleanQuestion = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value === "ya",
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

  const handleMasalahChange = (field: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      masalah_keuangan: {
        ...prev.masalah_keuangan,
        [field]: checked,
      },
    }));
  };

  // Hubungan Lembaga handlers
  const addHubunganLembaga = () => {
    setFormData((prev) => ({
      ...prev,
      hubungan_lembaga: [...prev.hubungan_lembaga, { lembaga: lembagaOptions[0], kemudahan: null, intensitas: null, dampak: null }],
    }));
  };

  const removeHubunganLembaga = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      hubungan_lembaga: prev.hubungan_lembaga.filter((_, i) => i !== index),
    }));
  };

  const updateHubunganLembaga = (index: number, field: keyof HubunganLembagaItem, value: any) => {
    setFormData((prev) => ({
      ...prev,
      hubungan_lembaga: prev.hubungan_lembaga.map((item, i) => (i === index ? { ...item, [field]: value === "" ? null : value } : item)),
    }));
  };

  // Unit Usaha handlers
  const addUnitUsaha = () => {
    setFormData((prev) => ({
      ...prev,
      unit_usaha: [
        ...prev.unit_usaha,
        {
          unit: unitOptions[0],
          volume_usaha: null,
          investasi: null,
          model_kerja: null,
          surplus: null,
          jumlah_sdm: null,
          jumlah_anggota: null,
        },
      ],
    }));
  };

  const removeUnitUsaha = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      unit_usaha: prev.unit_usaha.filter((_, i) => i !== index),
    }));
  };

  const updateUnitUsaha = (index: number, field: keyof UnitUsahaItem, value: any) => {
    setFormData((prev) => ({
      ...prev,
      unit_usaha: prev.unit_usaha.map((item, i) => (i === index ? { ...item, [field]: value === "" ? null : value } : item)),
    }));
  };

  const calculateProgress = () => {
    let filled = 0;
    let total = 25;

    if (formData.proyeksi_rugi_laba !== null) filled++;
    if (formData.proyeksi_arus_kas !== null) filled++;
    if (formData.hubungan_lembaga.length > 0) filled += 2;
    if (formData.unit_usaha.length > 0) filled += 2;

    Object.values(formData.keuangan).forEach((v) => {
      if (v !== null) filled++;
    });
    Object.values(formData.neraca_aktiva).forEach((v) => {
      if (v !== null) filled++;
    });
    Object.values(formData.neraca_passiva).forEach((v) => {
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
      await saveKuesionerBisnis(formData as KuesionerBisnisFormData);
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
      await saveKuesionerBisnis(formData as KuesionerBisnisFormData);
      toast.success("Kuesioner bisnis berhasil disimpan!");
      navigate("/kuesioner");
    } catch (error: any) {
      console.error("Error submitting:", error);
      toast.error(error?.message || "Gagal mengirim kuesioner");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Proyeksi Keuangan */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Apakah koperasi memiliki dokumen proyeksi keuangan?
                </CardTitle>
                <CardDescription>Proyeksi keuangan membantu perencanaan dan pengambilan keputusan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Proyeksi Rugi Laba */}
                <div className="border rounded-lg p-4 space-y-3">
                  <Label className="font-medium">Proyeksi Rugi Laba</Label>
                  <p className="text-sm text-muted-foreground">Dokumen estimasi pendapatan dan pengeluaran tahunan</p>
                  <RadioGroup value={formData.proyeksi_rugi_laba === null ? "" : formData.proyeksi_rugi_laba ? "ya" : "tidak"} onValueChange={(value) => handleBooleanQuestion("proyeksi_rugi_laba", value)} className="flex gap-4">
                    <Label className={`flex items-center space-x-3 border rounded-lg px-6 py-3 cursor-pointer transition-colors ${formData.proyeksi_rugi_laba === true ? "border-primary bg-primary/5" : "hover:bg-muted"}`}>
                      <RadioGroupItem value="ya" />
                      <span>Ya, Memiliki</span>
                    </Label>
                    <Label className={`flex items-center space-x-3 border rounded-lg px-6 py-3 cursor-pointer transition-colors ${formData.proyeksi_rugi_laba === false ? "border-primary bg-primary/5" : "hover:bg-muted"}`}>
                      <RadioGroupItem value="tidak" />
                      <span>Tidak Memiliki</span>
                    </Label>
                  </RadioGroup>
                </div>

                {/* Proyeksi Arus Kas */}
                <div className="border rounded-lg p-4 space-y-3">
                  <Label className="font-medium">Proyeksi Arus Kas</Label>
                  <p className="text-sm text-muted-foreground">Dokumen estimasi aliran kas masuk dan keluar</p>
                  <RadioGroup value={formData.proyeksi_arus_kas === null ? "" : formData.proyeksi_arus_kas ? "ya" : "tidak"} onValueChange={(value) => handleBooleanQuestion("proyeksi_arus_kas", value)} className="flex gap-4">
                    <Label className={`flex items-center space-x-3 border rounded-lg px-6 py-3 cursor-pointer transition-colors ${formData.proyeksi_arus_kas === true ? "border-primary bg-primary/5" : "hover:bg-muted"}`}>
                      <RadioGroupItem value="ya" />
                      <span>Ya, Memiliki</span>
                    </Label>
                    <Label className={`flex items-center space-x-3 border rounded-lg px-6 py-3 cursor-pointer transition-colors ${formData.proyeksi_arus_kas === false ? "border-primary bg-primary/5" : "hover:bg-muted"}`}>
                      <RadioGroupItem value="tidak" />
                      <span>Tidak Memiliki</span>
                    </Label>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Hubungan Lembaga */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Bagaimana hubungan koperasi dengan lembaga mitra?
                </CardTitle>
                <CardDescription>Berikan penilaian kemudahan, intensitas, dan dampak hubungan (Skala 1-4)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.hubungan_lembaga.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Lembaga Mitra {index + 1}</span>
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeHubunganLembaga(index)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Hapus
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 space-y-2">
                        <Label>Jenis Lembaga</Label>
                        <Select value={item.lembaga} onValueChange={(value) => updateHubunganLembaga(index, "lembaga", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {lembagaOptions.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Kemudahan Akses (1-4)</Label>
                        <RadioGroup value={item.kemudahan?.toString() || ""} onValueChange={(v) => updateHubunganLembaga(index, "kemudahan", parseInt(v))} className="flex gap-2">
                          {[1, 2, 3, 4].map((val) => (
                            <Label
                              key={val}
                              className={`flex items-center justify-center w-12 h-12 border rounded-lg cursor-pointer transition-colors ${item.kemudahan === val ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                            >
                              <RadioGroupItem value={val.toString()} className="sr-only" />
                              <span className="font-bold">{val}</span>
                            </Label>
                          ))}
                        </RadioGroup>
                      </div>
                      <div className="space-y-2">
                        <Label>Intensitas Hubungan (1-4)</Label>
                        <RadioGroup value={item.intensitas?.toString() || ""} onValueChange={(v) => updateHubunganLembaga(index, "intensitas", parseInt(v))} className="flex gap-2">
                          {[1, 2, 3, 4].map((val) => (
                            <Label
                              key={val}
                              className={`flex items-center justify-center w-12 h-12 border rounded-lg cursor-pointer transition-colors ${item.intensitas === val ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                            >
                              <RadioGroupItem value={val.toString()} className="sr-only" />
                              <span className="font-bold">{val}</span>
                            </Label>
                          ))}
                        </RadioGroup>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label>Dampak terhadap Koperasi (1-4)</Label>
                        <RadioGroup value={item.dampak?.toString() || ""} onValueChange={(v) => updateHubunganLembaga(index, "dampak", parseInt(v))} className="flex gap-2">
                          {[1, 2, 3, 4].map((val) => (
                            <Label
                              key={val}
                              className={`flex items-center justify-center w-12 h-12 border rounded-lg cursor-pointer transition-colors ${item.dampak === val ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                            >
                              <RadioGroupItem value={val.toString()} className="sr-only" />
                              <span className="font-bold">{val}</span>
                            </Label>
                          ))}
                        </RadioGroup>
                        <div className="flex justify-between text-xs text-muted-foreground pt-1">
                          <span>Sangat Rendah</span>
                          <span>Sangat Tinggi</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" className="w-full" onClick={addHubunganLembaga}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Lembaga Mitra
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Unit usaha apa saja yang dimiliki koperasi?
                </CardTitle>
                <CardDescription>Tambahkan informasi tentang setiap unit usaha yang dikelola koperasi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.unit_usaha.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Unit Usaha {index + 1}</span>
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeUnitUsaha(index)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Hapus
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 space-y-2">
                        <Label>Jenis Unit Usaha</Label>
                        <Select value={item.unit} onValueChange={(value) => updateUnitUsaha(index, "unit", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {unitOptions.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Volume Usaha (Rp)</Label>
                        <Input type="number" placeholder="0" value={item.volume_usaha ?? ""} onChange={(e) => updateUnitUsaha(index, "volume_usaha", parseInt(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Investasi (Rp)</Label>
                        <Input type="number" placeholder="0" value={item.investasi ?? ""} onChange={(e) => updateUnitUsaha(index, "investasi", parseInt(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Model Kerja (1-4)</Label>
                        <RadioGroup value={item.model_kerja?.toString() || ""} onValueChange={(v) => updateUnitUsaha(index, "model_kerja", parseInt(v))} className="flex gap-2">
                          {[1, 2, 3, 4].map((val) => (
                            <Label
                              key={val}
                              className={`flex items-center justify-center w-12 h-12 border rounded-lg cursor-pointer transition-colors ${item.model_kerja === val ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                            >
                              <RadioGroupItem value={val.toString()} className="sr-only" />
                              <span className="font-bold">{val}</span>
                            </Label>
                          ))}
                        </RadioGroup>
                      </div>
                      <div className="space-y-2">
                        <Label>Surplus (Rp)</Label>
                        <Input type="number" placeholder="0" value={item.surplus ?? ""} onChange={(e) => updateUnitUsaha(index, "surplus", parseInt(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Jumlah SDM</Label>
                        <Input type="number" placeholder="0" value={item.jumlah_sdm ?? ""} onChange={(e) => updateUnitUsaha(index, "jumlah_sdm", parseInt(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Jumlah Anggota Terlayani</Label>
                        <Input type="number" placeholder="0" value={item.jumlah_anggota ?? ""} onChange={(e) => updateUnitUsaha(index, "jumlah_anggota", parseInt(e.target.value))} />
                      </div>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" className="w-full" onClick={addUnitUsaha}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Unit Usaha
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Bagaimana kondisi keuangan koperasi?
                </CardTitle>
                <CardDescription>Isi data sumber dan penggunaan dana koperasi (dalam Rupiah)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4 text-primary">Sumber Dana</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Pinjaman Bank</Label>
                        <Input type="number" placeholder="0" value={formData.keuangan.pinjaman_bank ?? ""} onChange={(e) => handleNestedChange("keuangan", "pinjaman_bank", parseInt(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Investasi</Label>
                        <Input type="number" placeholder="0" value={formData.keuangan.investasi ?? ""} onChange={(e) => handleNestedChange("keuangan", "investasi", parseInt(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Modal Kerja</Label>
                        <Input type="number" placeholder="0" value={formData.keuangan.modal_kerja ?? ""} onChange={(e) => handleNestedChange("keuangan", "modal_kerja", parseInt(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Simpanan Anggota</Label>
                        <Input type="number" placeholder="0" value={formData.keuangan.simpanan_anggota ?? ""} onChange={(e) => handleNestedChange("keuangan", "simpanan_anggota", parseInt(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Hibah</Label>
                        <Input type="number" placeholder="0" value={formData.keuangan.hibah ?? ""} onChange={(e) => handleNestedChange("keuangan", "hibah", parseInt(e.target.value))} />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-4 text-primary">Penggunaan Dana</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Omset</Label>
                        <Input type="number" placeholder="0" value={formData.keuangan.omset ?? ""} onChange={(e) => handleNestedChange("keuangan", "omset", parseInt(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Biaya Operasional</Label>
                        <Input type="number" placeholder="0" value={formData.keuangan.operasional ?? ""} onChange={(e) => handleNestedChange("keuangan", "operasional", parseInt(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Surplus / SHU</Label>
                        <Input type="number" placeholder="0" value={formData.keuangan.surplus ?? ""} onChange={(e) => handleNestedChange("keuangan", "surplus", parseInt(e.target.value))} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Neraca Aktiva */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Neraca Aktiva (Harta) Koperasi
                </CardTitle>
                <CardDescription>Isi data aktiva/harta yang dimiliki koperasi (dalam Rupiah)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4 text-primary">Aktiva Lancar</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Kas</Label>
                        <Input type="number" placeholder="0" value={formData.neraca_aktiva.kas ?? ""} onChange={(e) => handleNestedChange("neraca_aktiva", "kas", parseInt(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Piutang</Label>
                        <Input type="number" placeholder="0" value={formData.neraca_aktiva.piutang ?? ""} onChange={(e) => handleNestedChange("neraca_aktiva", "piutang", parseInt(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Aktiva Lancar Lainnya</Label>
                        <Input type="number" placeholder="0" value={formData.neraca_aktiva.aktiva_lancar ?? ""} onChange={(e) => handleNestedChange("neraca_aktiva", "aktiva_lancar", parseInt(e.target.value))} />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-4 text-primary">Aktiva Tetap</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tanah</Label>
                        <Input type="number" placeholder="0" value={formData.neraca_aktiva.tanah ?? ""} onChange={(e) => handleNestedChange("neraca_aktiva", "tanah", parseInt(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Bangunan</Label>
                        <Input type="number" placeholder="0" value={formData.neraca_aktiva.bangunan ?? ""} onChange={(e) => handleNestedChange("neraca_aktiva", "bangunan", parseInt(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Kendaraan</Label>
                        <Input type="number" placeholder="0" value={formData.neraca_aktiva.kendaraan ?? ""} onChange={(e) => handleNestedChange("neraca_aktiva", "kendaraan", parseInt(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Aktiva Tetap Lainnya</Label>
                        <Input type="number" placeholder="0" value={formData.neraca_aktiva.aktiva_tetap ?? ""} onChange={(e) => handleNestedChange("neraca_aktiva", "aktiva_tetap", parseInt(e.target.value))} />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <div className="space-y-2">
                      <Label className="text-lg font-semibold">Total Aktiva</Label>
                      <Input type="number" placeholder="0" value={formData.neraca_aktiva.total_aktiva ?? ""} onChange={(e) => handleNestedChange("neraca_aktiva", "total_aktiva", parseInt(e.target.value))} className="text-lg font-medium" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Neraca Passiva */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Neraca Passiva (Kewajiban & Modal) Koperasi
                </CardTitle>
                <CardDescription>Isi data kewajiban dan modal koperasi (dalam Rupiah)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4 text-primary">Kewajiban</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Hutang Lancar</Label>
                        <Input type="number" placeholder="0" value={formData.neraca_passiva.hutang_lancar ?? ""} onChange={(e) => handleNestedChange("neraca_passiva", "hutang_lancar", parseInt(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Hutang Jangka Panjang</Label>
                        <Input type="number" placeholder="0" value={formData.neraca_passiva.hutang_jangka_panjang ?? ""} onChange={(e) => handleNestedChange("neraca_passiva", "hutang_jangka_panjang", parseInt(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Total Hutang</Label>
                        <Input type="number" placeholder="0" value={formData.neraca_passiva.total_hutang ?? ""} onChange={(e) => handleNestedChange("neraca_passiva", "total_hutang", parseInt(e.target.value))} />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Modal</Label>
                        <Input type="number" placeholder="0" value={formData.neraca_passiva.modal ?? ""} onChange={(e) => handleNestedChange("neraca_passiva", "modal", parseInt(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-lg font-semibold">Total Passiva</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={formData.neraca_passiva.total_passiva ?? ""}
                          onChange={(e) => handleNestedChange("neraca_passiva", "total_passiva", parseInt(e.target.value))}
                          className="text-lg font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Apakah koperasi mengalami masalah keuangan?
                </CardTitle>
                <CardDescription>Pilih semua masalah keuangan yang pernah atau sedang dialami koperasi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      key: "rugi_keseluruhan",
                      label: "Rugi Keseluruhan",
                      desc: "Koperasi mengalami kerugian total",
                      icon: "🔴",
                    },
                    {
                      key: "rugi_sebagian",
                      label: "Rugi Sebagian Unit Usaha",
                      desc: "Beberapa unit usaha merugi",
                      icon: "🟡",
                    },
                    {
                      key: "arus_kas",
                      label: "Masalah Arus Kas",
                      desc: "Kesulitan likuiditas/cash flow",
                      icon: "💰",
                    },
                    {
                      key: "piutang",
                      label: "Piutang Macet",
                      desc: "Banyak piutang yang sulit ditagih",
                      icon: "📋",
                    },
                    {
                      key: "jatuh_tempo",
                      label: "Hutang Jatuh Tempo",
                      desc: "Kesulitan membayar hutang",
                      icon: "⏰",
                    },
                    {
                      key: "kredit",
                      label: "Kredit Bermasalah",
                      desc: "Masalah dengan pinjaman bank",
                      icon: "🏦",
                    },
                    {
                      key: "penggelapan",
                      label: "Penggelapan Dana",
                      desc: "Pernah terjadi penyalahgunaan dana",
                      icon: "⚠️",
                    },
                  ].map((item) => (
                    <Label
                      key={item.key}
                      className={`flex items-start space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                        formData.masalah_keuangan[item.key as keyof typeof formData.masalah_keuangan] ? "border-red-300 bg-red-50" : "hover:bg-muted"
                      }`}
                    >
                      <Checkbox checked={formData.masalah_keuangan[item.key as keyof typeof formData.masalah_keuangan]} onCheckedChange={(checked) => handleMasalahChange(item.key, checked as boolean)} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span>{item.icon}</span>
                          <p className="font-medium">{item.label}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                      </div>
                    </Label>
                  ))}
                </div>

                {/* Info jika tidak ada masalah */}
                {!Object.values(formData.masalah_keuangan).some((v) => v) && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 text-sm flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Koperasi tidak mengalami masalah keuangan yang signifikan
                    </p>
                  </div>
                )}
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
              <h2 className="text-2xl font-bold tracking-tight">Kuesioner Bisnis & Keuangan</h2>
              <p className="text-muted-foreground">Pertanyaan seputar performa bisnis dan kondisi keuangan koperasi</p>
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
