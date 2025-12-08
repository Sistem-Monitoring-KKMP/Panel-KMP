import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserDataTable } from "@/components/UserDataTable";
import { AddUserDialog } from "@/components/AddUserDialog";
import { useUser } from "@/hooks/useUser";
import type { User } from "@/types/user";
import { toast } from "sonner";

export function ManajemenUser() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { data, pagination, isLoading, createUser, deleteUser } = useUser({
    page,
    per_page: 10,
    search,
    role: roleFilter as any,
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

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value === "all" ? "" : value);
    setPage(1);
  };

  const handleView = (user: User) => {
    console.log("View user:", user);
    toast.info(`Lihat detail ${user.email}`);
    // TODO: Implement view detail dialog
  };

  const handleEdit = (user: User) => {
    console.log("Edit user:", user);
    toast.info(`Edit ${user.email}`);
    // TODO: Implement edit dialog
  };

  const handleDelete = async (id: string) => {
    const success = await deleteUser(id);
    if (success && data.length === 1 && page > 1) {
      setPage(page - 1);
    }
  };

  const handleAdd = () => {
    setShowAddDialog(true);
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Manajemen User</h2>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar User</CardTitle>
          <CardDescription>Kelola semua user sistem</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            {/* Role Filter */}
            <Select value={roleFilter || "all"} onValueChange={handleRoleFilterChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Role</SelectItem>
                <SelectItem value="superadmin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="anggota">Anggota</SelectItem>
              </SelectContent>
            </Select>

            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Cari berdasarkan email atau username..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyPress={handleKeyPress} className="pl-9" />
            </div>

            <Button onClick={handleSearch}>Cari</Button>
          </div>

          <UserDataTable data={data} pagination={pagination} isLoading={isLoading} onPageChange={setPage} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>

      <AddUserDialog open={showAddDialog} onOpenChange={setShowAddDialog} onSubmit={createUser} />
    </div>
  );
}
