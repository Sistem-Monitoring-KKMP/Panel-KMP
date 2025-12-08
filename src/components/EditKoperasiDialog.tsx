import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Trash2 } from "lucide-react";
import type { KoperasiFormInput } from "@/hooks/useKoperasi";
import type { Koperasi } from "@/types/koperasi";

const koperasiSchema = z.object({
  nama: z.string().min(1, "Nama koperasi harus diisi"),
  kontak: z.string().optional(),
  no_badan_hukum: z.string().optional(),
  tahun: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .optional(),
  status: z.enum(["Aktif", "TidakAktif", "Pembentukan"]).optional(),
});

type KoperasiFormData = z.infer<typeof koperasiSchema>;

interface EditKoperasiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  koperasi: Koperasi | null;
  onSubmit: (id: string, data: KoperasiFormInput) => Promise<{ success: boolean; error?: string }>;
  onDelete: (id: string) => Promise<boolean>;
}

export function EditKoperasiDialog({ open, onOpenChange, koperasi, onSubmit, onDelete }: EditKoperasiDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<KoperasiFormData>({
    resolver: zodResolver(koperasiSchema),
  });

  const formValues = watch();

  useEffect(() => {
    if (koperasi && open) {
      reset({
        nama: koperasi.nama,
        kontak: koperasi.kontak || "",
        no_badan_hukum: koperasi.no_badan_hukum || "",
        tahun: koperasi.tahun,
        status: koperasi.status,
      });
      setIsDirty(false);
    }
  }, [koperasi, open, reset]);

  useEffect(() => {
    if (!koperasi) return;

    const hasChanges =
      formValues.nama !== koperasi.nama ||
      (formValues.kontak || "") !== (koperasi.kontak || "") ||
      (formValues.no_badan_hukum || "") !== (koperasi.no_badan_hukum || "") ||
      formValues.tahun !== koperasi.tahun ||
      formValues.status !== koperasi.status;

    setIsDirty(hasChanges);
  }, [formValues, koperasi]);

  const handleClose = () => {
    if (isDirty) {
      setShowCancelConfirm(true);
    } else {
      resetAndClose();
    }
  };

  const resetAndClose = () => {
    reset();
    setIsDirty(false);
    setShowCancelConfirm(false);
    onOpenChange(false);
  };

  const handleFormSubmit = async (data: KoperasiFormData) => {
    if (!koperasi) return;

    setIsSubmitting(true);

    try {
      const result = await onSubmit(koperasi.id, data as KoperasiFormInput);

      if (result.success) {
        resetAndClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!koperasi) return;

    setIsSubmitting(true);
    try {
      const success = await onDelete(koperasi.id);
      if (success) {
        setShowDeleteConfirm(false);
        resetAndClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!koperasi) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Profil Koperasi</DialogTitle>
            <DialogDescription>Perbarui informasi koperasi</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nama">
                  Nama Koperasi <span className="text-red-500">*</span>
                </Label>
                <Input id="nama" {...register("nama")} placeholder="Masukkan nama koperasi" />
                {errors.nama && <p className="text-sm text-red-500">{errors.nama.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="no_badan_hukum">No. Badan Hukum</Label>
                <Input id="no_badan_hukum" {...register("no_badan_hukum")} placeholder="Masukkan nomor badan hukum" />
                {errors.no_badan_hukum && <p className="text-sm text-red-500">{errors.no_badan_hukum.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kontak">Kontak</Label>
                  <Input id="kontak" {...register("kontak")} placeholder="Nomor telepon" />
                  {errors.kontak && <p className="text-sm text-red-500">{errors.kontak.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tahun">Tahun Berdiri</Label>
                  <Input
                    id="tahun"
                    type="number"
                    {...register("tahun", {
                      valueAsNumber: true,
                      setValueAs: (v) => (v === "" ? undefined : parseInt(v, 10)),
                    })}
                    placeholder="Tahun"
                    min={1900}
                    max={new Date().getFullYear() + 1}
                  />
                  {errors.tahun && <p className="text-sm text-red-500">{errors.tahun.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={watch("status")} onValueChange={(value) => setValue("status", value as "Aktif" | "TidakAktif" | "Pembentukan")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aktif">Aktif</SelectItem>
                    <SelectItem value="TidakAktif">Tidak Aktif</SelectItem>
                    <SelectItem value="Pembentukan">Pembentukan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-4">
              <Button type="button" variant="destructive" onClick={() => setShowDeleteConfirm(true)} disabled={isSubmitting}>
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus Koperasi
              </Button>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmitting || !isDirty}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Simpan Perubahan
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Batalkan Perubahan?</AlertDialogTitle>
            <AlertDialogDescription>Anda telah melakukan perubahan. Apakah Anda yakin ingin membatalkan? Semua perubahan akan hilang.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Lanjut Edit</AlertDialogCancel>
            <AlertDialogAction onClick={resetAndClose}>Ya, Batalkan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Koperasi?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus koperasi <strong>{koperasi.nama}</strong>? Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={isSubmitting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
