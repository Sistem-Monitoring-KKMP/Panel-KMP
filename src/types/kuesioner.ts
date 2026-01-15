// Types untuk Kuesioner Anggota

export interface QuestionnaireSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  questions: Question[];
  isCompleted: boolean;
  progress: number;
}

export interface Question {
  id: string;
  type: "radio" | "checkbox" | "number" | "text" | "select" | "scale";
  question: string;
  description?: string;
  options?: QuestionOption[];
  required?: boolean;
  min?: number;
  max?: number;
  placeholder?: string;
}

export interface QuestionOption {
  value: string | number;
  label: string;
}

// Form data untuk kuesioner bisnis
export interface KuesionerBisnisFormData {
  // Proyeksi Keuangan
  proyeksi_rugi_laba: boolean | null;
  proyeksi_arus_kas: boolean | null;

  // Hubungan Lembaga
  hubungan_lembaga: {
    lembaga: string;
    kemudahan: number | null;
    intensitas: number | null;
    dampak: number | null;
  }[];

  // Unit Usaha
  unit_usaha: {
    unit: string;
    volume_usaha: number | null;
    investasi: number | null;
    model_kerja: number | null;
    surplus: number | null;
    jumlah_sdm: number | null;
    jumlah_anggota: number | null;
  }[];

  // Keuangan
  keuangan: {
    pinjaman_bank: number | null;
    investasi: number | null;
    modal_kerja: number | null;
    simpanan_anggota: number | null;
    hibah: number | null;
    omset: number | null;
    operasional: number | null;
    surplus: number | null;
  };

  // Neraca Aktiva
  neraca_aktiva: {
    kas: number | null;
    piutang: number | null;
    aktiva_lancar: number | null;
    tanah: number | null;
    bangunan: number | null;
    kendaraan: number | null;
    aktiva_tetap: number | null;
    total_aktiva: number | null;
  };

  // Neraca Passiva
  neraca_passiva: {
    hutang_lancar: number | null;
    hutang_jangka_panjang: number | null;
    total_hutang: number | null;
    modal: number | null;
    total_passiva: number | null;
  };

  // Masalah Keuangan
  masalah_keuangan: {
    rugi_keseluruhan: boolean;
    rugi_sebagian: boolean;
    arus_kas: boolean;
    piutang: boolean;
    jatuh_tempo: boolean;
    kredit: boolean;
    penggelapan: boolean;
  };
}

// Form data untuk kuesioner organisasi
export interface KuesionerOrganisasiFormData {
  // Data Organisasi
  jumlah_pengurus: number | null;
  jumlah_pengawas: number | null;
  jumlah_karyawan: number | null;
  status: "Aktif" | "TidakAktif" | "Pembentukan" | "";
  total_anggota: number | null;
  anggota_aktif: number | null;
  anggota_tidak_aktif: number | null;

  // Tata Kelola
  general_manager: boolean;
  rapat_tepat_waktu: boolean;
  rapat_luar_biasa: boolean;
  pergantian_pengurus: boolean;
  pergantian_pengawas: boolean;

  // Rencana Strategis
  rencana_strategis: {
    visi: boolean;
    misi: boolean;
    rencana_strategis: boolean;
    sasaran_operasional: boolean;
    art: boolean;
  };

  // Prinsip Koperasi
  prinsip_koperasi: {
    sukarela_terbuka: number | null;
    demokratis: number | null;
    ekonomi: number | null;
    kemandirian: number | null;
    pendidikan: number | null;
    kerja_sama: number | null;
    kepedulian: number | null;
  };

  // Pelatihan
  pelatihan: {
    pelatihan: string;
    akumulasi: number | null;
  }[];

  // Rapat Koordinasi
  rapat_koordinasi: {
    rapat_pengurus: string;
    rapat_pengawas: string;
    rapat_gabungan: string;
    rapat_pengurus_karyawan: string;
    rapat_pengurus_anggota: string;
  };
}

export interface KuesionerProgress {
  bisnis: number;
  organisasi: number;
  total: number;
}

export interface KuesionerStatus {
  id?: number;
  anggota_id: number;
  koperasi_id: number;
  periode: string;
  status: "belum_mulai" | "sedang_mengisi" | "selesai";
  progress: KuesionerProgress;
  submitted_at?: string;
  created_at?: string;
  updated_at?: string;
}
