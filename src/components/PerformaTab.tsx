import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TrendingUp, Calendar, BarChart3, Building2, Users2 } from "lucide-react";
import { usePerformaPeriods, usePerforma } from "@/hooks/usePerforma";
import { PerformaBisnisForm } from "./PerformaBisnisForm";
import { PerformaOrganisasiForm } from "./PerformaOrganisasiForm";
import type { PerformaFormInput } from "@/types/performa";

interface PerformaTabProps {
  koperasiId: string;
}

export function PerformaTab({ koperasiId }: PerformaTabProps) {
  const { periods, isLoading: isLoadingPeriods } = usePerformaPeriods(koperasiId);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const { performa, isLoading: isLoadingPerforma, savePerforma, savePerformaBisnis, savePerformaOrganisasi } = usePerforma(koperasiId, selectedPeriod);

  // Generate years from 2020 to 2030
  const availableYears = Array.from({ length: 11 }, (_, i) => (2020 + i).toString());

  // Form state untuk indikator utama
  const [formData, setFormData] = useState<PerformaFormInput>({
    periode: "",
    cdi: null,
    bdi: null,
    odi: null,
    kuadrant: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set selected period ke tahun saat ini saat component mount
  useEffect(() => {
    if (!selectedPeriod) {
      const currentYear = new Date().getFullYear().toString();
      setSelectedPeriod(currentYear);
    }
  }, [selectedPeriod]);

  // Update form data saat performa berubah
  useEffect(() => {
    if (performa) {
      console.log("Performa data loaded:", performa);
      console.log("Kuadrant value from API:", performa.kuadrant, "Type:", typeof performa.kuadrant);

      const newFormData = {
        periode: new Date(performa.periode).getFullYear().toString(),
        cdi: performa.cdi,
        bdi: performa.bdi,
        odi: performa.odi,
        kuadrant: performa.kuadrant,
      };

      console.log("Setting formData to:", newFormData);
      setFormData(newFormData);
    } else if (selectedPeriod) {
      console.log("No performa data, resetting form");
      setFormData({
        periode: selectedPeriod,
        cdi: null,
        bdi: null,
        odi: null,
        kuadrant: null,
      });
    }
  }, [performa, selectedPeriod]);

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };

  const handleInputChange = (field: keyof PerformaFormInput, value: string) => {
    const numValue = value === "" ? null : parseInt(value);
    console.log(`Updating ${field} to:`, numValue);
    setFormData((prev) => ({ ...prev, [field]: numValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await savePerforma(formData);

    setIsSubmitting(false);

    if (result.success) {
      // Refresh data
      setSelectedPeriod(formData.periode);
    }
  };

  const handleSavePerformaBisnis = async (data: any) => {
    if (!performa) {
      console.error("Performa data not found");
      return;
    }
    await savePerformaBisnis(performa.id, data);
  };

  const handleSavePerformaOrganisasi = async (data: any) => {
    if (!performa) {
      console.error("Performa data not found");
      return;
    }
    await savePerformaOrganisasi(performa.id, data);
  };

  if (isLoadingPeriods) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex flex-col items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-sm text-muted-foreground">Memuat data performa...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Card - Period Selector */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Data Performa Koperasi
              </CardTitle>
              <CardDescription>Pilih periode tahun untuk melihat atau mengisi data performa</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-xs">
              <Label htmlFor="period-select" className="text-sm font-medium">
                Pilih Periode (Tahun)
              </Label>
              <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                <SelectTrigger id="period-select" className="mt-1.5">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Pilih tahun..." />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map((year) => {
                    const periodData = periods.find((p) => p.year === year);
                    return (
                      <SelectItem key={year} value={year}>
                        Tahun {year}
                        {periodData?.cdi && ` (CDI: ${periodData.cdi})`}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {selectedPeriod && (
              <div className="flex items-end gap-2">
                <div className="text-sm">
                  <p className="text-muted-foreground">Periode yang dipilih:</p>
                  <p className="font-semibold text-lg">{selectedPeriod}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedPeriod && (
        <>
          {/* Main Indicators Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Indikator Performa Utama
              </CardTitle>
              <CardDescription>{performa ? `Edit data performa untuk periode ${selectedPeriod}` : `Isi data performa untuk periode ${selectedPeriod}`}</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPerforma ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="cdi">CDI (Cooperative Development Index)</Label>
                      <Input id="cdi" type="number" placeholder="Masukkan nilai CDI" value={formData.cdi ?? ""} onChange={(e) => handleInputChange("cdi", e.target.value)} />
                    </div>

                    <div>
                      <Label htmlFor="bdi">BDI (Business Development Index)</Label>
                      <Input id="bdi" type="number" placeholder="Masukkan nilai BDI" value={formData.bdi ?? ""} onChange={(e) => handleInputChange("bdi", e.target.value)} />
                    </div>

                    <div>
                      <Label htmlFor="odi">ODI (Organization Development Index)</Label>
                      <Input id="odi" type="number" placeholder="Masukkan nilai ODI" value={formData.odi ?? ""} onChange={(e) => handleInputChange("odi", e.target.value)} />
                    </div>

                    <div>
                      <Label htmlFor="kuadrant">Kuadrant (1-4)</Label>
                      <Select key={`kuadrant-${formData.kuadrant}`} value={formData.kuadrant !== null && formData.kuadrant !== undefined ? String(formData.kuadrant) : ""} onValueChange={(value) => handleInputChange("kuadrant", value)}>
                        <SelectTrigger id="kuadrant">
                          <SelectValue placeholder="Pilih kuadrant" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Kuadrant 1</SelectItem>
                          <SelectItem value="2">Kuadrant 2</SelectItem>
                          <SelectItem value="3">Kuadrant 3</SelectItem>
                          <SelectItem value="4">Kuadrant 4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Menyimpan..." : "Simpan Indikator"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Accordions for Detailed Forms */}
          {performa && (
            <Accordion type="multiple" className="space-y-4">
              {/* Performa Bisnis Accordion */}
              <AccordionItem value="bisnis" className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="font-semibold">Performa Bisnis</p>
                      <p className="text-sm text-muted-foreground">Hubungan Lembaga, Unit Usaha, Keuangan, Neraca</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <PerformaBisnisForm performaBisnis={performa.performa_bisnis} onSave={handleSavePerformaBisnis} />
                </AccordionContent>
              </AccordionItem>

              {/* Performa Organisasi Accordion */}
              <AccordionItem value="organisasi" className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Users2 className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="font-semibold">Performa Organisasi</p>
                      <p className="text-sm text-muted-foreground">Rencana Strategis, Prinsip Koperasi, Pelatihan, Rapat</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <PerformaOrganisasiForm performaOrganisasi={performa.performa_organisasi} onSave={handleSavePerformaOrganisasi} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </>
      )}
    </div>
  );
}
