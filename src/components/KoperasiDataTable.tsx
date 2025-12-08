import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Eye, Pencil, Building2, Settings } from "lucide-react";
import type { Koperasi } from "@/types/koperasi";
import { useNavigate } from "react-router-dom";

interface KoperasiDataTableProps {
  data: Koperasi[];
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
  onView: (koperasi: Koperasi) => void;
  onEdit: (koperasi: Koperasi) => void;
}

export function KoperasiDataTable({ data, pagination, isLoading, onPageChange, onView, onEdit }: KoperasiDataTableProps) {
  const navigate = useNavigate();

  const handlePanelKoperasi = (koperasiId: string) => {
    navigate(`/panel-koperasi/${koperasiId}`);
  };

  const renderPaginationItems = () => {
    const items = [];
    const { current_page, last_page } = pagination;

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

    for (let i = Math.max(1, current_page - 1); i <= Math.min(last_page, current_page + 1); i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => onPageChange(i)} isActive={current_page === i}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

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
        <Building2 className="h-12 w-12 text-muted-foreground/50" />
        <p className="mt-4 text-lg font-medium">Tidak ada data koperasi</p>
        <p className="text-sm text-muted-foreground">Belum ada koperasi yang terdaftar</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Koperasi</TableHead>
              <TableHead>No. Badan Hukum</TableHead>
              <TableHead className="w-[120px]">Kontak</TableHead>
              <TableHead className="w-[100px]">Tahun</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-20 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((koperasi) => (
              <TableRow key={koperasi.id}>
                <TableCell>
                  <div className="font-medium">{koperasi.nama}</div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[200px] truncate" title={koperasi.no_badan_hukum}>
                    {koperasi.no_badan_hukum || "-"}
                  </div>
                </TableCell>
                <TableCell>{koperasi.kontak || "-"}</TableCell>
                <TableCell>{koperasi.tahun || "-"}</TableCell>
                <TableCell>
                  <Badge variant={koperasi.status === "Aktif" ? "default" : koperasi.status === "TidakAktif" ? "secondary" : "outline"}>
                    {koperasi.status === "Aktif" ? "Aktif" : koperasi.status === "TidakAktif" ? "Tidak Aktif" : "Pembentukan"}
                  </Badge>
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
                      <DropdownMenuItem onClick={() => onView(koperasi)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(koperasi)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Profil
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePanelKoperasi(koperasi.id)}>
                        <Settings className="mr-2 h-4 w-4" />
                        Panel Koperasi
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
    </div>
  );
}
