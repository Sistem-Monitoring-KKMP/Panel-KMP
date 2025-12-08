import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Edit, Plus } from "lucide-react";
import { useLokasi, useFormData } from "@/hooks/useLokasi";
import type { LokasiFormInput } from "@/types/lokasi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface LokasiTabProps {
  koperasiId: string;
}

const lokasiSchema = z.object({
  kelurahan_id: z.string().min(1, "Kelurahan harus dipilih"),
  kecamatan_id: z.string().min(1, "Kecamatan harus dipilih"),
  alamat: z.string().min(3, "Alamat minimal 3 karakter").max(500, "Alamat maksimal 500 karakter"),
  longitude: z.string().optional(),
  latitude: z.string().optional(),
});

export function LokasiTab({ koperasiId }: LokasiTabProps) {
  // ✅ SWR auto-cache! Gak perlu hasLoaded, onLoad, dll
  const { lokasi, isLoading, saveLokasi } = useLokasi(koperasiId);
  const { kelurahan, kecamatan, isLoading: isLoadingFormData } = useFormData();
  const [showDialog, setShowDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LokasiFormInput>({
    resolver: zodResolver(lokasiSchema),
    defaultValues: {
      kelurahan_id: "",
      kecamatan_id: "",
      alamat: "",
      longitude: "",
      latitude: "",
    },
  });

  useEffect(() => {
    if (lokasi && showDialog) {
      form.reset({
        kelurahan_id: lokasi.kelurahan_id?.toString() || "",
        kecamatan_id: lokasi.kecamatan_id?.toString() || "",
        alamat: lokasi.alamat,
        longitude: lokasi.longitude || "",
        latitude: lokasi.latitude || "",
      });
    }
  }, [lokasi, showDialog, form]);

  const handleOpenDialog = () => {
    if (lokasi) {
      form.reset({
        kelurahan_id: lokasi.kelurahan_id?.toString() || "",
        kecamatan_id: lokasi.kecamatan_id?.toString() || "",
        alamat: lokasi.alamat,
        longitude: lokasi.longitude || "",
        latitude: lokasi.latitude || "",
      });
    } else {
      form.reset({
        kelurahan_id: "",
        kecamatan_id: "",
        alamat: "",
        longitude: "",
        latitude: "",
      });
    }
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    form.reset();
  };

  const onSubmit = async (data: LokasiFormInput) => {
    setIsSubmitting(true);
    const result = await saveLokasi(data);
    setIsSubmitting(false);

    if (result.success) {
      handleCloseDialog();
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex flex-col items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-sm text-muted-foreground">Memuat data lokasi...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Lokasi Koperasi</CardTitle>
            <CardDescription>Informasi alamat dan koordinat lokasi koperasi</CardDescription>
          </div>
          <Button onClick={handleOpenDialog}>
            {lokasi ? (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Edit Lokasi
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Lokasi
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          {lokasi ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Kelurahan</p>
                  <p className="font-medium">{lokasi.kelurahan?.nama || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kecamatan</p>
                  <p className="font-medium">{lokasi.kecamatan?.nama || "-"}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Alamat Lengkap</p>
                <p className="font-medium">{lokasi.alamat}</p>
              </div>
              {(lokasi.longitude || lokasi.latitude) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Longitude</p>
                    <p className="font-medium">{lokasi.longitude || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Latitude</p>
                    <p className="font-medium">{lokasi.latitude || "-"}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <MapPin className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium">Belum ada data lokasi</p>
              <p className="text-sm text-muted-foreground">Tambahkan informasi lokasi koperasi</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{lokasi ? "Edit Lokasi" : "Tambah Lokasi"}</DialogTitle>
            <DialogDescription>Lengkapi informasi lokasi koperasi di bawah ini</DialogDescription>
          </DialogHeader>

          {isLoadingFormData ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-sm text-muted-foreground">Memuat data form...</p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="kelurahan_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kelurahan</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih kelurahan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {kelurahan.length > 0 ? (
                              kelurahan.map((item) => (
                                <SelectItem key={item.id} value={item.id.toString()}>
                                  {item.nama}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-data" disabled>
                                Tidak ada data kelurahan
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="kecamatan_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kecamatan</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih kecamatan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {kecamatan.length > 0 ? (
                              kecamatan.map((item) => (
                                <SelectItem key={item.id} value={item.id.toString()}>
                                  {item.nama}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-data" disabled>
                                Tidak ada data kecamatan
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="alamat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat Lengkap</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Masukkan alamat lengkap koperasi" className="min-h-[100px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude (Opsional)</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="106.845600" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude (Opsional)</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="-6.208800" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={isSubmitting}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Menyimpan..." : lokasi ? "Update" : "Simpan"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
