export interface LatarBelakang {
  id: number;
  pengurus_id: number;
  latarbelakang: "koperasi" | "bisnis" | "ASN" | "militer/polisi" | "politik" | "organisasi";
  created_at?: string;
  updated_at?: string;
}

export interface Pengurus {
  id: number;
  koperasi_id: number;
  nama: string;
  jabatan: "Ketua" | "WakilBU" | "WakilBA" | "Sekretaris" | "Bendahara" | "KetuaPengawas" | "Pengawas" | "GeneralManager";
  jenis_kelamin: "L" | "P";
  usia?: number;
  pendidikan_koperasi: boolean;
  pendidikan_ekonomi: boolean;
  pelatihan_koperasi: boolean;
  pelatihan_bisnis: boolean;
  pelatihan_lainnya: boolean;
  tingkat_pendidikan?: "sd" | "sltp" | "slta" | "diploma" | "sarjana" | "pascasarjana";
  keaktifan_kkmp?: "aktif" | "cukup aktif" | "kurang aktif";
  latar_belakang?: LatarBelakang[];
  created_at?: string;
  updated_at?: string;
}

export interface PengurusFormInput {
  nama: string;
  jabatan: string;
  jenis_kelamin: string;
  usia?: string;
  pendidikan_koperasi: boolean;
  pendidikan_ekonomi: boolean;
  pelatihan_koperasi: boolean;
  pelatihan_bisnis: boolean;
  pelatihan_lainnya: boolean;
  tingkat_pendidikan?: string;
  keaktifan_kkmp?: string;
  latar_belakang: string[];
}
