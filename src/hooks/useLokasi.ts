import useSWR, { mutate } from "swr";
import { getFetcher, postFetcher } from "@/lib/api";
import type { LokasiFormInput, Lokasi } from "@/types/lokasi";
import { toast } from "sonner";

// ✅ Fetcher function untuk SWR
const fetcher = async (url: string) => {
  const result = await getFetcher<{ success: boolean; message: string; data: Lokasi[] }>(url);

  if (result.success && Array.isArray(result.data) && result.data.length > 0) {
    return result.data[0];
  }
  return null;
};

const formDataFetcher = async (url: string) => {
  const result = await getFetcher<{ success: boolean; data: any[] }>(url);

  if (result.success && Array.isArray(result.data)) {
    return result.data;
  }
  return [];
};

// ✅ useLokasi dengan SWR - Simple banget!
export function useLokasi(koperasiId?: string) {
  const {
    data: lokasi,
    error,
    isLoading,
  } = useSWR(koperasiId ? `/api/koperasi/${koperasiId}/lokasi` : null, fetcher, {
    revalidateOnFocus: false, // Gak refetch pas window focus
    dedupingInterval: 60000, // Dedupe request dalam 60 detik
  });

  const saveLokasi = async (formInput: LokasiFormInput) => {
    if (!koperasiId) {
      toast.error("Koperasi ID tidak ditemukan");
      return { success: false, error: "Koperasi ID tidak ditemukan" };
    }

    try {
      const result = await postFetcher<{ success: boolean; message: string; data?: Lokasi }>(`/api/koperasi/${koperasiId}/lokasi`, formInput);

      if (result.success) {
        toast.success(result.message || "Lokasi berhasil disimpan");
        // ✅ Revalidate cache
        mutate(`/api/koperasi/${koperasiId}/lokasi`);
        return { success: true, data: result.data };
      } else {
        throw new Error(result.message || "Gagal menyimpan lokasi");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Gagal menyimpan lokasi";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    lokasi: lokasi || null,
    isLoading,
    error: error?.message || null,
    saveLokasi,
  };
}

// ✅ useFormData dengan SWR
export function useFormData() {
  const { data: kelurahan = [], isLoading: isLoadingKelurahan } = useSWR("/api/kelurahan?sort_by=nama&sort_order=asc", formDataFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5 menit (data jarang berubah)
  });

  const { data: kecamatan = [], isLoading: isLoadingKecamatan } = useSWR("/api/kecamatan?sort_by=nama&sort_order=asc", formDataFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5 menit
  });

  return {
    kelurahan,
    kecamatan,
    isLoading: isLoadingKelurahan || isLoadingKecamatan,
    error: null,
  };
}
