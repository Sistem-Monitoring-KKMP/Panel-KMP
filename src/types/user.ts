export interface User {
  id: string;
  email: string;
  username: string;
  role: "admin" | "anggota" | "superadmin";
  anggota_id?: string;
  anggota?: {
    id: string;
    kode: string;
    nama: string;
    nik: string;
    telp?: string;
    status: "AKTIF" | "NON-AKTIF";
  };
  created_at: string;
  updated_at: string;
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: User[];
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
}