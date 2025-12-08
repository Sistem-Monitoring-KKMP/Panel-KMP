import { useState, useEffect } from "react";
import { getFetcher, deleteFetcher, postFormDataFetcher, putFormDataFetcher } from "@/lib/api";
import type { AnggotaResponse, Anggota } from "@/types/anggota";
import { toast } from "sonner";

interface UseAnggotaParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: "AKTIF" | "NON-AKTIF";
  koperasi_ids?: string;
}

export interface AnggotaFormInput {
  kode: string;
  nama: string;
  nik: string;
  telp?: string;
  alamat?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  kelurahan?: string;
  kecamatan?: string;
  kota_kab?: string;
  keterangan?: string;
  jenis_kelamin?: "L" | "P";
  pekerjaan?: string;
  status?: "AKTIF" | "NON-AKTIF";
  koperasi_id: string;
  foto_anggota?: FileList;
  ktp?: FileList;
  npwp?: FileList;
  nib?: FileList;
  pas_foto?: FileList;
}

export function useAnggota(params: UseAnggotaParams = {}) {
  const [data, setData] = useState<Anggota[]>([]);
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

  const fetchAnggota = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page.toString());
      if (params.per_page) queryParams.append("per_page", params.per_page.toString());
      if (params.search) queryParams.append("search", params.search);
      if (params.status) queryParams.append("status", params.status);
      if (params.koperasi_ids) queryParams.append("koperasi_ids", params.koperasi_ids);

      const url = `/api/users/anggota${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const result = await getFetcher<AnggotaResponse>(url);

      if (result.success && result.data) {
        setData(Array.isArray(result.data) ? result.data : []);
        if (result.pagination) {
          setPagination(result.pagination);
        }
      } else {
        throw new Error(result.message || "Failed to fetch anggota");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to fetch anggota";
      setError(errorMessage);
      setData([]);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const createAnggota = async (formInput: AnggotaFormInput) => {
    try {
      const formData = new FormData();

      // Append text fields
      Object.entries(formInput).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "" && !["foto_anggota", "ktp", "npwp", "nib", "pas_foto"].includes(key)) {
          formData.append(key, value.toString());
        }
      });

      // Append file fields
      const fileFields: Array<keyof AnggotaFormInput> = ["foto_anggota", "ktp", "npwp", "nib", "pas_foto"];
      fileFields.forEach((field) => {
        const fileList = formInput[field] as FileList | undefined;
        if (fileList && fileList.length > 0) {
          formData.append(field, fileList[0]);
        }
      });

      const result = await postFormDataFetcher<Anggota>("/api/users/anggota", formData);

      if (result.success) {
        toast.success(result.message || "Anggota berhasil ditambahkan");
        fetchAnggota(); // Refresh data
        return { success: true, data: result.data };
      } else {
        throw new Error(result.message || "Gagal menambahkan anggota");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Gagal menambahkan anggota";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateAnggota = async (id: string, formInput: AnggotaFormInput) => {
    try {
      const formData = new FormData();

      // Append text fields
      Object.entries(formInput).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "" && !["foto_anggota", "ktp", "npwp", "nib", "pas_foto"].includes(key)) {
          formData.append(key, value.toString());
        }
      });

      // Append file fields
      const fileFields: Array<keyof AnggotaFormInput> = ["foto_anggota", "ktp", "npwp", "nib", "pas_foto"];
      fileFields.forEach((field) => {
        const fileList = formInput[field] as FileList | undefined;
        if (fileList && fileList.length > 0) {
          formData.append(field, fileList[0]);
        }
      });

      const result = await putFormDataFetcher<Anggota>(`/api/users/anggota/${id}`, formData);

      if (result.success) {
        toast.success(result.message || "Anggota berhasil diperbarui");
        fetchAnggota(); // Refresh data
        return { success: true, data: result.data };
      } else {
        throw new Error(result.message || "Gagal memperbarui anggota");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Gagal memperbarui anggota";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const deleteAnggota = async (id: string) => {
    try {
      const result = await deleteFetcher(`/api/users/anggota/${id}`);

      if (result.success) {
        toast.success(result.message || "Anggota berhasil dihapus");
        fetchAnggota(); // Refresh data
        return true;
      } else {
        throw new Error(result.message || "Failed to delete anggota");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to delete anggota";
      toast.error(errorMessage);
      return false;
    }
  };

  useEffect(() => {
    fetchAnggota();
  }, [params.page, params.per_page, params.search, params.status, params.koperasi_ids]);

  return {
    data,
    pagination,
    isLoading,
    error,
    refetch: fetchAnggota,
    createAnggota,
    updateAnggota,
    deleteAnggota,
  };
}
