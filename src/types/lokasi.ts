export interface Kelurahan {
  id: number; // id() di migration = bigint
  nama: string; // string() di migration
  created_at?: string;
  updated_at?: string;
}

export interface Kecamatan {
  id: number; // id() di migration = bigint
  nama: string; // string() di migration
  created_at?: string;
  updated_at?: string;
}

export interface Lokasi {
  id: number; // id() di migration = bigint
  koperasi_id: number | null; // unsignedBigInteger()->nullable()
  kelurahan_id: number | null; // unsignedBigInteger()->nullable()
  kecamatan_id: number | null; // unsignedBigInteger()->nullable()
  alamat: string; // string() di migration
  longitude: string | null; // decimal(10,6)->nullable()
  latitude: string | null; // decimal(10,6)->nullable()
  created_at?: string;
  updated_at?: string;
  kelurahan?: Kelurahan;
  kecamatan?: Kecamatan;
}

export interface LokasiFormInput {
  kelurahan_id: string;
  kecamatan_id: string;
  alamat: string;
  longitude?: string;
  latitude?: string;
}

export interface LokasiResponse {
  success: boolean;
  message: string;
  data?: Lokasi | null;
}
