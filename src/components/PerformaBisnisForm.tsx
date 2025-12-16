import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Building2, Banknote, FileText, Plus, Trash2, Store } from "lucide-react";
import type { PerformaBisnis } from "@/types/performa";

interface PerformaBisnisFormProps {
  performaBisnis?: PerformaBisnis;
  onSave: (data: any) => Promise<void>;
}

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

export function PerformaBisnisForm({ performaBisnis, onSave }: PerformaBisnisFormProps) {
  const [formData, setFormData] = useState({
    proyeksi_rugi_laba: false,
    proyeksi_arus_kas: false,
    // Hubungan Lembaga (array)
    hubungan_lembaga: [] as HubunganLembagaItem[],
    // Unit Usaha (array)
    unit_usaha: [] as UnitUsahaItem[],
    // Keuangan
    keuangan: {
      pinjaman_bank: null as number | null,
      investasi: null as number | null,
      modal_kerja: null as number | null,
      simpanan_anggota: null as number | null,
      hibah: null as number | null,
      omset: null as number | null,
      operasional: null as number | null,
      surplus: null as number | null,
    },
    // Neraca Aktiva
    neraca_aktiva: {
      kas: null as number | null,
      piutang: null as number | null,
      aktiva_lancar: null as number | null,
      tanah: null as number | null,
      bangunan: null as number | null,
      kendaraan: null as number | null,
      aktiva_tetap: null as number | null,
      total_aktiva: null as number | null,
    },
    // Neraca Passiva
    neraca_passiva: {
      hutang_lancar: null as number | null,
      hutang_jangka_panjang: null as number | null,
      total_hutang: null as number | null,
      modal: null as number | null,
      total_passiva: null as number | null,
    },
    // Masalah Keuangan
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const lembagaOptions = ["Perbankan Pemerintah", "Perbankan Swasta", "keuangan Non-Bank", "BUMN", "Daerah", "Swasta", "Masyarakat"];

  const unitOptions = ["Gerai Sembako", "Klinik Desa", "Gerai Obat", "Jasa Logistik", "Gudang", "Simpan Pinjam", "Unit Lain"];

  useEffect(() => {
    if (performaBisnis) {
      console.log("Loading performaBisnis data:", performaBisnis);

      // Helper function to safely get object with fallback to default values
      const getKeuangan = () => {
        if (performaBisnis.keuangan) {
          return {
            pinjaman_bank: performaBisnis.keuangan.pinjaman_bank ?? null,
            investasi: performaBisnis.keuangan.investasi ?? null,
            modal_kerja: performaBisnis.keuangan.modal_kerja ?? null,
            simpanan_anggota: performaBisnis.keuangan.simpanan_anggota ?? null,
            hibah: performaBisnis.keuangan.hibah ?? null,
            omset: performaBisnis.keuangan.omset ?? null,
            operasional: performaBisnis.keuangan.operasional ?? null,
            surplus: performaBisnis.keuangan.surplus ?? null,
          };
        }
        return formData.keuangan;
      };

      const getNeracaAktiva = () => {
        // Check both camelCase and snake_case
        const source = (performaBisnis as any).neraca_aktiva || performaBisnis.neracaAktiva;
        if (source) {
          return {
            kas: source.kas ?? null,
            piutang: source.piutang ?? null,
            aktiva_lancar: source.aktiva_lancar ?? null,
            tanah: source.tanah ?? null,
            bangunan: source.bangunan ?? null,
            kendaraan: source.kendaraan ?? null,
            aktiva_tetap: source.aktiva_tetap ?? null,
            total_aktiva: source.total_aktiva ?? null,
          };
        }
        return formData.neraca_aktiva;
      };

      const getNeracaPassiva = () => {
        // Check both camelCase and snake_case
        const source = (performaBisnis as any).neraca_passiva || performaBisnis.neracaPassiva;
        if (source) {
          return {
            hutang_lancar: source.hutang_lancar ?? null,
            hutang_jangka_panjang: source.hutang_jangka_panjang ?? null,
            total_hutang: source.total_hutang ?? null,
            modal: source.modal ?? null,
            total_passiva: source.total_passiva ?? null,
          };
        }
        return formData.neraca_passiva;
      };

      const getMasalahKeuangan = () => {
        // Check both camelCase and snake_case
        const source = (performaBisnis as any).masalah_keuangan || performaBisnis.masalahKeuangan;
        if (source) {
          return {
            rugi_keseluruhan: source.rugi_keseluruhan ?? false,
            rugi_sebagian: source.rugi_sebagian ?? false,
            arus_kas: source.arus_kas ?? false,
            piutang: source.piutang ?? false,
            jatuh_tempo: source.jatuh_tempo ?? false,
            kredit: source.kredit ?? false,
            penggelapan: source.penggelapan ?? false,
          };
        }
        return formData.masalah_keuangan;
      };

      const newFormData = {
        proyeksi_rugi_laba: performaBisnis.proyeksi_rugi_laba || false,
        proyeksi_arus_kas: performaBisnis.proyeksi_arus_kas || false,
        hubungan_lembaga: (performaBisnis as any).hubungan_lembaga || performaBisnis.hubunganLembaga || [],
        unit_usaha: (performaBisnis as any).unit_usaha || performaBisnis.unitUsaha || [],
        keuangan: getKeuangan(),
        neraca_aktiva: getNeracaAktiva(),
        neraca_passiva: getNeracaPassiva(),
        masalah_keuangan: getMasalahKeuangan(),
      };

      console.log("Setting form data:", newFormData);
      setFormData(newFormData);
    }
  }, [performaBisnis]);

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData((prev) => {
      const currentSection = prev[section as keyof typeof prev];
      if (typeof currentSection !== "object" || currentSection === null || Array.isArray(currentSection)) {
        return prev;
      }
      return {
        ...prev,
        [section]: {
          ...currentSection,
          [field]: value === "" ? null : value,
        },
      };
    });
  };

  const handleCheckboxChange = (section: string, field: string, checked: boolean) => {
    setFormData((prev) => {
      const currentSection = prev[section as keyof typeof prev];
      if (typeof currentSection !== "object" || currentSection === null || Array.isArray(currentSection)) {
        return prev;
      }
      return {
        ...prev,
        [section]: {
          ...currentSection,
          [field]: checked,
        },
      };
    });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Proyeksi Keuangan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Proyeksi Keuangan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="proyeksi_rugi_laba" checked={formData.proyeksi_rugi_laba} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, proyeksi_rugi_laba: checked as boolean }))} />
              <Label htmlFor="proyeksi_rugi_laba" className="text-sm font-normal cursor-pointer">
                Proyeksi Rugi Laba
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="proyeksi_arus_kas" checked={formData.proyeksi_arus_kas} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, proyeksi_arus_kas: checked as boolean }))} />
              <Label htmlFor="proyeksi_arus_kas" className="text-sm font-normal cursor-pointer">
                Proyeksi Arus Kas
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Accordion type="multiple" className="space-y-4">
        {/* Hubungan Lembaga */}
        <AccordionItem value="hubungan_lembaga" className="border rounded-lg px-4 bg-card">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="font-semibold">Hubungan Lembaga</p>
                <p className="text-sm text-muted-foreground">Kemudahan, Intensitas, dan Dampak (Skala 1-4)</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="space-y-4">
              {formData.hubungan_lembaga.map((item, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 flex items-end gap-2">
                        <div className="flex-1">
                          <Label>Lembaga</Label>
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
                        <Button type="button" variant="destructive" size="icon" onClick={() => removeHubunganLembaga(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div>
                        <Label>Kemudahan (1-4)</Label>
                        <Input type="number" min="1" max="4" value={item.kemudahan ?? ""} onChange={(e) => updateHubunganLembaga(index, "kemudahan", parseInt(e.target.value))} />
                      </div>
                      <div>
                        <Label>Intensitas (1-4)</Label>
                        <Input type="number" min="1" max="4" value={item.intensitas ?? ""} onChange={(e) => updateHubunganLembaga(index, "intensitas", parseInt(e.target.value))} />
                      </div>
                      <div>
                        <Label>Dampak (1-4)</Label>
                        <Input type="number" min="1" max="4" value={item.dampak ?? ""} onChange={(e) => updateHubunganLembaga(index, "dampak", parseInt(e.target.value))} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button type="button" variant="outline" onClick={addHubunganLembaga} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Hubungan Lembaga
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Unit Usaha */}
        <AccordionItem value="unit_usaha" className="border rounded-lg px-4 bg-card">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Store className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="font-semibold">Unit Usaha</p>
                <p className="text-sm text-muted-foreground">Data unit usaha koperasi</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="space-y-4">
              {formData.unit_usaha.map((item, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 flex items-end gap-2">
                        <div className="flex-1">
                          <Label>Unit Usaha</Label>
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
                        <Button type="button" variant="destructive" size="icon" onClick={() => removeUnitUsaha(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div>
                        <Label>Volume Usaha</Label>
                        <Input type="number" value={item.volume_usaha ?? ""} onChange={(e) => updateUnitUsaha(index, "volume_usaha", parseInt(e.target.value))} />
                      </div>
                      <div>
                        <Label>Investasi</Label>
                        <Input type="number" value={item.investasi ?? ""} onChange={(e) => updateUnitUsaha(index, "investasi", parseInt(e.target.value))} />
                      </div>
                      <div>
                        <Label>Model Kerja</Label>
                        <Input type="number" value={item.model_kerja ?? ""} onChange={(e) => updateUnitUsaha(index, "model_kerja", parseInt(e.target.value))} />
                      </div>
                      <div>
                        <Label>Surplus</Label>
                        <Input type="number" value={item.surplus ?? ""} onChange={(e) => updateUnitUsaha(index, "surplus", parseInt(e.target.value))} />
                      </div>
                      <div>
                        <Label>Jumlah SDM</Label>
                        <Input type="number" value={item.jumlah_sdm ?? ""} onChange={(e) => updateUnitUsaha(index, "jumlah_sdm", parseInt(e.target.value))} />
                      </div>
                      <div>
                        <Label>Jumlah Anggota</Label>
                        <Input type="number" value={item.jumlah_anggota ?? ""} onChange={(e) => updateUnitUsaha(index, "jumlah_anggota", parseInt(e.target.value))} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button type="button" variant="outline" onClick={addUnitUsaha} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Unit Usaha
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Keuangan */}
        <AccordionItem value="keuangan" className="border rounded-lg px-4 bg-card">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Banknote className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="font-semibold">Data Keuangan</p>
                <p className="text-sm text-muted-foreground">Pinjaman, Modal, Omset, dan Surplus</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pinjaman_bank">Pinjaman Bank</Label>
                <Input id="pinjaman_bank" type="number" placeholder="0" value={formData.keuangan.pinjaman_bank ?? ""} onChange={(e) => handleInputChange("keuangan", "pinjaman_bank", parseInt(e.target.value))} />
              </div>
              <div>
                <Label htmlFor="investasi">Investasi</Label>
                <Input id="investasi" type="number" placeholder="0" value={formData.keuangan.investasi ?? ""} onChange={(e) => handleInputChange("keuangan", "investasi", parseInt(e.target.value))} />
              </div>
              <div>
                <Label htmlFor="modal_kerja">Modal Kerja</Label>
                <Input id="modal_kerja" type="number" placeholder="0" value={formData.keuangan.modal_kerja ?? ""} onChange={(e) => handleInputChange("keuangan", "modal_kerja", parseInt(e.target.value))} />
              </div>
              <div>
                <Label htmlFor="simpanan_anggota">Simpanan Anggota</Label>
                <Input id="simpanan_anggota" type="number" placeholder="0" value={formData.keuangan.simpanan_anggota ?? ""} onChange={(e) => handleInputChange("keuangan", "simpanan_anggota", parseInt(e.target.value))} />
              </div>
              <div>
                <Label htmlFor="hibah">Hibah</Label>
                <Input id="hibah" type="number" placeholder="0" value={formData.keuangan.hibah ?? ""} onChange={(e) => handleInputChange("keuangan", "hibah", parseInt(e.target.value))} />
              </div>
              <div>
                <Label htmlFor="omset">Omset</Label>
                <Input id="omset" type="number" placeholder="0" value={formData.keuangan.omset ?? ""} onChange={(e) => handleInputChange("keuangan", "omset", parseInt(e.target.value))} />
              </div>
              <div>
                <Label htmlFor="operasional">Operasional</Label>
                <Input id="operasional" type="number" placeholder="0" value={formData.keuangan.operasional ?? ""} onChange={(e) => handleInputChange("keuangan", "operasional", parseInt(e.target.value))} />
              </div>
              <div>
                <Label htmlFor="surplus">Surplus</Label>
                <Input id="surplus" type="number" placeholder="0" value={formData.keuangan.surplus ?? ""} onChange={(e) => handleInputChange("keuangan", "surplus", parseInt(e.target.value))} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Neraca Aktiva */}
        <AccordionItem value="neraca_aktiva" className="border rounded-lg px-4 bg-card">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="font-semibold">Neraca Aktiva</p>
                <p className="text-sm text-muted-foreground">Kas, Piutang, Aktiva Lancar & Tetap</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="kas">Kas</Label>
                <Input id="kas" type="number" placeholder="0" value={formData.neraca_aktiva.kas ?? ""} onChange={(e) => handleInputChange("neraca_aktiva", "kas", parseInt(e.target.value))} />
              </div>
              <div>
                <Label htmlFor="piutang">Piutang</Label>
                <Input id="piutang" type="number" placeholder="0" value={formData.neraca_aktiva.piutang ?? ""} onChange={(e) => handleInputChange("neraca_aktiva", "piutang", parseInt(e.target.value))} />
              </div>
              <div>
                <Label htmlFor="aktiva_lancar">Aktiva Lancar</Label>
                <Input id="aktiva_lancar" type="number" placeholder="0" value={formData.neraca_aktiva.aktiva_lancar ?? ""} onChange={(e) => handleInputChange("neraca_aktiva", "aktiva_lancar", parseInt(e.target.value))} />
              </div>
              <div>
                <Label htmlFor="tanah">Tanah</Label>
                <Input id="tanah" type="number" placeholder="0" value={formData.neraca_aktiva.tanah ?? ""} onChange={(e) => handleInputChange("neraca_aktiva", "tanah", parseInt(e.target.value))} />
              </div>
              <div>
                <Label htmlFor="bangunan">Bangunan</Label>
                <Input id="bangunan" type="number" placeholder="0" value={formData.neraca_aktiva.bangunan ?? ""} onChange={(e) => handleInputChange("neraca_aktiva", "bangunan", parseInt(e.target.value))} />
              </div>
              <div>
                <Label htmlFor="kendaraan">Kendaraan</Label>
                <Input id="kendaraan" type="number" placeholder="0" value={formData.neraca_aktiva.kendaraan ?? ""} onChange={(e) => handleInputChange("neraca_aktiva", "kendaraan", parseInt(e.target.value))} />
              </div>
              <div>
                <Label htmlFor="aktiva_tetap">Aktiva Tetap</Label>
                <Input id="aktiva_tetap" type="number" placeholder="0" value={formData.neraca_aktiva.aktiva_tetap ?? ""} onChange={(e) => handleInputChange("neraca_aktiva", "aktiva_tetap", parseInt(e.target.value))} />
              </div>
              <div>
                <Label htmlFor="total_aktiva">Total Aktiva</Label>
                <Input id="total_aktiva" type="number" placeholder="0" value={formData.neraca_aktiva.total_aktiva ?? ""} onChange={(e) => handleInputChange("neraca_aktiva", "total_aktiva", parseInt(e.target.value))} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Neraca Passiva */}
        <AccordionItem value="neraca_passiva" className="border rounded-lg px-4 bg-card">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="font-semibold">Neraca Passiva</p>
                <p className="text-sm text-muted-foreground">Hutang & Modal</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hutang_lancar">Hutang Lancar</Label>
                <Input id="hutang_lancar" type="number" placeholder="0" value={formData.neraca_passiva.hutang_lancar ?? ""} onChange={(e) => handleInputChange("neraca_passiva", "hutang_lancar", parseInt(e.target.value))} />
              </div>
              <div>
                <Label htmlFor="hutang_jangka_panjang">Hutang Jangka Panjang</Label>
                <Input
                  id="hutang_jangka_panjang"
                  type="number"
                  placeholder="0"
                  value={formData.neraca_passiva.hutang_jangka_panjang ?? ""}
                  onChange={(e) => handleInputChange("neraca_passiva", "hutang_jangka_panjang", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="total_hutang">Total Hutang</Label>
                <Input id="total_hutang" type="number" placeholder="0" value={formData.neraca_passiva.total_hutang ?? ""} onChange={(e) => handleInputChange("neraca_passiva", "total_hutang", parseInt(e.target.value))} />
              </div>
              <div>
                <Label htmlFor="modal">Modal</Label>
                <Input id="modal" type="number" placeholder="0" value={formData.neraca_passiva.modal ?? ""} onChange={(e) => handleInputChange("neraca_passiva", "modal", parseInt(e.target.value))} />
              </div>
              <div>
                <Label htmlFor="total_passiva">Total Passiva</Label>
                <Input id="total_passiva" type="number" placeholder="0" value={formData.neraca_passiva.total_passiva ?? ""} onChange={(e) => handleInputChange("neraca_passiva", "total_passiva", parseInt(e.target.value))} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Masalah Keuangan */}
        <AccordionItem value="masalah_keuangan" className="border rounded-lg px-4 bg-card">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Banknote className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="font-semibold">Masalah Keuangan</p>
                <p className="text-sm text-muted-foreground">Identifikasi masalah keuangan yang dihadapi</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="rugi_keseluruhan" checked={formData.masalah_keuangan.rugi_keseluruhan} onCheckedChange={(checked) => handleCheckboxChange("masalah_keuangan", "rugi_keseluruhan", checked as boolean)} />
                <Label htmlFor="rugi_keseluruhan" className="text-sm font-normal cursor-pointer">
                  Rugi Keseluruhan
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="rugi_sebagian" checked={formData.masalah_keuangan.rugi_sebagian} onCheckedChange={(checked) => handleCheckboxChange("masalah_keuangan", "rugi_sebagian", checked as boolean)} />
                <Label htmlFor="rugi_sebagian" className="text-sm font-normal cursor-pointer">
                  Rugi Sebagian
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="arus_kas" checked={formData.masalah_keuangan.arus_kas} onCheckedChange={(checked) => handleCheckboxChange("masalah_keuangan", "arus_kas", checked as boolean)} />
                <Label htmlFor="arus_kas" className="text-sm font-normal cursor-pointer">
                  Masalah Arus Kas
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="piutang" checked={formData.masalah_keuangan.piutang} onCheckedChange={(checked) => handleCheckboxChange("masalah_keuangan", "piutang", checked as boolean)} />
                <Label htmlFor="piutang" className="text-sm font-normal cursor-pointer">
                  Masalah Piutang
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="jatuh_tempo" checked={formData.masalah_keuangan.jatuh_tempo} onCheckedChange={(checked) => handleCheckboxChange("masalah_keuangan", "jatuh_tempo", checked as boolean)} />
                <Label htmlFor="jatuh_tempo" className="text-sm font-normal cursor-pointer">
                  Jatuh Tempo
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="kredit" checked={formData.masalah_keuangan.kredit} onCheckedChange={(checked) => handleCheckboxChange("masalah_keuangan", "kredit", checked as boolean)} />
                <Label htmlFor="kredit" className="text-sm font-normal cursor-pointer">
                  Masalah Kredit
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="penggelapan" checked={formData.masalah_keuangan.penggelapan} onCheckedChange={(checked) => handleCheckboxChange("masalah_keuangan", "penggelapan", checked as boolean)} />
                <Label htmlFor="penggelapan" className="text-sm font-normal cursor-pointer">
                  Penggelapan
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Simpan Performa Bisnis"}
        </Button>
      </div>
    </form>
  );
}
