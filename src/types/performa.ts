export interface Keuangan {
  id?: number;
  performa_bisnis_id?: number;
  pinjaman_bank: number | null;
  investasi: number | null;
  modal_kerja: number | null;
  simpanan_anggota: number | null;
  hibah: number | null;
  omset: number | null;
  operasional: number | null;
  surplus: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface NeracaAktiva {
  id?: number;
  performa_bisnis_id?: number;
  kas: number | null;
  piutang: number | null;
  aktiva_lancar: number | null;
  tanah: number | null;
  bangunan: number | null;
  kendaraan: number | null;
  aktiva_tetap: number | null;
  total_aktiva: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface NeracaPassiva {
  id?: number;
  performa_bisnis_id?: number;
  hutang_lancar: number | null;
  hutang_jangka_panjang: number | null;
  total_hutang: number | null;
  modal: number | null;
  total_passiva: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface MasalahKeuangan {
  id?: number;
  performa_bisnis_id?: number;
  rugi_keseluruhan: boolean;
  rugi_sebagian: boolean;
  arus_kas: boolean;
  piutang: boolean;
  jatuh_tempo: boolean;
  kredit: boolean;
  penggelapan: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface HubunganLembaga {
  id?: number;
  performa_bisnis_id?: number;
  lembaga: string;
  kemudahan: number | null;
  intensitas: number | null;
  dampak: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface UnitUsaha {
  id?: number;
  performa_bisnis_id?: number;
  unit: string;
  volume_usaha: number | null;
  investasi: number | null;
  model_kerja: number | null;
  surplus: number | null;
  jumlah_sdm: number | null;
  jumlah_anggota: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface PerformaBisnis {
  id: number;
  performa_id: number;
  proyeksi_rugi_laba: boolean;
  proyeksi_arus_kas: boolean;
  responden_id: number | null;
  created_at: string;
  updated_at: string;
  // Support both snake_case (from API) and camelCase (frontend)
  hubungan_lembaga?: HubunganLembaga[];
  hubunganLembaga?: HubunganLembaga[];
  unit_usaha?: UnitUsaha[];
  unitUsaha?: UnitUsaha[];
  keuangan?: Keuangan;
  neraca_aktiva?: NeracaAktiva;
  neracaAktiva?: NeracaAktiva;
  neraca_passiva?: NeracaPassiva;
  neracaPassiva?: NeracaPassiva;
  masalah_keuangan?: MasalahKeuangan;
  masalahKeuangan?: MasalahKeuangan;
}

export interface RencanaStrategis {
  visi: boolean;
  misi: boolean;
  rencana_strategis: boolean;
  sasaran_operasional: boolean;
  art: boolean;
}

export interface PrinsipKoperasi {
  sukarela_terbuka: number | null;
  demokratis: number | null;
  ekonomi: number | null;
  kemandirian: number | null;
  pendidikan: number | null;
  kerja_sama: number | null;
  kepedulian: number | null;
}

export interface Pelatihan {
  id?: number;
  performa_organisasi_id?: number;
  pelatihan: string;
  akumulasi: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface RapatKoordinasi {
  rapat_pengurus: string;
  rapat_pengawas: string;
  rapat_gabungan: string;
  rapat_pengurus_karyawan: string;
  rapat_pengurus_anggota: string;
}

export interface PerformaOrganisasi {
  id: number;
  performa_id: number;
  responden_id: number | null;
  jumlah_pengurus: number | null;
  jumlah_pengawas: number | null;
  jumlah_karyawan: number | null;
  status: "Aktif" | "TidakAktif" | "Pembentukan" | null;
  total_anggota: number | null;
  anggota_aktif: number | null;
  anggota_tidak_aktif: number | null;
  general_manager: boolean;
  rapat_tepat_waktu: boolean;
  rapat_luar_biasa: boolean;
  pergantian_pengurus: boolean;
  pergantian_pengawas: boolean;
  created_at: string;
  updated_at: string;
  rencana_strategis: RencanaStrategis | null;
  prinsip_koperasi: PrinsipKoperasi | null;
  pelatihan: Pelatihan[];
  rapat_koordinasi: RapatKoordinasi | null;
}

export interface Performa {
  id: number;
  koperasi_id: number;
  cdi: number | null;
  bdi: number | null;
  odi: number | null;
  kuadrant: number | null;
  periode: string;
  created_at: string;
  updated_at: string;
  performa_bisnis?: PerformaBisnis;
  performa_organisasi?: PerformaOrganisasi;
}

export interface PerformaFormInput {
  periode: string;
  cdi: number | null;
  bdi: number | null;
  odi: number | null;
  kuadrant: number | null;
}

export interface PeriodOption {
  year: string;
  cdi: number | null;
  has_data: boolean;
}
