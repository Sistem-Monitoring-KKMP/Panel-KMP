import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { UserFormInput } from "@/hooks/useUser";
import { useAnggota } from "@/hooks/useAnggota";

const userFormSchema = z
  .object({
    email: z.string().email("Email tidak valid"),
    username: z.string().min(3, "Username minimal 3 karakter"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    password_confirmation: z.string(),
    role: z.enum(["admin", "anggota", "superadmin"]),
    anggota_id: z.string().optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Password tidak cocok",
    path: ["password_confirmation"],
  })
  .refine(
    (data) => {
      if (data.role === "anggota") {
        return !!data.anggota_id;
      }
      return true;
    },
    {
      message: "Anggota harus dipilih untuk role anggota",
      path: ["anggota_id"],
    }
  );

type UserFormData = z.infer<typeof userFormSchema>;

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UserFormInput) => Promise<{ success: boolean; error?: string }>;
}

export function AddUserDialog({ open, onOpenChange, onSubmit }: AddUserDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openAnggotaCombobox, setOpenAnggotaCombobox] = useState(false);
  const [_selectedRole, setSelectedRole] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
  });

  const watchedAnggotaId = watch("anggota_id");
  const watchedRole = watch("role");

  // Fetch anggota for combobox
  const { data: anggotaList, isLoading: isLoadingAnggota } = useAnggota({
    per_page: 100,
    status: "AKTIF",
  });

  const handleFormSubmit = async (data: UserFormData) => {
    setIsSubmitting(true);
    const result = await onSubmit(data);
    setIsSubmitting(false);

    if (result.success) {
      reset();
      setSelectedRole("");
      onOpenChange(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
      setSelectedRole("");
    }
    onOpenChange(newOpen);
  };

  const selectedAnggota = anggotaList.find((a) => a.id === watchedAnggotaId);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tambah User Baru</DialogTitle>
          <DialogDescription>Lengkapi form untuk menambahkan user baru</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" placeholder="user@example.com" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input id="username" placeholder="username" {...register("username")} />
            {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input id="password" type="password" placeholder="Minimal 6 karakter" {...register("password")} />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password_confirmation">Konfirmasi Password *</Label>
            <Input id="password_confirmation" type="password" placeholder="Ketik ulang password" {...register("password_confirmation")} />
            {errors.password_confirmation && <p className="text-sm text-destructive">{errors.password_confirmation.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select
              value={watchedRole}
              onValueChange={(value) => {
                setValue("role", value as any);
                setSelectedRole(value);
                if (value !== "anggota") {
                  setValue("anggota_id", undefined);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="superadmin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="anggota">Anggota</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
          </div>

          {watchedRole === "anggota" && (
            <div className="space-y-2">
              <Label>Pilih Anggota *</Label>
              <Popover open={openAnggotaCombobox} onOpenChange={setOpenAnggotaCombobox}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={openAnggotaCombobox} className="w-full justify-between">
                    {selectedAnggota ? (
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{selectedAnggota.nama}</span>
                        <span className="text-xs text-muted-foreground">{selectedAnggota.kode}</span>
                      </div>
                    ) : (
                      "Pilih anggota..."
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Cari anggota..." />
                    <CommandList>
                      <CommandEmpty>{isLoadingAnggota ? "Memuat..." : "Anggota tidak ditemukan."}</CommandEmpty>
                      <CommandGroup>
                        {anggotaList.map((anggota) => (
                          <CommandItem
                            key={anggota.id}
                            value={anggota.nama}
                            onSelect={() => {
                              setValue("anggota_id", anggota.id);
                              setOpenAnggotaCombobox(false);
                            }}
                          >
                            <Check className={cn("mr-2 h-4 w-4", watchedAnggotaId === anggota.id ? "opacity-100" : "opacity-0")} />
                            <div className="flex flex-col">
                              <span className="text-sm">{anggota.nama}</span>
                              <span className="text-xs text-muted-foreground">
                                {anggota.kode} - {anggota.nik}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.anggota_id && <p className="text-sm text-destructive">{errors.anggota_id.message}</p>}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
