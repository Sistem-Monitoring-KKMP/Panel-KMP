import { useState, useEffect, useCallback } from "react";
import { getFetcher, postFetcher, putFetcher, deleteFetcher } from "@/lib/api";
import type { KoperasiResponse, Koperasi } from "@/types/koperasi";
import { toast } from "sonner";

interface UseKoperasiParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: "Aktif" | "TidakAktif" | "Pembentukan";
  sort_by?: "nama" | "kontak" | "created_at";
  sort_order?: "asc" | "desc";
  returnAll?: boolean;
}

export interface KoperasiFormInput {
  nama: string;
  kontak?: string;
  no_badan_hukum?: string;
  tahun?: number;
  status?: "Aktif" | "TidakAktif" | "Pembentukan";
}

export function useKoperasi(params: UseKoperasiParams = {}) {
  const [data, setData] = useState<Koperasi[]>([]);
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

  const fetchKoperasi = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page.toString());
      if (params.per_page) queryParams.append("per_page", params.per_page.toString());
      if (params.search) queryParams.append("search", params.search);
      if (params.status) queryParams.append("status", params.status);
      if (params.sort_by) queryParams.append("sort_by", params.sort_by);
      if (params.sort_order) queryParams.append("sort_order", params.sort_order);
      if (params.returnAll) queryParams.append("returnAll", "true");

      const url = `/api/koperasi${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const result = await getFetcher<KoperasiResponse>(url);

      if (result.success && result.data) {
        setData(Array.isArray(result.data) ? result.data : []);
        if (result.pagination) {
          setPagination(result.pagination);
        }
      } else {
        throw new Error(result.message || "Failed to fetch koperasi");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to fetch koperasi";
      setError(errorMessage);
      setData([]);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const createKoperasi = async (formInput: KoperasiFormInput) => {
    try {
      const result = await postFetcher<KoperasiResponse>("/api/koperasi", formInput);

      if (result.success) {
        toast.success(result.message || "Koperasi berhasil ditambahkan");
        fetchKoperasi();
        return { success: true, data: result.data };
      } else {
        throw new Error(result.message || "Gagal menambahkan koperasi");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Gagal menambahkan koperasi";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateKoperasi = async (id: string, formInput: KoperasiFormInput) => {
    try {
      const result = await putFetcher<KoperasiResponse>(`/api/koperasi/${id}`, formInput);

      if (result.success) {
        toast.success(result.message || "Koperasi berhasil diperbarui");
        fetchKoperasi();
        return { success: true, data: result.data };
      } else {
        throw new Error(result.message || "Gagal memperbarui koperasi");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Gagal memperbarui koperasi";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const deleteKoperasi = async (id: string) => {
    try {
      const result = await deleteFetcher(`/api/koperasi/${id}`);

      if (result.success) {
        toast.success(result.message || "Koperasi berhasil dihapus");
        fetchKoperasi();
        return true;
      } else {
        throw new Error(result.message || "Failed to delete koperasi");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to delete koperasi";
      toast.error(errorMessage);
      return false;
    }
  };

  useEffect(() => {
    fetchKoperasi();
  }, [params.page, params.per_page, params.search, params.status, params.sort_by, params.sort_order, params.returnAll]);

  return {
    data,
    pagination,
    isLoading,
    error,
    refetch: fetchKoperasi,
    createKoperasi,
    updateKoperasi,
    deleteKoperasi,
  };
}

export function useAllKoperasi(options?: { autoFetch?: boolean }) {
  const [data, setData] = useState<Koperasi[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchAllKoperasi = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const url = `/api/koperasi?returnAll=true&sort_by=nama&sort_order=asc`;
      const result = await getFetcher<KoperasiResponse>(url);

      if (result.success && result.data) {
        setData(Array.isArray(result.data) ? result.data : []);
        setHasFetched(true);
      } else {
        throw new Error(result.message || "Failed to fetch koperasi");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to fetch koperasi";
      setError(errorMessage);
      setData([]);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (options?.autoFetch) {
      fetchAllKoperasi();
    }
  }, [options?.autoFetch, fetchAllKoperasi]);

  return {
    data,
    isLoading,
    error,
    hasFetched,
    refetch: fetchAllKoperasi,
  };
}
