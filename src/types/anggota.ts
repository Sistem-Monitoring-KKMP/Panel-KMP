export interface Anggota {
  id: string;
  kode: string;
  nama: string;
  nik: string;
  telp: string;
  alamat: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  kelurahan: string;
  kecamatan: string;
  kota_kab: string;
  keterangan: string | null;
  jenis_kelamin: "L" | "P";
  pekerjaan: string;
  foto_anggota: string | null;
  ktp: string | null;
  npwp: string | null;
  nib: string | null;
  pas_foto: string | null;
  status: "AKTIF" | "NON-AKTIF";
  koperasi_id: string;
  created_at: string;
  updated_at: string;
  koperasi: any | null;
  foto_anggota_url: string | null;
  ktp_url: string | null;
  npwp_url: string | null;
  nib_url: string | null;
  pas_foto_url: string | null;
}

export interface AnggotaResponse {
  success: boolean;
  message: string;
  data: Anggota[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
}
