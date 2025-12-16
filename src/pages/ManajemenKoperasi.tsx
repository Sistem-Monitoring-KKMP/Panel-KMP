import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KoperasiDataTable } from "@/components/KoperasiDataTable";
import { ViewKoperasiDialog } from "@/components/ViewKoperasiDialog";
import { EditKoperasiDialog } from "@/components/EditKoperasiDialog";
import { AddKoperasiDialog } from "@/components/AddKoperasiDialog";
import { useKoperasi } from "@/hooks/useKoperasi";
import type { Koperasi } from "@/types/koperasi";

export function ManajemenKoperasi() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Aktif" | "TidakAktif" | "Pembentukan" | "ALL">("ALL");
  const [selectedKoperasi, setSelectedKoperasi] = useState<Koperasi | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { data, pagination, isLoading, createKoperasi, updateKoperasi, deleteKoperasi } = useKoperasi({
    page,
    per_page: 10,
    search,
    status: statusFilter === "ALL" ? undefined : statusFilter,
  });

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value as "Aktif" | "TidakAktif" | "Pembentukan" | "ALL");
    setPage(1);
  };

  const handleView = (koperasi: Koperasi) => {
    setSelectedKoperasi(koperasi);
    setShowViewDialog(true);
  };

  const handleEdit = (koperasi: Koperasi) => {
    setSelectedKoperasi(koperasi);
    setShowEditDialog(true);
  };

  const handleDelete = async (id: string) => {
    const success = await deleteKoperasi(id);
    if (success && data.length === 1 && page > 1) {
      setPage(page - 1);
    }
    return success;
  };

  const handleAdd = () => {
    setShowAddDialog(true);
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Manajemen Koperasi</h2>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Koperasi
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Koperasi</CardTitle>
          <CardDescription>Kelola semua koperasi yang terdaftar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Status</SelectItem>
                <SelectItem value="Aktif">Aktif</SelectItem>
                <SelectItem value="TidakAktif">Tidak Aktif</SelectItem>
                <SelectItem value="Pembentukan">Pembentukan</SelectItem>
              </SelectContent>
            </Select>

            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Cari berdasarkan nama koperasi..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyPress={handleKeyPress} className="pl-9" />
            </div>

            <Button onClick={handleSearch}>Cari</Button>
          </div>

          <KoperasiDataTable data={data} pagination={pagination} isLoading={isLoading} onPageChange={setPage} onView={handleView} onEdit={handleEdit} />
        </CardContent>
      </Card>

      <AddKoperasiDialog open={showAddDialog} onOpenChange={setShowAddDialog} onSubmit={createKoperasi} />

      <ViewKoperasiDialog open={showViewDialog} onOpenChange={setShowViewDialog} koperasi={selectedKoperasi} />

      <EditKoperasiDialog open={showEditDialog} onOpenChange={setShowEditDialog} koperasi={selectedKoperasi} onSubmit={updateKoperasi} onDelete={handleDelete} />
    </div>
  );
}
