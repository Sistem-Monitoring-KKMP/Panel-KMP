import { useState, useEffect } from "react";
import { getFetcher, deleteFetcher, postFetcher, putFetcher } from "@/lib/api";
import type { UserResponse, User } from "@/types/user";
import { toast } from "sonner";

interface UseUserParams {
  page?: number;
  per_page?: number;
  search?: string;
  role?: "admin" | "anggota" | "superadmin";
}

export interface UserFormInput {
  email: string;
  username: string;
  password?: string;
  password_confirmation?: string;
  role: "admin" | "anggota" | "superadmin";
  anggota_id?: string;
}

export function useUser(params: UseUserParams = {}) {
  const [data, setData] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
    from: 0,
    to: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page.toString());
      if (params.per_page) queryParams.append("per_page", params.per_page.toString());
      if (params.search) queryParams.append("search", params.search);
      if (params.role) queryParams.append("role", params.role);

      const url = `/api/users${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const result = await getFetcher<UserResponse>(url);

      if (result.success && result.data) {
        setData(Array.isArray(result.data) ? result.data : []);
        if (result.pagination) {
          setPagination(result.pagination);
        }
      } else {
        throw new Error(result.message || "Failed to fetch users");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to fetch users";
      setError(errorMessage);
      setData([]);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (formInput: UserFormInput) => {
    try {
      const result = await postFetcher<User>("/api/users", formInput);

      toast.success("User berhasil ditambahkan");
      fetchUsers();
      return { success: true, data: result };
    } catch (err: any) {
      const errorMessage = err?.message || "Gagal menambahkan user";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateUser = async (id: string, formInput: Partial<UserFormInput>) => {
    try {
      const result = await putFetcher<User>(`/api/users/${id}`, formInput);

      toast.success("User berhasil diperbarui");
      fetchUsers();
      return { success: true, data: result };
    } catch (err: any) {
      const errorMessage = err?.message || "Gagal memperbarui user";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const result = await deleteFetcher(`/api/users/${id}`);

      if (result.success) {
        toast.success(result.message || "User berhasil dihapus");
        fetchUsers();
        return true;
      } else {
        throw new Error(result.message || "Failed to delete user");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to delete user";
      toast.error(errorMessage);
      return false;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [params.page, params.per_page, params.search, params.role]);

  return {
    data,
    pagination,
    isLoading,
    error,
    refetch: fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}
