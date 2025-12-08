import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Eye, Pencil, Trash2, User } from "lucide-react";
import type { Anggota } from "@/types/anggota";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface AnggotaDataTableProps {
  data: Anggota[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onView: (anggota: Anggota) => void;
  onEdit: (anggota: Anggota) => void;
  onDelete: (id: string) => void;
}

export function AnggotaDataTable({ data, pagination, isLoading, onPageChange, onView, onEdit, onDelete }: AnggotaDataTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDeleteConfirm = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const getInitials = (nama: string) => {
    return nama
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderPaginationItems = () => {
    const items = [];
    const { current_page, last_page } = pagination;

    // Show first page
    if (current_page > 2) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (current_page > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <span className="px-4">...</span>
          </PaginationItem>
        );
      }
    }

    // Show pages around current page
    for (let i = Math.max(1, current_page - 1); i <= Math.min(last_page, current_page + 1); i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => onPageChange(i)} isActive={current_page === i}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show last page
    if (current_page < last_page - 1) {
      if (current_page < last_page - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <span className="px-4">...</span>
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={last_page}>
          <PaginationLink onClick={() => onPageChange(last_page)}>{last_page}</PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <User className="h-12 w-12 text-muted-foreground/50" />
        <p className="mt-4 text-lg font-medium">Tidak ada data anggota</p>
        <p className="text-sm text-muted-foreground">Belum ada anggota yang terdaftar</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Avatar</TableHead>
              <TableHead className="w-[150px]">Kode</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead className="w-[150px]">Telepon</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-20 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((anggota) => (
              <TableRow key={anggota.id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage src={anggota.foto_anggota_url || undefined} alt={anggota.nama} />
                    <AvatarFallback className="bg-primary/10 text-primary">{getInitials(anggota.nama)}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{anggota.kode}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{anggota.nama}</div>
                    <div className="text-sm text-muted-foreground">{anggota.pekerjaan}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[300px] truncate" title={anggota.alamat}>
                    {anggota.alamat}
                  </div>
                </TableCell>
                <TableCell>{anggota.telp}</TableCell>
                <TableCell>
                  <Badge variant={anggota.status === "AKTIF" ? "default" : "secondary"}>{anggota.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(anggota)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(anggota)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDeleteId(anggota.id)} className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Menampilkan {pagination.from} - {pagination.to} dari {pagination.total} data
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => onPageChange(pagination.current_page - 1)} className={pagination.current_page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} />
            </PaginationItem>

            {renderPaginationItems()}

            <PaginationItem>
              <PaginationNext onClick={() => onPageChange(pagination.current_page + 1)} className={pagination.current_page === pagination.last_page ? "pointer-events-none opacity-50" : "cursor-pointer"} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>Apakah Anda yakin ingin menghapus anggota ini? Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
