import { getFetcher, putFetcher, postFetcher } from "./api";
import type { ApiResponse } from "./api";
import type { KuesionerBisnisFormData, KuesionerOrganisasiFormData } from "@/types/kuesioner";
import Cookies from "js-cookie";

// Helper to get current user's koperasi_id
export async function getKoperasiId(): Promise<number> {
  const userStr = Cookies.get("user");
  if (!userStr) {
    throw new Error("User not found. Please login again.");
  }

  const user = JSON.parse(userStr);
  console.log("🔍 [getKoperasiId] User dari cookie:", user);

  // If koperasi_id exists in cookie, return it
  if (user.koperasi_id) {
    console.log("✅ [getKoperasiId] Koperasi ID ditemukan di cookie:", user.koperasi_id);
    return user.koperasi_id;
  }

  // If not, try to fetch from backend (for users with old cookies)
  console.log("⚠️ [getKoperasiId] Koperasi ID tidak ada di cookie, fetching dari backend...");
  try {
    const response: any = await getFetcher("/api/auth/me");

    console.log("📡 [getKoperasiId] Response dari /api/auth/me:", response);

    // Backend returns { success, message, user: { ...userData } }
    // But getFetcher wraps it in { success, message, data }
    // So we need to check both patterns
    const userData = response.user || response.data?.user || response.data;

    if (userData?.koperasi_id) {
      // Update cookie with koperasi_id
      const updatedUser = { ...user, koperasi_id: userData.koperasi_id };
      Cookies.set("user", JSON.stringify(updatedUser), { expires: 7, secure: false, sameSite: "lax", path: "/" });
      console.log("✅ [getKoperasiId] Koperasi ID berhasil diambil dari backend:", userData.koperasi_id);
      return userData.koperasi_id;
    }

    // If response doesn't have koperasi_id, throw detailed error
    console.error("❌ [getKoperasiId] Backend tidak mengembalikan koperasi_id:", response);
    throw new Error("Koperasi ID tidak ditemukan di akun Anda. Pastikan akun Anda terhubung dengan koperasi, atau hubungi administrator.");
  } catch (error: any) {
    console.error("❌ [getKoperasiId] Error fetching dari backend:", error);

    // If it's a network error or backend error
    if (error.response) {
      throw new Error(`Gagal mengambil data koperasi: ${error.response.data?.message || error.message}`);
    }

    // If it's the error we threw above
    if (error.message && error.message.includes("Koperasi ID tidak ditemukan")) {
      throw error;
    }

    throw new Error("Gagal mengambil data koperasi. Silakan logout dan login kembali.");
  }
}

// Get current period in YYYY-MM format
export function getCurrentPeriod(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

// Types for API responses
interface Performa {
  id: number;
  koperasi_id: number;
  periode: string;
  cdi: number | null;
  bdi: number | null;
  odi: number | null;
  kuadrant: number | null;
  created_at: string;
  updated_at: string;
  performa_bisnis?: PerformaBisnis;
  performa_organisasi?: PerformaOrganisasi;
}

interface PerformaBisnis {
  id: number;
  performa_id: number;
  proyeksi_rugi_laba: boolean;
  proyeksi_arus_kas: boolean;
  responden_id: number | null;
  hubungan_lembaga?: HubunganLembaga[];
  unit_usaha?: UnitUsaha[];
  keuangan?: Keuangan;
  neraca_aktiva?: NeracaAktiva;
  neraca_passiva?: NeracaPassiva;
  masalah_keuangan?: MasalahKeuangan;
}

interface PerformaOrganisasi {
  id: number;
  performa_id: number;
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
  responden_id: number | null;
  rencana_strategis?: RencanaStrategis;
  prinsip_koperasi?: PrinsipKoperasi;
  pelatihan?: Pelatihan[];
  rapat_koordinasi?: RapatKoordinasi;
}

interface HubunganLembaga {
  id: number;
  performa_bisnis_id: number;
  lembaga: string;
  kemudahan: number | null;
  intensitas: number | null;
  dampak: number | null;
}

interface UnitUsaha {
  id: number;
  performa_bisnis_id: number;
  unit: string;
  volume_usaha: number | null;
  investasi: number | null;
  model_kerja: number | null;
  surplus: number | null;
  jumlah_sdm: number | null;
  jumlah_anggota: number | null;
}

interface Keuangan {
  id: number;
  performa_bisnis_id: number;
  pinjaman_bank: number | null;
  investasi: number | null;
  modal_kerja: number | null;
  simpanan_anggota: number | null;
  hibah: number | null;
  omset: number | null;
  operasional: number | null;
  surplus: number | null;
}

interface NeracaAktiva {
  id: number;
  performa_bisnis_id: number;
  kas: number | null;
  piutang: number | null;
  aktiva_lancar: number | null;
  tanah: number | null;
  bangunan: number | null;
  kendaraan: number | null;
  aktiva_tetap: number | null;
  total_aktiva: number | null;
}

interface NeracaPassiva {
  id: number;
  performa_bisnis_id: number;
  hutang_lancar: number | null;
  hutang_jangka_panjang: number | null;
  total_hutang: number | null;
  modal: number | null;
  total_passiva: number | null;
}

interface MasalahKeuangan {
  id: number;
  performa_bisnis_id: number;
  rugi_keseluruhan: boolean;
  rugi_sebagian: boolean;
  arus_kas: boolean;
  piutang: boolean;
  jatuh_tempo: boolean;
  kredit: boolean;
  penggelapan: boolean;
}

interface RencanaStrategis {
  id: number;
  performa_organisasi_id: number;
  visi: boolean;
  misi: boolean;
  rencana_strategis: boolean;
  sasaran_operasional: boolean;
  art: boolean;
}

interface PrinsipKoperasi {
  id: number;
  performa_organisasi_id: number;
  sukarela_terbuka: number | null;
  demokratis: number | null;
  ekonomi: number | null;
  kemandirian: number | null;
  pendidikan: number | null;
  kerja_sama: number | null;
  kepedulian: number | null;
}

interface Pelatihan {
  id: number;
  performa_organisasi_id: number;
  pelatihan: string;
  akumulasi: number | null;
}

interface RapatKoordinasi {
  id: number;
  performa_organisasi_id: number;
  rapat_pengurus: string;
  rapat_pengawas: string;
  rapat_gabungan: string;
  rapat_pengurus_karyawan: string;
  rapat_pengurus_anggota: string;
}

// ==================== Performa API ====================

/**
 * Get or create performa for current period
 */
export async function getOrCreatePerforma(periode?: string): Promise<Performa> {
  const koperasiId = await getKoperasiId();
  const period = periode || getCurrentPeriod();

  try {
    // Try to get existing performa
    const response = await getFetcher<Performa>(`/api/koperasi/${koperasiId}/performa/${period}`);
    if (response.data) {
      return response.data;
    }
  } catch (error: any) {
    // If not found (404), create new performa
    if (error?.success === false && error?.message?.includes("not found")) {
      const createResponse = await postFetcher<ApiResponse<Performa>>(`/api/koperasi/${koperasiId}/performa`, {
        periode: period,
      });
      if (createResponse.data) {
        return createResponse.data;
      }
    }
    throw error;
  }

  throw new Error("Failed to get or create performa");
}

/**
 * Get all periods for current koperasi
 */
export async function getPerformaPeriods(): Promise<
  {
    id: number;
    periode: string;
    year: string;
    month: string;
    month_year: string;
    formatted: string;
    cdi: number | null;
    bdi: number | null;
    odi: number | null;
    kuadrant: number | null;
  }[]
> {
  const koperasiId = await getKoperasiId();
  const response = await getFetcher<any>(`/api/koperasi/${koperasiId}/performa/periods`);
  return response.data || [];
}

// ==================== Kuesioner Organisasi API ====================

/**
 * Load kuesioner organisasi data
 */
export async function loadKuesionerOrganisasi(periode?: string): Promise<KuesionerOrganisasiFormData | null> {
  try {
    const performa = await getOrCreatePerforma(periode);
    const koperasiId = await getKoperasiId();

    const response = await getFetcher<PerformaOrganisasi>(`/api/koperasi/${koperasiId}/performa/${performa.id}/organisasi`);

    if (!response.data) {
      return null;
    }

    const data = response.data;

    // Map API response to form data
    return {
      jumlah_pengurus: data.jumlah_pengurus,
      jumlah_pengawas: data.jumlah_pengawas,
      jumlah_karyawan: data.jumlah_karyawan,
      status: data.status || "",
      total_anggota: data.total_anggota,
      anggota_aktif: data.anggota_aktif,
      anggota_tidak_aktif: data.anggota_tidak_aktif,
      general_manager: data.general_manager,
      rapat_tepat_waktu: data.rapat_tepat_waktu,
      rapat_luar_biasa: data.rapat_luar_biasa,
      pergantian_pengurus: data.pergantian_pengurus,
      pergantian_pengawas: data.pergantian_pengawas,
      rencana_strategis: {
        visi: data.rencana_strategis?.visi || false,
        misi: data.rencana_strategis?.misi || false,
        rencana_strategis: data.rencana_strategis?.rencana_strategis || false,
        sasaran_operasional: data.rencana_strategis?.sasaran_operasional || false,
        art: data.rencana_strategis?.art || false,
      },
      prinsip_koperasi: {
        sukarela_terbuka: data.prinsip_koperasi?.sukarela_terbuka || null,
        demokratis: data.prinsip_koperasi?.demokratis || null,
        ekonomi: data.prinsip_koperasi?.ekonomi || null,
        kemandirian: data.prinsip_koperasi?.kemandirian || null,
        pendidikan: data.prinsip_koperasi?.pendidikan || null,
        kerja_sama: data.prinsip_koperasi?.kerja_sama || null,
        kepedulian: data.prinsip_koperasi?.kepedulian || null,
      },
      pelatihan:
        data.pelatihan?.map((p) => ({
          pelatihan: p.pelatihan,
          akumulasi: p.akumulasi,
        })) || [],
      rapat_koordinasi: {
        rapat_pengurus: data.rapat_koordinasi?.rapat_pengurus || "",
        rapat_pengawas: data.rapat_koordinasi?.rapat_pengawas || "",
        rapat_gabungan: data.rapat_koordinasi?.rapat_gabungan || "",
        rapat_pengurus_karyawan: data.rapat_koordinasi?.rapat_pengurus_karyawan || "",
        rapat_pengurus_anggota: data.rapat_koordinasi?.rapat_pengurus_anggota || "",
      },
    };
  } catch (error) {
    console.error("Error loading kuesioner organisasi:", error);
    return null;
  }
}

/**
 * Save kuesioner organisasi data
 */
export async function saveKuesionerOrganisasi(formData: KuesionerOrganisasiFormData, periode?: string): Promise<void> {
  const performa = await getOrCreatePerforma(periode);
  const koperasiId = await getKoperasiId();

  await putFetcher(`/api/koperasi/${koperasiId}/performa/${performa.id}/organisasi`, formData);
}

// ==================== Kuesioner Bisnis API ====================

/**
 * Load kuesioner bisnis data
 */
export async function loadKuesionerBisnis(periode?: string): Promise<KuesionerBisnisFormData | null> {
  try {
    const performa = await getOrCreatePerforma(periode);
    const koperasiId = await getKoperasiId();

    const response = await getFetcher<PerformaBisnis>(`/api/koperasi/${koperasiId}/performa/${performa.id}/bisnis`);

    if (!response.data) {
      return null;
    }

    const data = response.data;

    // Map API response to form data
    return {
      proyeksi_rugi_laba: data.proyeksi_rugi_laba ?? null,
      proyeksi_arus_kas: data.proyeksi_arus_kas ?? null,
      hubungan_lembaga:
        data.hubungan_lembaga?.map((h) => ({
          lembaga: h.lembaga,
          kemudahan: h.kemudahan,
          intensitas: h.intensitas,
          dampak: h.dampak,
        })) || [],
      unit_usaha:
        data.unit_usaha?.map((u) => ({
          unit: u.unit,
          volume_usaha: u.volume_usaha,
          investasi: u.investasi,
          model_kerja: u.model_kerja,
          surplus: u.surplus,
          jumlah_sdm: u.jumlah_sdm,
          jumlah_anggota: u.jumlah_anggota,
        })) || [],
      keuangan: {
        pinjaman_bank: data.keuangan?.pinjaman_bank || null,
        investasi: data.keuangan?.investasi || null,
        modal_kerja: data.keuangan?.modal_kerja || null,
        simpanan_anggota: data.keuangan?.simpanan_anggota || null,
        hibah: data.keuangan?.hibah || null,
        omset: data.keuangan?.omset || null,
        operasional: data.keuangan?.operasional || null,
        surplus: data.keuangan?.surplus || null,
      },
      neraca_aktiva: {
        kas: data.neraca_aktiva?.kas || null,
        piutang: data.neraca_aktiva?.piutang || null,
        aktiva_lancar: data.neraca_aktiva?.aktiva_lancar || null,
        tanah: data.neraca_aktiva?.tanah || null,
        bangunan: data.neraca_aktiva?.bangunan || null,
        kendaraan: data.neraca_aktiva?.kendaraan || null,
        aktiva_tetap: data.neraca_aktiva?.aktiva_tetap || null,
        total_aktiva: data.neraca_aktiva?.total_aktiva || null,
      },
      neraca_passiva: {
        hutang_lancar: data.neraca_passiva?.hutang_lancar || null,
        hutang_jangka_panjang: data.neraca_passiva?.hutang_jangka_panjang || null,
        total_hutang: data.neraca_passiva?.total_hutang || null,
        modal: data.neraca_passiva?.modal || null,
        total_passiva: data.neraca_passiva?.total_passiva || null,
      },
      masalah_keuangan: {
        rugi_keseluruhan: data.masalah_keuangan?.rugi_keseluruhan || false,
        rugi_sebagian: data.masalah_keuangan?.rugi_sebagian || false,
        arus_kas: data.masalah_keuangan?.arus_kas || false,
        piutang: data.masalah_keuangan?.piutang || false,
        jatuh_tempo: data.masalah_keuangan?.jatuh_tempo || false,
        kredit: data.masalah_keuangan?.kredit || false,
        penggelapan: data.masalah_keuangan?.penggelapan || false,
      },
    };
  } catch (error) {
    console.error("Error loading kuesioner bisnis:", error);
    return null;
  }
}

/**
 * Save kuesioner bisnis data
 */
export async function saveKuesionerBisnis(formData: KuesionerBisnisFormData, periode?: string): Promise<void> {
  const performa = await getOrCreatePerforma(periode);
  const koperasiId = await getKoperasiId();

  await putFetcher(`/api/koperasi/${koperasiId}/performa/${performa.id}/bisnis`, formData);
}

// ==================== Progress Calculation ====================

/**
 * Calculate progress for both kuesioner types
 */
export async function getKuesionerProgress(): Promise<{
  organisasi: number;
  bisnis: number;
  total: number;
}> {
  try {
    const [organisasiData, bisnisData] = await Promise.all([loadKuesionerOrganisasi(), loadKuesionerBisnis()]);

    const organisasiProgress = calculateOrganisasiProgress(organisasiData);
    const bisnisProgress = calculateBisnisProgress(bisnisData);
    const totalProgress = Math.round((organisasiProgress + bisnisProgress) / 2);

    return {
      organisasi: organisasiProgress,
      bisnis: bisnisProgress,
      total: totalProgress,
    };
  } catch (error) {
    console.error("Error calculating progress:", error);
    return { organisasi: 0, bisnis: 0, total: 0 };
  }
}

function calculateOrganisasiProgress(data: KuesionerOrganisasiFormData | null): number {
  if (!data) return 0;

  let filled = 0;
  let total = 20;

  if (data.jumlah_pengurus !== null) filled++;
  if (data.jumlah_pengawas !== null) filled++;
  if (data.jumlah_karyawan !== null) filled++;
  if (data.status !== "") filled++;
  if (data.total_anggota !== null) filled++;
  if (data.anggota_aktif !== null) filled++;
  if (data.anggota_tidak_aktif !== null) filled++;
  if (data.general_manager !== null) filled++;
  if (data.rapat_tepat_waktu !== null) filled++;
  if (data.rapat_luar_biasa !== null) filled++;
  if (data.pergantian_pengurus !== null) filled++;
  if (data.pergantian_pengawas !== null) filled++;

  // Rencana Strategis
  Object.values(data.rencana_strategis).forEach((v) => {
    if (v) filled++;
  });

  // Prinsip Koperasi (optional but counted)
  Object.values(data.prinsip_koperasi).forEach((v) => {
    if (v !== null) filled++;
  });

  return Math.round((filled / total) * 100);
}

function calculateBisnisProgress(data: KuesionerBisnisFormData | null): number {
  if (!data) return 0;

  let filled = 0;
  let total = 25;

  if (data.proyeksi_rugi_laba !== null) filled++;
  if (data.proyeksi_arus_kas !== null) filled++;
  if (data.hubungan_lembaga.length > 0) filled += 2;
  if (data.unit_usaha.length > 0) filled += 2;

  Object.values(data.keuangan).forEach((v) => {
    if (v !== null) filled++;
  });

  Object.values(data.neraca_aktiva).forEach((v) => {
    if (v !== null) filled++;
  });

  Object.values(data.neraca_passiva).forEach((v) => {
    if (v !== null) filled++;
  });

  // Masalah keuangan is optional but check if at least one is selected
  if (Object.values(data.masalah_keuangan).some((v) => v === true)) {
    filled++;
  }

  return Math.round((filled / total) * 100);
}
