import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Koperasi } from "@/types/koperasi";
import { Phone, FileText, Calendar, Shield } from "lucide-react";

interface ViewKoperasiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  koperasi: Koperasi | null;
}

export function ViewKoperasiDialog({ open, onOpenChange, koperasi }: ViewKoperasiDialogProps) {
  if (!koperasi) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detail Koperasi</DialogTitle>
          <DialogDescription>Informasi lengkap koperasi</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">{koperasi.nama}</h3>
              <Badge variant={koperasi.status === "AKTIF" ? "default" : "secondary"}>{koperasi.status}</Badge>
            </div>
          </div>

          <Separator />

          {/* Informasi Detail */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground">INFORMASI KOPERASI</h4>

            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">No. Badan Hukum</p>
                  <p className="text-sm">{koperasi.no_badan_hukum || "-"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Kontak</p>
                  <p className="text-sm">{koperasi.kontak || "-"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Tahun Berdiri</p>
                  <p className="text-sm">{koperasi.tahun || "-"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={koperasi.status === "AKTIF" ? "default" : "secondary"} className="mt-1">
                    {koperasi.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {koperasi.created_at && (
            <>
              <Separator />
              <div className="text-xs text-muted-foreground">Terdaftar sejak {new Date(koperasi.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
