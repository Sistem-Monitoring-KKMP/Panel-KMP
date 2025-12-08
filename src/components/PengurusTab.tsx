import { useState, type Key } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Edit, Trash2, Plus } from "lucide-react";
import { usePengurus } from "@/hooks/usePengurus";
import type { Pengurus, PengurusFormInput } from "@/types/pengurus";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface PengurusTabProps {
  koperasiId: string;
}

const pengurusSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter").max(255, "Nama maksimal 255 karakter"),
  jabatan: z.string().min(1, "Jabatan harus dipilih"),
  jenis_kelamin: z.string().min(1, "Jenis kelamin harus dipilih"),
  usia: z.string().optional(),
  pendidikan_koperasi: z.boolean(),
  pendidikan_ekonomi: z.boolean(),
  pelatihan_koperasi: z.boolean(),
  pelatihan_bisnis: z.boolean(),
  pelatihan_lainnya: z.boolean(),
  tingkat_pendidikan: z.string().optional(),
  keaktifan_kkmp: z.string().optional(),
  latar_belakang: z.array(z.string()),
});

const jabatanOptions = [
  { value: "Ketua", label: "Ketua" },
  { value: "WakilBU", label: "Wakil BU" },
  { value: "WakilBA", label: "Wakil BA" },
  { value: "Sekretaris", label: "Sekretaris" },
  { value: "Bendahara", label: "Bendahara" },
  { value: "KetuaPengawas", label: "Ketua Pengawas" },
  { value: "Pengawas", label: "Pengawas" },
  { value: "GeneralManager", label: "General Manager" },
];

const tingkatPendidikanOptions = [
  { value: "sd", label: "SD" },
  { value: "sltp", label: "SLTP" },
  { value: "slta", label: "SLTA" },
  { value: "diploma", label: "Diploma" },
  { value: "sarjana", label: "Sarjana" },
  { value: "pascasarjana", label: "Pascasarjana" },
];

const keaktifanOptions = [
  { value: "aktif", label: "Aktif" },
  { value: "cukup aktif", label: "Cukup Aktif" },
  { value: "kurang aktif", label: "Kurang Aktif" },
];

const latarBelakangOptions = [
  { value: "koperasi", label: "Koperasi" },
  { value: "bisnis", label: "Bisnis" },
  { value: "ASN", label: "ASN" },
  { value: "militer/polisi", label: "Militer/Polisi" },
  { value: "politik", label: "Politik" },
  { value: "organisasi", label: "Organisasi" },
];

export function PengurusTab({ koperasiId }: PengurusTabProps) {
  const { pengurusList, isLoading, addPengurus, updatePengurus, deletePengurus } = usePengurus(koperasiId);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPengurus, setSelectedPengurus] = useState<Pengurus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PengurusFormInput>({
    resolver: zodResolver(pengurusSchema),
    defaultValues: {
      nama: "",
      jabatan: "",
      jenis_kelamin: "",
      usia: "",
      pendidikan_koperasi: false,
      pendidikan_ekonomi: false,
      pelatihan_koperasi: false,
      pelatihan_bisnis: false,
      pelatihan_lainnya: false,
      tingkat_pendidikan: "",
      keaktifan_kkmp: "",
      latar_belakang: [],
    },
  });

  const handleOpenDialog = (pengurus?: Pengurus) => {
    if (pengurus) {
      setSelectedPengurus(pengurus);
      form.reset({
        nama: pengurus.nama,
        jabatan: pengurus.jabatan,
        jenis_kelamin: pengurus.jenis_kelamin,
        usia: pengurus.usia?.toString() || "",
        pendidikan_koperasi: pengurus.pendidikan_koperasi,
        pendidikan_ekonomi: pengurus.pendidikan_ekonomi,
        pelatihan_koperasi: pengurus.pelatihan_koperasi,
        pelatihan_bisnis: pengurus.pelatihan_bisnis,
        pelatihan_lainnya: pengurus.pelatihan_lainnya,
        tingkat_pendidikan: pengurus.tingkat_pendidikan || "",
        keaktifan_kkmp: pengurus.keaktifan_kkmp || "",
        latar_belakang: pengurus.latar_belakang?.map((lb) => lb.latarbelakang) || [],
      });
    } else {
      setSelectedPengurus(null);
      form.reset({
        nama: "",
        jabatan: "",
        jenis_kelamin: "",
        usia: "",
        pendidikan_koperasi: false,
        pendidikan_ekonomi: false,
        pelatihan_koperasi: false,
        pelatihan_bisnis: false,
        pelatihan_lainnya: false,
        tingkat_pendidikan: "",
        keaktifan_kkmp: "",
        latar_belakang: [],
      });
    }
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setSelectedPengurus(null);
    form.reset();
  };

  const handleOpenDeleteDialog = (pengurus: Pengurus) => {
    setSelectedPengurus(pengurus);
    setShowDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
    setSelectedPengurus(null);
  };

  const onSubmit = async (data: PengurusFormInput) => {
    setIsSubmitting(true);

    const result = selectedPengurus ? await updatePengurus(selectedPengurus.id, data) : await addPengurus(data);

    setIsSubmitting(false);

    if (result.success) {
      handleCloseDialog();
    }
  };

  const handleDelete = async () => {
    if (!selectedPengurus) return;

    setIsSubmitting(true);
    const result = await deletePengurus(selectedPengurus.id);
    setIsSubmitting(false);

    if (result.success) {
      handleCloseDeleteDialog();
    }
  };

  const getJabatanLabel = (jabatan: string) => {
    return jabatanOptions.find((j) => j.value === jabatan)?.label || jabatan;
  };

  const getTingkatPendidikanLabel = (tingkat?: string) => {
    if (!tingkat) return "-";
    return tingkatPendidikanOptions.find((t) => t.value === tingkat)?.label || tingkat;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex flex-col items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-sm text-muted-foreground">Memuat data pengurus...</p>
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
            <CardTitle>Data Pengurus Koperasi</CardTitle>
            <CardDescription>Kelola data pengurus dan struktur organisasi</CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Pengurus
          </Button>
        </CardHeader>
        <CardContent>
          {pengurusList.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Jabatan</TableHead>
                    <TableHead>JK</TableHead>
                    <TableHead>Usia</TableHead>
                    <TableHead>Pendidikan</TableHead>
                    <TableHead>Latar Belakang</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pengurusList.map((pengurus) => (
                    <TableRow key={pengurus.id}>
                      <TableCell className="font-medium">{pengurus.nama}</TableCell>
                      <TableCell>{getJabatanLabel(pengurus.jabatan)}</TableCell>
                      <TableCell>{pengurus.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}</TableCell>
                      <TableCell>{pengurus.usia || "-"}</TableCell>
                      <TableCell>{getTingkatPendidikanLabel(pengurus.tingkat_pendidikan)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {pengurus.latar_belakang && pengurus.latar_belakang.length > 0 ? (
                            pengurus.latar_belakang.map((lb: { id: Key | null | undefined; latarbelakang: string }) => (
                              <Badge key={lb.id} variant="secondary" className="text-xs">
                                {latarBelakangOptions.find((opt) => opt.value === lb.latarbelakang)?.label || lb.latarbelakang}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(pengurus)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDeleteDialog(pengurus)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <Users className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium">Belum ada data pengurus</p>
              <p className="text-sm text-muted-foreground">Tambahkan data pengurus koperasi</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPengurus ? "Edit Pengurus" : "Tambah Pengurus"}</DialogTitle>
            <DialogDescription>Lengkapi informasi pengurus koperasi di bawah ini</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Informasi Dasar */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Informasi Dasar</h3>
                <FormField
                  control={form.control}
                  name="nama"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Lengkap</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nama lengkap" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="jabatan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jabatan</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih jabatan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {jabatanOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jenis_kelamin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jenis Kelamin</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="L">Laki-laki</SelectItem>
                            <SelectItem value="P">Perempuan</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="usia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Usia (Opsional)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Masukkan usia" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Pendidikan & Pelatihan */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Pendidikan & Pelatihan</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tingkat_pendidikan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tingkat Pendidikan</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih tingkat pendidikan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tingkatPendidikanOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="keaktifan_kkmp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Keaktifan KKMP</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih keaktifan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {keaktifanOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormLabel>Pendidikan</FormLabel>
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="pendidikan_koperasi"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="font-normal">Pendidikan Koperasi</FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="pendidikan_ekonomi"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="font-normal">Pendidikan Ekonomi</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <FormLabel>Pelatihan</FormLabel>
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="pelatihan_koperasi"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="font-normal">Pelatihan Koperasi</FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="pelatihan_bisnis"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="font-normal">Pelatihan Bisnis</FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="pelatihan_lainnya"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="font-normal">Pelatihan Lainnya</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Latar Belakang */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Latar Belakang</h3>
                <FormField
                  control={form.control}
                  name="latar_belakang"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {latarBelakangOptions.map((option) => (
                          <FormField
                            key={option.value}
                            control={form.control}
                            name="latar_belakang"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.value)}
                                    onCheckedChange={(checked) => {
                                      return checked ? field.onChange([...field.value, option.value]) : field.onChange(field.value?.filter((value) => value !== option.value));
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{option.label}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
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
                  {isSubmitting ? "Menyimpan..." : selectedPengurus ? "Update" : "Simpan"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pengurus?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pengurus <strong>{selectedPengurus?.nama}</strong>? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteDialog} disabled={isSubmitting}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isSubmitting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isSubmitting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
