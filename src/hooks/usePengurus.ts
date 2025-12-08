import useSWR, { mutate } from "swr";
import { getFetcher, postFetcher, putFetcher, deleteFetcher } from "@/lib/api";
import type { Pengurus, PengurusFormInput } from "@/types/pengurus";
import { toast } from "sonner";

const fetcher = async (url: string) => {
  const result = await getFetcher<{ success: boolean; message: string; data: Pengurus[] }>(url);

  if (result.success && Array.isArray(result.data)) {
    return result.data;
  }
  return [];
};

export function usePengurus(koperasiId?: string) {
  const {
    data: pengurusList = [],
    error,
    isLoading,
  } = useSWR(koperasiId ? `/api/koperasi/${koperasiId}/pengurus` : null, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  const addPengurus = async (formInput: PengurusFormInput) => {
    if (!koperasiId) {
      toast.error("Koperasi ID tidak ditemukan");
      return { success: false, error: "Koperasi ID tidak ditemukan" };
    }

    try {
      const result = await postFetcher<{ success: boolean; message: string; data?: Pengurus }>(`/api/koperasi/${koperasiId}/pengurus`, formInput);

      if (result.success) {
        toast.success(result.message || "Pengurus berhasil ditambahkan");
        mutate(`/api/koperasi/${koperasiId}/pengurus`);
        return { success: true, data: result.data };
      } else {
        throw new Error(result.message || "Gagal menambahkan pengurus");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Gagal menambahkan pengurus";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updatePengurus = async (id: number, formInput: PengurusFormInput) => {
    if (!koperasiId) {
      toast.error("Koperasi ID tidak ditemukan");
      return { success: false, error: "Koperasi ID tidak ditemukan" };
    }

    try {
      const result = await putFetcher<{ success: boolean; message: string; data?: Pengurus }>(`/api/koperasi/${koperasiId}/pengurus/${id}`, formInput);

      if (result.success) {
        toast.success(result.message || "Pengurus berhasil diperbarui");
        mutate(`/api/koperasi/${koperasiId}/pengurus`);
        return { success: true, data: result.data };
      } else {
        throw new Error(result.message || "Gagal memperbarui pengurus");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Gagal memperbarui pengurus";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const deletePengurus = async (id: number) => {
    if (!koperasiId) {
      toast.error("Koperasi ID tidak ditemukan");
      return { success: false, error: "Koperasi ID tidak ditemukan" };
    }

    try {
      const result = await deleteFetcher<{ success: boolean; message: string }>(`/api/koperasi/${koperasiId}/pengurus/${id}`);

      if (result.success) {
        toast.success(result.message || "Pengurus berhasil dihapus");
        mutate(`/api/koperasi/${koperasiId}/pengurus`);
        return { success: true };
      } else {
        throw new Error(result.message || "Gagal menghapus pengurus");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Gagal menghapus pengurus";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    pengurusList,
    isLoading,
    error: error?.message || null,
    addPengurus,
    updatePengurus,
    deletePengurus,
  };
}
