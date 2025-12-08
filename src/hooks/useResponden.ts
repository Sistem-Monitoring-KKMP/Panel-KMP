import useSWR, { mutate } from "swr";
import { getFetcher, postFetcher, deleteFetcher } from "@/lib/api";
import type { Responden, RespondenFormInput } from "@/types/responden";
import { toast } from "sonner";

// ✅ Fetcher function untuk SWR
const fetcher = async (url: string): Promise<Responden | null> => {
  const result = await getFetcher(url); // ✅ Remove generic, let it infer

  // ✅ Handle the nested response structure
  if (result && result.success && result.data) {
    return result.data as Responden; // ✅ Type assertion
  }
  return null;
};

export function useResponden(koperasiId?: string) {
  const {
    data: responden = null,
    error,
    isLoading,
  } = useSWR<Responden | null>(koperasiId ? `/api/koperasi/${koperasiId}/responden` : null, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  const saveResponden = async (formInput: RespondenFormInput) => {
    if (!koperasiId) {
      toast.error("Koperasi ID tidak ditemukan");
      return { success: false, error: "Koperasi ID tidak ditemukan" };
    }

    try {
      const result = await postFetcher(`/api/koperasi/${koperasiId}/responden`, formInput);

      if (result.success) {
        toast.success(result.message || "Responden berhasil disimpan");
        mutate(`/api/koperasi/${koperasiId}/responden`);
        return { success: true, data: result.data };
      } else {
        throw new Error(result.message || "Gagal menyimpan responden");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Gagal menyimpan responden";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const deleteResponden = async () => {
    if (!koperasiId) {
      toast.error("Koperasi ID tidak ditemukan");
      return { success: false, error: "Koperasi ID tidak ditemukan" };
    }

    try {
      const result = await deleteFetcher(`/api/koperasi/${koperasiId}/responden`);

      if (result.success) {
        toast.success(result.message || "Responden berhasil dihapus");
        mutate(`/api/koperasi/${koperasiId}/responden`);
        return { success: true };
      } else {
        throw new Error(result.message || "Gagal menghapus responden");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Gagal menghapus responden";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    responden,
    isLoading,
    error: error?.message || null,
    saveResponden,
    deleteResponden,
  };
}
