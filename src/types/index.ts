export type UserRole = 'admin' | 'guru';

export interface User {
  id: string;
  username: string;
  password?: string;
  nama: string;
  nip: string;
  role: UserRole;
  mapelAjar?: string;
  waliKelas?: string;
  status: 'Aktif' | 'Nonaktif';
}

export interface SchoolConfig {
  namaSekolah: string;
  npsn: string;
  jenjang: string;
  alamat: string;
  kelurahanDesa: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  kodePos: string;
  noTelp: string;
  email: string;
  website: string;
  namaKepsek: string;
  nipKepsek: string;
  tahunAjaran: string;
  semester: 'Ganjil' | 'Genap';
  logoKiriUrl: string;
  logoKananUrl: string;
  gasApiUrl: string;
}

export interface Siswa {
  nis: string;
  nisn: string;
  nama: string;
  kelas: string;
  jenisKelamin: 'L' | 'P';
  agama: string;
  noHp?: string;
  status: 'Aktif' | 'Lulus' | 'Pindah';
}

export interface KelasItem {
  id: string;
  nama: string;
  waliKelas: string;
  tingkat: string;
  jurusan: string;
}

export interface MapelItem {
  id: string;
  kode: string;
  nama: string;
  kkm: number;
  kelompok: string;
}

export interface AbsensiRecord {
  id: string;
  tanggal: string; // YYYY-MM-DD
  kelas: string;
  mapel: string;
  guruNip: string;
  guruNama: string;
  detail: {
    nis: string;
    nama: string;
    status: 'H' | 'S' | 'I' | 'A'; // Hadir, Sakit, Izin, Alpa
    keterangan?: string;
  }[];
}

export interface NilaiRecord {
  id: string;
  nis: string;
  namaSiswa: string;
  kelas: string;
  mapel: string;
  tp1: number;
  tp2: number;
  tp3: number;
  uts: number;
  uas: number;
  nilaiAkhir: number;
  predikat: 'A' | 'B' | 'C' | 'D';
}

export interface AgendaRecord {
  id: string;
  tanggal: string;
  jamKe: string;
  kelas: string;
  mapel: string;
  guruNip: string;
  guruNama: string;
  materiPokok: string;
  kegiatanPembelajaran: string;
  kendalaCatatan: string;
  absensiRingkasan: string;
}

export interface BimbinganRecord {
  id: string;
  tanggal: string;
  nis: string;
  namaSiswa: string;
  kelas: string;
  guruWali: string;
  permasalahan: string;
  tindakLanjut: string;
  statusPenanganan: 'Selesai' | 'Proses' | 'Pemanggilan Orang Tua';
}

export interface JadwalMengajarItem {
  id: string;
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  jamKe: string;
  waktu: string;
  kelas: string;
  mapel: string;
  guruNip: string;
  guruNama: string;
  ruang: string;
}

export type ActiveTab =
  | 'dashboard'
  | 'absensi'
  | 'penilaian'
  | 'jadwal'
  | 'agenda'
  | 'bimbingan'
  | 'rekap-wali'
  | 'users'
  | 'import-siswa'
  | 'config'
  | 'code-gas'
  | 'code-blogger'
  | 'panduan';
