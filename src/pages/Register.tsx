import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/";

const registerSchema = z
  .object({
    // Data Anggota
    nama: z.string().min(3, "Nama minimal 3 karakter"),
    nik: z.string().length(16, "NIK harus 16 digit").regex(/^\d+$/, "NIK harus berupa angka"),
    telp: z.string().min(10, "Nomor telepon minimal 10 digit"),
    alamat: z.string().min(10, "Alamat minimal 10 karakter"),
    tempat_lahir: z.string().min(3, "Tempat lahir minimal 3 karakter"),
    tanggal_lahir: z.string().refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      return birthDate < today;
    }, "Tanggal lahir harus kurang dari hari ini"),
    kelurahan: z.string().min(3, "Kelurahan minimal 3 karakter"),
    kecamatan: z.string().min(3, "Kecamatan minimal 3 karakter"),
    kota_kab: z.string().min(3, "Kota/Kabupaten minimal 3 karakter"),
    jenis_kelamin: z.enum(["L", "P"], { message: "Jenis kelamin harus dipilih" }),
    pekerjaan: z.string().min(3, "Pekerjaan minimal 3 karakter"),
    koperasi_id: z.string().min(1, "Koperasi harus dipilih"),

    // Data Akun User
    email: z.string().email("Alamat email tidak valid"),
    username: z
      .string()
      .min(4, "Username minimal 4 karakter")
      .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh huruf, angka, dan underscore"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    password_confirmation: z.string().min(6, "Konfirmasi password minimal 6 karakter"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Password dan konfirmasi password tidak cocok",
    path: ["password_confirmation"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

interface Koperasi {
  id: string;
  nama: string;
  kontak: string;
}

export function Register() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [koperasiList, setKoperasiList] = useState<Koperasi[]>([]);
  const [loadingKoperasi, setLoadingKoperasi] = useState(true);
  const [selectedKoperasi, setSelectedKoperasi] = useState<string>("");

  // Validation states
  const [emailCheck, setEmailCheck] = useState<{ checking: boolean; available: boolean | null }>({ checking: false, available: null });
  const [usernameCheck, setUsernameCheck] = useState<{ checking: boolean; available: boolean | null }>({ checking: false, available: null });
  const [nikCheck, setNikCheck] = useState<{ checking: boolean; available: boolean | null }>({ checking: false, available: null });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const watchEmail = watch("email");
  const watchUsername = watch("username");
  const watchNik = watch("nik");

  // Load koperasi list
  useEffect(() => {
    const fetchKoperasi = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}api/register/koperasi`);
        if (response.data.success) {
          setKoperasiList(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching koperasi:", error);
        toast.error("Gagal memuat daftar koperasi");
      } finally {
        setLoadingKoperasi(false);
      }
    };

    fetchKoperasi();
  }, []);

  // Check email availability
  useEffect(() => {
    const checkEmail = async () => {
      if (!watchEmail || watchEmail.length < 5 || !watchEmail.includes("@")) {
        setEmailCheck({ checking: false, available: null });
        return;
      }

      setEmailCheck({ checking: true, available: null });

      try {
        const response = await axios.post(`${API_BASE_URL}api/register/check-email`, {
          email: watchEmail,
        });
        setEmailCheck({ checking: false, available: response.data.available });
      } catch (error) {
        setEmailCheck({ checking: false, available: null });
      }
    };

    const timer = setTimeout(checkEmail, 500);
    return () => clearTimeout(timer);
  }, [watchEmail]);

  // Check username availability
  useEffect(() => {
    const checkUsername = async () => {
      if (!watchUsername || watchUsername.length < 4) {
        setUsernameCheck({ checking: false, available: null });
        return;
      }

      setUsernameCheck({ checking: true, available: null });

      try {
        const response = await axios.post(`${API_BASE_URL}api/register/check-username`, {
          username: watchUsername,
        });
        setUsernameCheck({ checking: false, available: response.data.available });
      } catch (error) {
        setUsernameCheck({ checking: false, available: null });
      }
    };

    const timer = setTimeout(checkUsername, 500);
    return () => clearTimeout(timer);
  }, [watchUsername]);

  // Check NIK availability
  useEffect(() => {
    const checkNik = async () => {
      if (!watchNik || watchNik.length !== 16) {
        setNikCheck({ checking: false, available: null });
        return;
      }

      setNikCheck({ checking: true, available: null });

      try {
        const response = await axios.post(`${API_BASE_URL}api/register/check-nik`, {
          nik: watchNik,
        });
        setNikCheck({ checking: false, available: response.data.available });
      } catch (error) {
        setNikCheck({ checking: false, available: null });
      }
    };

    const timer = setTimeout(checkNik, 500);
    return () => clearTimeout(timer);
  }, [watchNik]);

  const onSubmit = async (data: RegisterFormData) => {
    // Final validation check
    if (emailCheck.available === false) {
      toast.error("Email sudah terdaftar");
      return;
    }
    if (usernameCheck.available === false) {
      toast.error("Username sudah digunakan");
      return;
    }
    if (nikCheck.available === false) {
      toast.error("NIK sudah terdaftar");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/register`, data);

      if (response.data.success) {
        toast.success(response.data.message || "Registrasi berhasil! Silakan login.", {
          duration: 5000,
        });
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Registration error:", error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(errors[key][0]);
        });
      } else {
        toast.error(error.response?.data?.message || "Registrasi gagal. Silakan coba lagi.", {
          duration: 5000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl">Daftar Anggota Koperasi</CardTitle>
          <CardDescription>Lengkapi formulir di bawah ini untuk mendaftar sebagai anggota koperasi</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Pilih Koperasi */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Pilih Koperasi</h3>
              <div className="space-y-2">
                <Label htmlFor="koperasi_id">
                  Koperasi <span className="text-destructive">*</span>
                </Label>
                <Select
                  disabled={isSubmitting || loadingKoperasi}
                  value={selectedKoperasi}
                  onValueChange={(value) => {
                    setSelectedKoperasi(value);
                    setValue("koperasi_id", value, { shouldValidate: true });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingKoperasi ? "Memuat..." : "Pilih koperasi"} />
                  </SelectTrigger>
                  <SelectContent>
                    {koperasiList.map((koperasi) => (
                      <SelectItem key={koperasi.id} value={koperasi.id}>
                        {koperasi.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.koperasi_id && <p className="text-sm text-destructive">{errors.koperasi_id.message}</p>}
              </div>
            </div>

            {/* Data Pribadi */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Data Pribadi</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nama">
                    Nama Lengkap <span className="text-destructive">*</span>
                  </Label>
                  <Input id="nama" placeholder="Nama lengkap sesuai KTP" {...register("nama")} disabled={isSubmitting} />
                  {errors.nama && <p className="text-sm text-destructive">{errors.nama.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nik">
                    NIK <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input id="nik" placeholder="16 digit NIK" {...register("nik")} disabled={isSubmitting} maxLength={16} />
                    {nikCheck.checking && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
                    {!nikCheck.checking && nikCheck.available === true && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />}
                    {!nikCheck.checking && nikCheck.available === false && <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />}
                  </div>
                  {errors.nik && <p className="text-sm text-destructive">{errors.nik.message}</p>}
                  {nikCheck.available === false && <p className="text-sm text-destructive">NIK sudah terdaftar</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tempat_lahir">
                    Tempat Lahir <span className="text-destructive">*</span>
                  </Label>
                  <Input id="tempat_lahir" placeholder="Kota tempat lahir" {...register("tempat_lahir")} disabled={isSubmitting} />
                  {errors.tempat_lahir && <p className="text-sm text-destructive">{errors.tempat_lahir.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tanggal_lahir">
                    Tanggal Lahir <span className="text-destructive">*</span>
                  </Label>
                  <Input id="tanggal_lahir" type="date" {...register("tanggal_lahir")} disabled={isSubmitting} />
                  {errors.tanggal_lahir && <p className="text-sm text-destructive">{errors.tanggal_lahir.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jenis_kelamin">
                    Jenis Kelamin <span className="text-destructive">*</span>
                  </Label>
                  <Select disabled={isSubmitting} onValueChange={(value) => setValue("jenis_kelamin", value as "L" | "P", { shouldValidate: true })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Laki-laki</SelectItem>
                      <SelectItem value="P">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.jenis_kelamin && <p className="text-sm text-destructive">{errors.jenis_kelamin.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pekerjaan">
                    Pekerjaan <span className="text-destructive">*</span>
                  </Label>
                  <Input id="pekerjaan" placeholder="Pekerjaan saat ini" {...register("pekerjaan")} disabled={isSubmitting} />
                  {errors.pekerjaan && <p className="text-sm text-destructive">{errors.pekerjaan.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telp">
                    Nomor Telepon <span className="text-destructive">*</span>
                  </Label>
                  <Input id="telp" placeholder="Nomor telepon/HP" {...register("telp")} disabled={isSubmitting} />
                  {errors.telp && <p className="text-sm text-destructive">{errors.telp.message}</p>}
                </div>
              </div>
            </div>

            {/* Alamat */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Alamat</h3>

              <div className="space-y-2">
                <Label htmlFor="alamat">
                  Alamat Lengkap <span className="text-destructive">*</span>
                </Label>
                <Textarea id="alamat" placeholder="Jalan, RT/RW, No. Rumah" {...register("alamat")} disabled={isSubmitting} rows={3} />
                {errors.alamat && <p className="text-sm text-destructive">{errors.alamat.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kelurahan">
                    Kelurahan/Desa <span className="text-destructive">*</span>
                  </Label>
                  <Input id="kelurahan" placeholder="Kelurahan/Desa" {...register("kelurahan")} disabled={isSubmitting} />
                  {errors.kelurahan && <p className="text-sm text-destructive">{errors.kelurahan.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kecamatan">
                    Kecamatan <span className="text-destructive">*</span>
                  </Label>
                  <Input id="kecamatan" placeholder="Kecamatan" {...register("kecamatan")} disabled={isSubmitting} />
                  {errors.kecamatan && <p className="text-sm text-destructive">{errors.kecamatan.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kota_kab">
                    Kota/Kabupaten <span className="text-destructive">*</span>
                  </Label>
                  <Input id="kota_kab" placeholder="Kota/Kabupaten" {...register("kota_kab")} disabled={isSubmitting} />
                  {errors.kota_kab && <p className="text-sm text-destructive">{errors.kota_kab.message}</p>}
                </div>
              </div>
            </div>

            {/* Data Akun */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Data Akun</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input id="email" type="email" placeholder="email@contoh.com" {...register("email")} disabled={isSubmitting} />
                    {emailCheck.checking && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
                    {!emailCheck.checking && emailCheck.available === true && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />}
                    {!emailCheck.checking && emailCheck.available === false && <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />}
                  </div>
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                  {emailCheck.available === false && <p className="text-sm text-destructive">Email sudah terdaftar</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">
                    Username <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input id="username" placeholder="Username untuk login" {...register("username")} disabled={isSubmitting} />
                    {usernameCheck.checking && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
                    {!usernameCheck.checking && usernameCheck.available === true && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />}
                    {!usernameCheck.checking && usernameCheck.available === false && <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />}
                  </div>
                  {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
                  {usernameCheck.available === false && <p className="text-sm text-destructive">Username sudah digunakan</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="Minimal 6 karakter" {...register("password")} disabled={isSubmitting} className="pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" disabled={isSubmitting}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">
                    Konfirmasi Password <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input id="password_confirmation" type={showPasswordConfirm ? "text" : "password"} placeholder="Ulangi password" {...register("password_confirmation")} disabled={isSubmitting} className="pr-10" />
                    <button
                      type="button"
                      onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={isSubmitting}
                    >
                      {showPasswordConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password_confirmation && <p className="text-sm text-destructive">{errors.password_confirmation.message}</p>}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={isSubmitting || emailCheck.available === false || usernameCheck.available === false || nikCheck.available === false}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mendaftar...
                  </>
                ) : (
                  "Daftar"
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/login")} disabled={isSubmitting}>
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Masuk di sini
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
