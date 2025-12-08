import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Loader2, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnggotaFormInput } from "@/hooks/useAnggota";
import { useAllKoperasi } from "@/hooks/useKoperasi";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const anggotaSchema = z.object({
  kode: z.string().min(1, "Kode harus diisi"),
  nama: z.string().min(1, "Nama harus diisi"),
  nik: z.string().length(16, "NIK harus 16 digit"),
  telp: z.string().optional(),
  alamat: z.string().optional(),
  tempat_lahir: z.string().optional(),
  tanggal_lahir: z.string().optional(),
  kelurahan: z.string().optional(),
  kecamatan: z.string().optional(),
  kota_kab: z.string().optional(),
  keterangan: z.string().optional(),
  jenis_kelamin: z.enum(["L", "P"]).optional(),
  pekerjaan: z.string().optional(),
  status: z.enum(["AKTIF", "NON-AKTIF"]).optional(),
  koperasi_id: z.string().min(1, "Koperasi harus dipilih"),
  foto_anggota: z
    .any()
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return files[0]?.size <= MAX_FILE_SIZE;
    }, "Ukuran file maksimal 2MB")
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return ACCEPTED_IMAGE_TYPES.includes(files[0]?.type);
    }, "Format file harus JPG, JPEG, atau PNG"),
  ktp: z
    .any()
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return files[0]?.size <= MAX_FILE_SIZE;
    }, "Ukuran file maksimal 2MB")
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return ACCEPTED_IMAGE_TYPES.includes(files[0]?.type);
    }, "Format file harus JPG, JPEG, atau PNG"),
  npwp: z
    .any()
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return files[0]?.size <= MAX_FILE_SIZE;
    }, "Ukuran file maksimal 2MB")
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return ACCEPTED_IMAGE_TYPES.includes(files[0]?.type);
    }, "Format file harus JPG, JPEG, atau PNG"),
  nib: z
    .any()
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return files[0]?.size <= MAX_FILE_SIZE;
    }, "Ukuran file maksimal 2MB")
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return ACCEPTED_IMAGE_TYPES.includes(files[0]?.type);
    }, "Format file harus JPG, JPEG, atau PNG"),
  pas_foto: z
    .any()
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return files[0]?.size <= MAX_FILE_SIZE;
    }, "Ukuran file maksimal 2MB")
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return ACCEPTED_IMAGE_TYPES.includes(files[0]?.type);
    }, "Format file harus JPG, JPEG, atau PNG"),
});

type AnggotaFormData = z.infer<typeof anggotaSchema>;

interface AddAnggotaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AnggotaFormInput) => Promise<{ success: boolean; error?: string }>;
}

export function AddAnggotaDialog({ open, onOpenChange, onSubmit }: AddAnggotaDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [openCombobox, setOpenCombobox] = useState(false);

  // Fetch all koperasi for dropdown (lazy load)
  const { data: koperasiList, isLoading: isLoadingKoperasi, hasFetched, refetch: fetchKoperasi } = useAllKoperasi();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AnggotaFormData>({
    resolver: zodResolver(anggotaSchema),
    defaultValues: {
      status: "AKTIF",
    },
  });

  const handleFileChange = (fieldName: keyof AnggotaFormData, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      alert(`Ukuran file ${fieldName} terlalu besar. Maksimal 2MB`);
      // Reset input
      const input = document.getElementById(fieldName) as HTMLInputElement;
      if (input) input.value = "";
      return;
    }

    // Check file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      alert(`Format file ${fieldName} tidak valid. Gunakan JPG, JPEG, atau PNG`);
      // Reset input
      const input = document.getElementById(fieldName) as HTMLInputElement;
      if (input) input.value = "";
      return;
    }
  };

  // Watch all form fields to detect changes
  const formValues = watch();
  const selectedKoperasiId = watch("koperasi_id");

  // Fetch koperasi when dialog opens
  useEffect(() => {
    if (open && !hasFetched && !isLoadingKoperasi) {
      fetchKoperasi();
    }
  }, [open, hasFetched, isLoadingKoperasi, fetchKoperasi]);

  useEffect(() => {
    // Check if any field has been filled
    const hasFilledFields = Object.entries(formValues).some(([key, value]) => {
      if (key === "status") return false; // Ignore status as it has default value
      return value !== undefined && value !== "" && value !== null;
    });
    setIsDirty(hasFilledFields);
  }, [formValues]);

  const handleClose = () => {
    if (isDirty) {
      setShowConfirmDialog(true);
    } else {
      resetAndClose();
    }
  };

  const resetAndClose = () => {
    reset();
    setIsDirty(false);
    setShowConfirmDialog(false);
    onOpenChange(false);
  };

  const handleFormSubmit = async (data: AnggotaFormData) => {
    setIsSubmitting(true);

    try {
      const result = await onSubmit(data as AnggotaFormInput);

      if (result.success) {
        resetAndClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Find selected koperasi for display
  const selectedKoperasi = koperasiList.find((k) => k.id === selectedKoperasiId);

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Anggota Baru</DialogTitle>
            <DialogDescription>Lengkapi form di bawah untuk menambahkan anggota baru</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Data Dasar */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Data Dasar</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kode">
                    Kode <span className="text-red-500">*</span>
                  </Label>
                  <Input id="kode" {...register("kode")} placeholder="Masukkan kode anggota" />
                  {errors.kode && <p className="text-sm text-red-500">{errors.kode.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nama">
                    Nama <span className="text-red-500">*</span>
                  </Label>
                  <Input id="nama" {...register("nama")} placeholder="Masukkan nama lengkap" />
                  {errors.nama && <p className="text-sm text-red-500">{errors.nama.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nik">
                    NIK <span className="text-red-500">*</span>
                  </Label>
                  <Input id="nik" {...register("nik")} placeholder="16 digit NIK" maxLength={16} />
                  {errors.nik && <p className="text-sm text-red-500">{errors.nik.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telp">Telepon</Label>
                  <Input id="telp" {...register("telp")} placeholder="Nomor telepon" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                  <Select onValueChange={(value) => setValue("jenis_kelamin", value as "L" | "P")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Laki-laki</SelectItem>
                      <SelectItem value="P">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pekerjaan">Pekerjaan</Label>
                  <Input id="pekerjaan" {...register("pekerjaan")} placeholder="Pekerjaan" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                  <Input id="tempat_lahir" {...register("tempat_lahir")} placeholder="Tempat lahir" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                  <Input id="tanggal_lahir" type="date" {...register("tanggal_lahir")} />
                </div>

                <div className="space-y-2">
                  <Label>
                    Koperasi <span className="text-red-500">*</span>
                  </Label>
                  <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" aria-expanded={openCombobox} className="w-full justify-between" disabled={isLoadingKoperasi}>
                        {isLoadingKoperasi ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Memuat data...
                          </>
                        ) : selectedKoperasi ? (
                          selectedKoperasi.nama
                        ) : (
                          "Pilih koperasi..."
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Cari koperasi..." />
                        <CommandList>
                          <CommandEmpty>Koperasi tidak ditemukan.</CommandEmpty>
                          <CommandGroup>
                            {koperasiList.map((koperasi) => (
                              <CommandItem
                                key={koperasi.id}
                                value={koperasi.nama}
                                onSelect={() => {
                                  setValue("koperasi_id", koperasi.id);
                                  setOpenCombobox(false);
                                }}
                              >
                                <Check className={cn("mr-2 h-4 w-4", selectedKoperasiId === koperasi.id ? "opacity-100" : "opacity-0")} />
                                <div className="flex flex-col">
                                  <span>{koperasi.nama}</span>
                                  {/* <span className="text-xs text-muted-foreground">{koperasi.kode_koperasi}</span> */}
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {errors.koperasi_id && <p className="text-sm text-red-500">{errors.koperasi_id.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue="AKTIF" onValueChange={(value) => setValue("status", value as "AKTIF" | "NON-AKTIF")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AKTIF">Aktif</SelectItem>
                      <SelectItem value="NON-AKTIF">Non-Aktif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Alamat */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Alamat</h3>

              <div className="space-y-2">
                <Label htmlFor="alamat">Alamat Lengkap</Label>
                <Textarea id="alamat" {...register("alamat")} placeholder="Alamat lengkap" rows={3} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kelurahan">Kelurahan</Label>
                  <Input id="kelurahan" {...register("kelurahan")} placeholder="Kelurahan" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kecamatan">Kecamatan</Label>
                  <Input id="kecamatan" {...register("kecamatan")} placeholder="Kecamatan" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kota_kab">Kota/Kabupaten</Label>
                  <Input id="kota_kab" {...register("kota_kab")} placeholder="Kota/Kabupaten" />
                </div>
              </div>
            </div>

            {/* Dokumen */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Dokumen</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="foto_anggota">Foto Anggota</Label>
                  <Input
                    id="foto_anggota"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    {...register("foto_anggota")}
                    onChange={(e) => {
                      handleFileChange("foto_anggota", e.target.files);
                      register("foto_anggota").onChange(e);
                    }}
                  />
                  <p className="text-xs text-muted-foreground">Max 2MB, format: JPG, PNG</p>
                  {errors.foto_anggota && <p className="text-sm text-red-500">{errors.foto_anggota.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ktp">KTP</Label>
                  <Input
                    id="ktp"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    {...register("ktp")}
                    onChange={(e) => {
                      handleFileChange("ktp", e.target.files);
                      register("ktp").onChange(e);
                    }}
                  />
                  <p className="text-xs text-muted-foreground">Max 2MB, format: JPG, PNG</p>
                  {errors.ktp && <p className="text-sm text-red-500">{errors.ktp.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="npwp">NPWP</Label>
                  <Input
                    id="npwp"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    {...register("npwp")}
                    onChange={(e) => {
                      handleFileChange("npwp", e.target.files);
                      register("npwp").onChange(e);
                    }}
                  />
                  <p className="text-xs text-muted-foreground">Max 2MB, format: JPG, PNG</p>
                  {errors.npwp && <p className="text-sm text-red-500">{errors.npwp.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nib">NIB</Label>
                  <Input
                    id="nib"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    {...register("nib")}
                    onChange={(e) => {
                      handleFileChange("nib", e.target.files);
                      register("nib").onChange(e);
                    }}
                  />
                  <p className="text-xs text-muted-foreground">Max 2MB, format: JPG, PNG</p>
                  {errors.nib && <p className="text-sm text-red-500">{errors.nib.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pas_foto">Pas Foto</Label>
                  <Input
                    id="pas_foto"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    {...register("pas_foto")}
                    onChange={(e) => {
                      handleFileChange("pas_foto", e.target.files);
                      register("pas_foto").onChange(e);
                    }}
                  />
                  <p className="text-xs text-muted-foreground">Max 2MB, format: JPG, PNG</p>
                  {errors.pas_foto && <p className="text-sm text-red-500">{errors.pas_foto.message as string}</p>}
                </div>
              </div>
            </div>

            {/* Keterangan */}
            <div className="space-y-2">
              <Label htmlFor="keterangan">Keterangan</Label>
              <Textarea id="keterangan" {...register("keterangan")} placeholder="Keterangan tambahan" rows={3} />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Batalkan Perubahan?</AlertDialogTitle>
            <AlertDialogDescription>Anda telah mengisi beberapa data. Apakah Anda yakin ingin membatalkan? Semua data yang telah diisi akan hilang.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Lanjut Mengisi</AlertDialogCancel>
            <AlertDialogAction onClick={resetAndClose}>Ya, Batalkan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
