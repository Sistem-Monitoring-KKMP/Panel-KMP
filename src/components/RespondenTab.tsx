import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ClipboardList, Edit, Trash2, Plus, User, Phone } from "lucide-react";
import { useResponden } from "@/hooks/useResponden";
import type { RespondenFormInput } from "@/types/responden";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface RespondenTabProps {
  koperasiId: string;
}

const respondenSchema = z.object({
  responden: z.string().min(3, "Nama responden minimal 3 karakter").max(255, "Nama responden maksimal 255 karakter"),
  kontak_responden: z.string().min(10, "Kontak minimal 10 karakter").max(20, "Kontak maksimal 20 karakter"),
  enumerator: z.string().min(3, "Nama enumerator minimal 3 karakter").max(255, "Nama enumerator maksimal 255 karakter"),
  kontak_enumerator: z.string().min(10, "Kontak minimal 10 karakter").max(20, "Kontak maksimal 20 karakter"),
});

export function RespondenTab({ koperasiId }: RespondenTabProps) {
  const { responden, isLoading, saveResponden, deleteResponden } = useResponden(koperasiId);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RespondenFormInput>({
    resolver: zodResolver(respondenSchema),
    defaultValues: {
      responden: "",
      kontak_responden: "",
      enumerator: "",
      kontak_enumerator: "",
    },
  });

  useEffect(() => {
    if (responden && showDialog) {
      form.reset({
        responden: responden.responden,
        kontak_responden: responden.kontak_responden,
        enumerator: responden.enumerator,
        kontak_enumerator: responden.kontak_enumerator,
      });
    }
  }, [responden, showDialog, form]);

  const handleOpenDialog = () => {
    if (responden) {
      form.reset({
        responden: responden.responden,
        kontak_responden: responden.kontak_responden,
        enumerator: responden.enumerator,
        kontak_enumerator: responden.kontak_enumerator,
      });
    } else {
      form.reset({
        responden: "",
        kontak_responden: "",
        enumerator: "",
        kontak_enumerator: "",
      });
    }
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    form.reset();
  };

  const handleOpenDeleteDialog = () => {
    setShowDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
  };

  const onSubmit = async (data: RespondenFormInput) => {
    setIsSubmitting(true);
    const result = await saveResponden(data);
    setIsSubmitting(false);

    if (result.success) {
      handleCloseDialog();
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    const result = await deleteResponden();
    setIsSubmitting(false);

    if (result.success) {
      handleCloseDeleteDialog();
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex flex-col items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-sm text-muted-foreground">Memuat data responden...</p>
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
            <CardTitle>Data Responden</CardTitle>
            <CardDescription>Kelola data responden dan enumerator koperasi</CardDescription>
          </div>
          <Button onClick={handleOpenDialog}>
            {responden ? (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Edit Responden
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Responden
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          {responden ? (
            <div className="space-y-6">
              {/* Responden Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Responden</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                  <div>
                    <p className="text-sm text-muted-foreground">Nama Responden</p>
                    <p className="font-medium">{responden.responden}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Kontak Responden</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{responden.kontak_responden}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enumerator Section */}
              <div className="border-t pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <ClipboardList className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Enumerator</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                  <div>
                    <p className="text-sm text-muted-foreground">Nama Enumerator</p>
                    <p className="font-medium">{responden.enumerator}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Kontak Enumerator</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{responden.kontak_enumerator}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delete Button */}
              <div className="flex justify-end pt-4 border-t">
                <Button variant="destructive" onClick={handleOpenDeleteDialog}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus Responden
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <ClipboardList className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium">Belum ada data responden</p>
              <p className="text-sm text-muted-foreground">Tambahkan informasi responden dan enumerator koperasi</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{responden ? "Edit Responden" : "Tambah Responden"}</DialogTitle>
            <DialogDescription>Lengkapi informasi responden dan enumerator koperasi</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Responden Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Informasi Responden</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="responden"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Responden</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan nama responden" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="kontak_responden"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kontak Responden</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="08123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Enumerator Section */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Informasi Enumerator</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="enumerator"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Enumerator</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan nama enumerator" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="kontak_enumerator"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kontak Enumerator</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="08123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={isSubmitting}>
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Menyimpan..." : responden ? "Update" : "Simpan"}
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
            <AlertDialogTitle>Hapus Responden?</AlertDialogTitle>
            <AlertDialogDescription>Apakah Anda yakin ingin menghapus data responden? Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
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
