export interface Koperasi {
  id: string;
  nama: string;
  kontak?: string;
  no_badan_hukum?: string;
  tahun?: number;
  status: "Aktif" | "TidakAktif" | "Pembentukan";
  created_at?: string;
  updated_at?: string;
}

export interface KoperasiResponse {
  success: boolean;
  message: string;
  data?: Koperasi[];
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
}
