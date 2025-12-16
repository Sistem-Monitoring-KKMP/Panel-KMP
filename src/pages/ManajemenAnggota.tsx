import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AnggotaDataTable } from "@/components/AnggotaDataTable";
import { AddAnggotaDialog } from "@/components/AddAnggotaDialog";
import { useAnggota } from "@/hooks/useAnggota";
import { useAllKoperasi } from "@/hooks/useKoperasi";
import type { Anggota } from "@/types/anggota";
import { toast } from "sonner";

export function ManajemenAnggota() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedKoperasiIds, setSelectedKoperasiIds] = useState<string[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [openKoperasiCombobox, setOpenKoperasiCombobox] = useState(false);

  // Fetch all koperasi for filter (lazy load)
  const { data: koperasiList, isLoading: isLoadingKoperasi, hasFetched, refetch: fetchKoperasi } = useAllKoperasi();

  const { data, pagination, isLoading, createAnggota, deleteAnggota } = useAnggota({
    page,
    per_page: 10,
    search,
    koperasi_ids: selectedKoperasiIds.join(","),
  });

  // Fetch koperasi when combobox opens for the first time
  const handleOpenKoperasiCombobox = (open: boolean) => {
    setOpenKoperasiCombobox(open);
    if (open && !hasFetched && !isLoadingKoperasi) {
      fetchKoperasi();
    }
  };

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleToggleKoperasi = (koperasiId: string) => {
    setSelectedKoperasiIds((prev) => {
      if (prev.includes(koperasiId)) {
        return prev.filter((id) => id !== koperasiId);
      } else {
        return [...prev, koperasiId];
      }
    });
    setPage(1); // Reset to first page when filter changes
  };

  const handleRemoveKoperasi = (koperasiId: string) => {
    setSelectedKoperasiIds((prev) => prev.filter((id) => id !== koperasiId));
    setPage(1);
  };

  const handleClearKoperasiFilter = () => {
    setSelectedKoperasiIds([]);
    setPage(1);
  };

  const handleView = (anggota: Anggota) => {
    console.log("View anggota:", anggota);
    toast.info(`Lihat detail ${anggota.nama}`);
    // TODO: Implement view detail dialog or navigate to detail page
  };

  const handleEdit = (anggota: Anggota) => {
    console.log("Edit anggota:", anggota);
    toast.info(`Edit ${anggota.nama}`);
    // TODO: Implement edit dialog or navigate to edit page
  };

  const handleDelete = async (id: string) => {
    const success = await deleteAnggota(id);
    if (success && data.length === 1 && page > 1) {
      setPage(page - 1);
    }
  };

  const handleAdd = () => {
    setShowAddDialog(true);
  };

  // Get selected koperasi names for display
  const selectedKoperasiNames = koperasiList
    .filter((k) => selectedKoperasiIds.includes(k.id))
    .map((k) => ({
      id: k.id,
      name: k.nama,
    }));

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Manajemen Anggota</h2>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Anggota
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Anggota</CardTitle>
          <CardDescription>Kelola semua anggota koperasi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 space-y-3">
            <div className="flex gap-2">
              {/* Koperasi Multi-Select */}
              <Popover open={openKoperasiCombobox} onOpenChange={handleOpenKoperasiCombobox}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[250px] justify-start" disabled={isLoadingKoperasi}>
                    {isLoadingKoperasi ? (
                      <>
                        <Search className="mr-2 h-4 w-4 animate-spin" />
                        Memuat...
                      </>
                    ) : selectedKoperasiIds.length > 0 ? (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        {selectedKoperasiIds.length} Koperasi dipilih
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Filter Koperasi
                      </>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Cari koperasi..." />
                    <CommandList>
                      <CommandEmpty>Koperasi tidak ditemukan.</CommandEmpty>
                      <CommandGroup>
                        {koperasiList.map((koperasi) => (
                          <CommandItem key={koperasi.id} value={koperasi.nama} onSelect={() => handleToggleKoperasi(koperasi.id)}>
                            <Checkbox checked={selectedKoperasiIds.includes(koperasi.id)} onCheckedChange={() => handleToggleKoperasi(koperasi.id)} className="mr-2" />
                            <div className="flex flex-col">
                              <span className="text-sm">{koperasi.nama}</span>
                              <span className="text-xs text-muted-foreground">{koperasi.no_badan_hukum || "-"}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Cari berdasarkan nama, kode, atau NIK..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyPress={handleKeyPress} className="pl-9" />
              </div>

              <Button onClick={handleSearch}>Cari</Button>

              {/* Clear Filter Button */}
              {selectedKoperasiIds.length > 0 && (
                <Button variant="ghost" size="sm" onClick={handleClearKoperasiFilter}>
                  <X className="h-4 w-4 mr-1" />
                  Hapus Filter
                </Button>
              )}
            </div>

            {/* Selected Koperasi Badges */}
            {selectedKoperasiNames.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedKoperasiNames.map((koperasi) => (
                  <Badge key={koperasi.id} variant="secondary" className="px-3 py-1">
                    {koperasi.name}
                    <button onClick={() => handleRemoveKoperasi(koperasi.id)} className="ml-2 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <AnggotaDataTable data={data} pagination={pagination} isLoading={isLoading} onPageChange={setPage} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>

      <AddAnggotaDialog open={showAddDialog} onOpenChange={setShowAddDialog} onSubmit={createAnggota} />
    </div>
  );
}
