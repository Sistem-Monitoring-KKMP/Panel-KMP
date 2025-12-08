import useSWR, { mutate } from "swr";
import { getFetcher, postFetcher, putFetcher, deleteFetcher } from "@/lib/api";
import type { Performa, PerformaFormInput, PeriodOption } from "@/types/performa";
import { toast } from "sonner";

// Fetcher for periods list
const periodsFetcher = async (url: string): Promise<PeriodOption[]> => {
  const result = await getFetcher<{ success: boolean; message: string; data: PeriodOption[] }>(url);

  if (result.success && Array.isArray(result.data)) {
    return result.data;
  }
  return [];
};

// Fetcher for single performa
const performaFetcher = async (url: string): Promise<Performa | null> => {
  const result = await getFetcher<{ success: boolean; message: string; data: Performa }>(url);

  console.log("Raw API response:", result);

  if (result && result.success && result.data) {
    console.log("Returning performa data:", result.data);
    return result.data;
  }
  return null;
};

export function usePerformaPeriods(koperasiId?: string) {
  const {
    data: periods = [],
    error,
    isLoading,
  } = useSWR<PeriodOption[]>(koperasiId ? `/api/koperasi/${koperasiId}/performa/periods` : null, periodsFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  return {
    periods,
    isLoading,
    error: error?.message || null,
  };
}

export function usePerforma(koperasiId?: string, period?: string) {
  const {
    data: performa = null,
    error,
    isLoading,
  } = useSWR<Performa | null>(koperasiId && period ? `/api/koperasi/${koperasiId}/performa/${period}` : null, performaFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  const savePerforma = async (formInput: PerformaFormInput) => {
    if (!koperasiId) {
      toast.error("Koperasi ID tidak ditemukan");
      return { success: false, error: "Koperasi ID tidak ditemukan" };
    }

    try {
      const result = await postFetcher<{ success: boolean; message: string; data?: Performa }>(`/api/koperasi/${koperasiId}/performa`, formInput);

      if (result.success) {
        toast.success(result.message || "Performa berhasil disimpan");
        // Revalidate both periods list and current performa
        mutate(`/api/koperasi/${koperasiId}/performa/periods`);
        if (period) {
          mutate(`/api/koperasi/${koperasiId}/performa/${period}`);
        }
        return { success: true, data: result.data };
      } else {
        throw new Error(result.message || "Gagal menyimpan performa");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Gagal menyimpan performa";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const savePerformaBisnis = async (performaId: number, formData: any) => {
    if (!koperasiId) {
      toast.error("Koperasi ID tidak ditemukan");
      return { success: false, error: "Koperasi ID tidak ditemukan" };
    }

    try {
      const result = await putFetcher<{ success: boolean; message: string }>(`/api/koperasi/${koperasiId}/performa/${performaId}/bisnis`, formData);

      if (result.success) {
        toast.success(result.message || "Performa Bisnis berhasil disimpan");
        // Revalidate performa data
        if (period) {
          mutate(`/api/koperasi/${koperasiId}/performa/${period}`);
        }
        return { success: true };
      } else {
        throw new Error(result.message || "Gagal menyimpan performa bisnis");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Gagal menyimpan performa bisnis";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const savePerformaOrganisasi = async (performaId: number, formData: any) => {
    if (!koperasiId) {
      toast.error("Koperasi ID tidak ditemukan");
      return { success: false, error: "Koperasi ID tidak ditemukan" };
    }

    try {
      const result = await putFetcher<{ success: boolean; message: string }>(`/api/koperasi/${koperasiId}/performa/${performaId}/organisasi`, formData);

      if (result.success) {
        toast.success(result.message || "Performa Organisasi berhasil disimpan");
        // Revalidate performa data
        if (period) {
          mutate(`/api/koperasi/${koperasiId}/performa/${period}`);
        }
        return { success: true };
      } else {
        throw new Error(result.message || "Gagal menyimpan performa organisasi");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Gagal menyimpan performa organisasi";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const deletePerforma = async (performaId: number) => {
    if (!koperasiId) {
      toast.error("Koperasi ID tidak ditemukan");
      return { success: false, error: "Koperasi ID tidak ditemukan" };
    }

    try {
      const result = await deleteFetcher<{ success: boolean; message: string }>(`/api/koperasi/${koperasiId}/performa/${performaId}`);

      if (result.success) {
        toast.success(result.message || "Performa berhasil dihapus");
        mutate(`/api/koperasi/${koperasiId}/performa/periods`);
        return { success: true };
      } else {
        throw new Error(result.message || "Gagal menghapus performa");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Gagal menghapus performa";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    performa,
    isLoading,
    error: error?.message || null,
    savePerforma,
    savePerformaBisnis,
    savePerformaOrganisasi,
    deletePerforma,
  };
}
