import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Users2, GraduationCap, FileCheck, Plus, Trash2 } from "lucide-react";
import type { PerformaOrganisasi } from "@/types/performa";

interface PerformaOrganisasiFormProps {
  performaOrganisasi?: PerformaOrganisasi;
  onSave: (data: any) => Promise<void>;
}

interface PelatihanItem {
  pelatihan: string;
  akumulasi: number | null;
}

export function PerformaOrganisasiForm({ performaOrganisasi, onSave }: PerformaOrganisasiFormProps) {
  const [formData, setFormData] = useState({
    jumlah_pengurus: null as number | null,
    jumlah_pengawas: null as number | null,
    jumlah_karyawan: null as number | null,
    status: "" as "Aktif" | "TidakAktif" | "Pembentukan" | "",
    total_anggota: null as number | null,
    anggota_aktif: null as number | null,
    anggota_tidak_aktif: null as number | null,
    general_manager: false,
    rapat_tepat_waktu: false,
    rapat_luar_biasa: false,
    pergantian_pengurus: false,
    pergantian_pengawas: false,
    rencana_strategis: {
      visi: false,
      misi: false,
      rencana_strategis: false,
      sasaran_operasional: false,
      art: false,
    },
    prinsip_koperasi: {
      sukarela_terbuka: null as number | null,
      demokratis: null as number | null,
      ekonomi: null as number | null,
      kemandirian: null as number | null,
      pendidikan: null as number | null,
      kerja_sama: null as number | null,
      kepedulian: null as number | null,
    },
    pelatihan: [] as PelatihanItem[],
    rapat_koordinasi: {
      rapat_pengurus: "" as string,
      rapat_pengawas: "" as string,
      rapat_gabungan: "" as string,
      rapat_pengurus_karyawan: "" as string,
      rapat_pengurus_anggota: "" as string,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const pelatihanOptions = ["Pengurus", "Pengawas", "GeneralManager", "Karyawan", "Anggota", "NonAnggota"];

  useEffect(() => {
    if (performaOrganisasi) {
      console.log("Loading performaOrganisasi data:", performaOrganisasi);

      const getRencanaStrategis = () => {
        const source = (performaOrganisasi as any).rencana_strategis || performaOrganisasi.rencanaStrategis;
        if (source) {
          return {
            visi: source.visi ?? false,
            misi: source.misi ?? false,
            rencana_strategis: source.rencana_strategis ?? false,
            sasaran_operasional: source.sasaran_operasional ?? false,
            art: source.art ?? false,
          };
        }
        return formData.rencana_strategis;
      };

      const getPrinsipKoperasi = () => {
        const source = (performaOrganisasi as any).prinsip_koperasi || performaOrganisasi.prinsipKoperasi;
        if (source) {
          return {
            sukarela_terbuka: source.sukarela_terbuka ?? null,
            demokratis: source.demokratis ?? null,
            ekonomi: source.ekonomi ?? null,
            kemandirian: source.kemandirian ?? null,
            pendidikan: source.pendidikan ?? null,
            kerja_sama: source.kerja_sama ?? null,
            kepedulian: source.kepedulian ?? null,
          };
        }
        return formData.prinsip_koperasi;
      };

      const getRapatKoordinasi = () => {
        const source = (performaOrganisasi as any).rapat_koordinasi || performaOrganisasi.rapatKoordinasi;
        if (source) {
          return {
            rapat_pengurus: source.rapat_pengurus ?? "",
            rapat_pengawas: source.rapat_pengawas ?? "",
            rapat_gabungan: source.rapat_gabungan ?? "",
            rapat_pengurus_karyawan: source.rapat_pengurus_karyawan ?? "",
            rapat_pengurus_anggota: source.rapat_pengurus_anggota ?? "",
          };
        }
        return formData.rapat_koordinasi;
      };

      const newFormData = {
        jumlah_pengurus: performaOrganisasi.jumlah_pengurus,
        jumlah_pengawas: performaOrganisasi.jumlah_pengawas,
        jumlah_karyawan: performaOrganisasi.jumlah_karyawan,
        status: performaOrganisasi.status || "",
        total_anggota: performaOrganisasi.total_anggota,
        anggota_aktif: performaOrganisasi.anggota_aktif,
        anggota_tidak_aktif: performaOrganisasi.anggota_tidak_aktif,
        general_manager: performaOrganisasi.general_manager || false,
        rapat_tepat_waktu: performaOrganisasi.rapat_tepat_waktu || false,
        rapat_luar_biasa: performaOrganisasi.rapat_luar_biasa || false,
        pergantian_pengurus: performaOrganisasi.pergantian_pengurus || false,
        pergantian_pengawas: performaOrganisasi.pergantian_pengawas || false,
        rencana_strategis: getRencanaStrategis(),
        prinsip_koperasi: getPrinsipKoperasi(),
        pelatihan: performaOrganisasi.pelatihan || [],
        rapat_koordinasi: getRapatKoordinasi(),
      };

      console.log("Setting form data:", newFormData);
      setFormData(newFormData);
    }
  }, [performaOrganisasi]);

  const handleInputChange = (section: string | null, field: string, value: any) => {
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [field]: value === "" ? null : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value === "" ? null : value,
      }));
    }
  };

  const handleCheckboxChange = (section: string | null, field: string, checked: boolean) => {
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [field]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: checked,
      }));
    }
  };

  const addPelatihan = () => {
    setFormData((prev) => ({
      ...prev,
      pelatihan: [...prev.pelatihan, { pelatihan: pelatihanOptions[0], akumulasi: null }],
    }));
  };

  const removePelatihan = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      pelatihan: prev.pelatihan.filter((_, i) => i !== index),
    }));
  };

  const updatePelatihan = (index: number, field: keyof PelatihanItem, value: any) => {
    setFormData((prev) => ({
      ...prev,
      pelatihan: prev.pelatihan.map((item, i) => (i === index ? { ...item, [field]: value === "" ? null : value } : item)),
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

  const rapatOptions = [
    { value: "satu_minggu", label: "1 Minggu" },
    { value: "dua_minggu", label: "2 Minggu" },
    { value: "satu_bulan", label: "1 Bulan" },
    { value: "dua_bulan", label: "2 Bulan" },
    { value: "tiga_bulan_lebih", label: "3 Bulan Lebih" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users2 className="h-5 w-5" />
            Data Organisasi
          </CardTitle>
          <CardDescription>Informasi struktur dan anggota organisasi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="jumlah_pengurus">Jumlah Pengurus</Label>
              <Input id="jumlah_pengurus" type="number" placeholder="0" value={formData.jumlah_pengurus ?? ""} onChange={(e) => handleInputChange(null, "jumlah_pengurus", parseInt(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="jumlah_pengawas">Jumlah Pengawas</Label>
              <Input id="jumlah_pengawas" type="number" placeholder="0" value={formData.jumlah_pengawas ?? ""} onChange={(e) => handleInputChange(null, "jumlah_pengawas", parseInt(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="jumlah_karyawan">Jumlah Karyawan</Label>
              <Input id="jumlah_karyawan" type="number" placeholder="0" value={formData.jumlah_karyawan ?? ""} onChange={(e) => handleInputChange(null, "jumlah_karyawan", parseInt(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="status">Status Koperasi</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange(null, "status", value)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="TidakAktif">Tidak Aktif</SelectItem>
                  <SelectItem value="Pembentukan">Pembentukan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="total_anggota">Total Anggota</Label>
              <Input id="total_anggota" type="number" placeholder="0" value={formData.total_anggota ?? ""} onChange={(e) => handleInputChange(null, "total_anggota", parseInt(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="anggota_aktif">Anggota Aktif</Label>
              <Input id="anggota_aktif" type="number" placeholder="0" value={formData.anggota_aktif ?? ""} onChange={(e) => handleInputChange(null, "anggota_aktif", parseInt(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="anggota_tidak_aktif">Anggota Tidak Aktif</Label>
              <Input id="anggota_tidak_aktif" type="number" placeholder="0" value={formData.anggota_tidak_aktif ?? ""} onChange={(e) => handleInputChange(null, "anggota_tidak_aktif", parseInt(e.target.value))} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="general_manager" checked={formData.general_manager} onCheckedChange={(checked) => handleCheckboxChange(null, "general_manager", checked as boolean)} />
              <Label htmlFor="general_manager" className="text-sm font-normal cursor-pointer">
                Memiliki General Manager
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="rapat_tepat_waktu" checked={formData.rapat_tepat_waktu} onCheckedChange={(checked) => handleCheckboxChange(null, "rapat_tepat_waktu", checked as boolean)} />
              <Label htmlFor="rapat_tepat_waktu" className="text-sm font-normal cursor-pointer">
                Rapat Tepat Waktu
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="rapat_luar_biasa" checked={formData.rapat_luar_biasa} onCheckedChange={(checked) => handleCheckboxChange(null, "rapat_luar_biasa", checked as boolean)} />
              <Label htmlFor="rapat_luar_biasa" className="text-sm font-normal cursor-pointer">
                Pernah Rapat Luar Biasa
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="pergantian_pengurus" checked={formData.pergantian_pengurus} onCheckedChange={(checked) => handleCheckboxChange(null, "pergantian_pengurus", checked as boolean)} />
              <Label htmlFor="pergantian_pengurus" className="text-sm font-normal cursor-pointer">
                Pergantian Pengurus
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="pergantian_pengawas" checked={formData.pergantian_pengawas} onCheckedChange={(checked) => handleCheckboxChange(null, "pergantian_pengawas", checked as boolean)} />
              <Label htmlFor="pergantian_pengawas" className="text-sm font-normal cursor-pointer">
                Pergantian Pengawas
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Accordion type="multiple" className="space-y-4">
        <AccordionItem value="rencana_strategis" className="border rounded-lg px-4 bg-card">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <FileCheck className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="font-semibold">Rencana Strategis</p>
                <p className="text-sm text-muted-foreground">Visi, Misi, dan Rencana Organisasi</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="visi" checked={formData.rencana_strategis.visi} onCheckedChange={(checked) => handleCheckboxChange("rencana_strategis", "visi", checked as boolean)} />
                <Label htmlFor="visi" className="text-sm font-normal cursor-pointer">
                  Memiliki Visi
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="misi" checked={formData.rencana_strategis.misi} onCheckedChange={(checked) => handleCheckboxChange("rencana_strategis", "misi", checked as boolean)} />
                <Label htmlFor="misi" className="text-sm font-normal cursor-pointer">
                  Memiliki Misi
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="rencana_strategis" checked={formData.rencana_strategis.rencana_strategis} onCheckedChange={(checked) => handleCheckboxChange("rencana_strategis", "rencana_strategis", checked as boolean)} />
                <Label htmlFor="rencana_strategis" className="text-sm font-normal cursor-pointer">
                  Rencana Strategis
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="sasaran_operasional" checked={formData.rencana_strategis.sasaran_operasional} onCheckedChange={(checked) => handleCheckboxChange("rencana_strategis", "sasaran_operasional", checked as boolean)} />
                <Label htmlFor="sasaran_operasional" className="text-sm font-normal cursor-pointer">
                  Sasaran Operasional
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="art" checked={formData.rencana_strategis.art} onCheckedChange={(checked) => handleCheckboxChange("rencana_strategis", "art", checked as boolean)} />
                <Label htmlFor="art" className="text-sm font-normal cursor-pointer">
                  ART (Anggaran Rumah Tangga)
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="prinsip_koperasi" className="border rounded-lg px-4 bg-card">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="font-semibold">Prinsip Koperasi</p>
                <p className="text-sm text-muted-foreground">Penilaian 7 Prinsip Koperasi (Skala 1-5)</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sukarela_terbuka">Sukarela & Terbuka (1-5)</Label>
                <Input
                  id="sukarela_terbuka"
                  type="number"
                  min="1"
                  max="5"
                  placeholder="1-5"
                  value={formData.prinsip_koperasi.sukarela_terbuka ?? ""}
                  onChange={(e) => handleInputChange("prinsip_koperasi", "sukarela_terbuka", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="demokratis">Demokratis (1-5)</Label>
                <Input id="demokratis" type="number" min="1" max="5" placeholder="1-5" value={formData.prinsip_koperasi.demokratis ?? ""} onChange={(e) => handleInputChange("prinsip_koperasi", "demokratis", parseInt(e.target.value))} />
              </div>
              <div>
                <Label htmlFor="ekonomi">Partisipasi Ekonomi (1-5)</Label>
                <Input id="ekonomi" type="number" min="1" max="5" placeholder="1-5" value={formData.prinsip_koperasi.ekonomi ?? ""} onChange={(e) => handleInputChange("prinsip_koperasi", "ekonomi", parseInt(e.target.value))} />
              </div>
              <div>
                <Label htmlFor="kemandirian">Kemandirian (1-5)</Label>
                <Input id="kemandirian" type="number" min="1" max="5" placeholder="1-5" value={formData.prinsip_koperasi.kemandirian ?? ""} onChange={(e) => handleInputChange("prinsip_koperasi", "kemandirian", parseInt(e.target.value))} />
              </div>
              <div>
                <Label htmlFor="pendidikan">Pendidikan & Pelatihan (1-5)</Label>
                <Input id="pendidikan" type="number" min="1" max="5" placeholder="1-5" value={formData.prinsip_koperasi.pendidikan ?? ""} onChange={(e) => handleInputChange("prinsip_koperasi", "pendidikan", parseInt(e.target.value))} />
              </div>
              <div>
                <Label htmlFor="kerja_sama">Kerja Sama (1-5)</Label>
                <Input id="kerja_sama" type="number" min="1" max="5" placeholder="1-5" value={formData.prinsip_koperasi.kerja_sama ?? ""} onChange={(e) => handleInputChange("prinsip_koperasi", "kerja_sama", parseInt(e.target.value))} />
              </div>
              <div>
                <Label htmlFor="kepedulian">Kepedulian Masyarakat (1-5)</Label>
                <Input id="kepedulian" type="number" min="1" max="5" placeholder="1-5" value={formData.prinsip_koperasi.kepedulian ?? ""} onChange={(e) => handleInputChange("prinsip_koperasi", "kepedulian", parseInt(e.target.value))} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="pelatihan" className="border rounded-lg px-4 bg-card">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="font-semibold">Data Pelatihan</p>
                <p className="text-sm text-muted-foreground">Pelatihan yang telah diikuti</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="space-y-4">
              {formData.pelatihan.map((item, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-end gap-4 ">
                        <div className="">
                          <Label className="mb-2">Jenis Pelatihan</Label>
                          <Select value={item.pelatihan} onValueChange={(value) => updatePelatihan(index, "pelatihan", value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {pelatihanOptions.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="mb-2">Akumulasi Peserta</Label>
                          <Input type="number" placeholder="Jumlah peserta" value={item.akumulasi ?? ""} onChange={(e) => updatePelatihan(index, "akumulasi", parseInt(e.target.value))} />
                        </div>
                        <Button type="button" variant="destructive" size="icon" onClick={() => removePelatihan(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button type="button" variant="outline" onClick={addPelatihan} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Pelatihan
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rapat_koordinasi" className="border rounded-lg px-4 bg-card">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Users2 className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="font-semibold">Frekuensi Rapat Koordinasi</p>
                <p className="text-sm text-muted-foreground">Jadwal rapat rutin organisasi</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rapat_pengurus">Rapat Pengurus</Label>
                <Select value={formData.rapat_koordinasi.rapat_pengurus} onValueChange={(value) => handleInputChange("rapat_koordinasi", "rapat_pengurus", value)}>
                  <SelectTrigger id="rapat_pengurus">
                    <SelectValue placeholder="Pilih frekuensi" />
                  </SelectTrigger>
                  <SelectContent>
                    {rapatOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rapat_pengawas">Rapat Pengawas</Label>
                <Select value={formData.rapat_koordinasi.rapat_pengawas} onValueChange={(value) => handleInputChange("rapat_koordinasi", "rapat_pengawas", value)}>
                  <SelectTrigger id="rapat_pengawas">
                    <SelectValue placeholder="Pilih frekuensi" />
                  </SelectTrigger>
                  <SelectContent>
                    {rapatOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rapat_gabungan">Rapat Gabungan</Label>
                <Select value={formData.rapat_koordinasi.rapat_gabungan} onValueChange={(value) => handleInputChange("rapat_koordinasi", "rapat_gabungan", value)}>
                  <SelectTrigger id="rapat_gabungan">
                    <SelectValue placeholder="Pilih frekuensi" />
                  </SelectTrigger>
                  <SelectContent>
                    {rapatOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rapat_pengurus_karyawan">Rapat Pengurus & Karyawan</Label>
                <Select value={formData.rapat_koordinasi.rapat_pengurus_karyawan} onValueChange={(value) => handleInputChange("rapat_koordinasi", "rapat_pengurus_karyawan", value)}>
                  <SelectTrigger id="rapat_pengurus_karyawan">
                    <SelectValue placeholder="Pilih frekuensi" />
                  </SelectTrigger>
                  <SelectContent>
                    {rapatOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rapat_pengurus_anggota">Rapat Pengurus & Anggota</Label>
                <Select value={formData.rapat_koordinasi.rapat_pengurus_anggota} onValueChange={(value) => handleInputChange("rapat_koordinasi", "rapat_pengurus_anggota", value)}>
                  <SelectTrigger id="rapat_pengurus_anggota">
                    <SelectValue placeholder="Pilih frekuensi" />
                  </SelectTrigger>
                  <SelectContent>
                    {rapatOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Simpan Performa Organisasi"}
        </Button>
      </div>
    </form>
  );
}
