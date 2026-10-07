import React from 'react';
import { ActiveTab, KelasItem, SchoolConfig, Siswa, User } from '../../types';

interface DashboardViewProps {
  config: SchoolConfig;
  currentUser: User;
  siswaList: Siswa[];
  usersList: User[];
  kelasList: KelasItem[];
  onNavigate: (tab: ActiveTab) => void;
  onOpenPdfModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  config,
  currentUser,
  siswaList,
  usersList,
  kelasList,
  onNavigate,
  onOpenPdfModal,
}) => {
  const totalGuru = usersList.filter(u => u.role === 'guru').length;
  const totalAdmin = usersList.filter(u => u.role === 'admin').length;
  const totalSiswa = siswaList.length;
  const totalRombel = kelasList.length;

  const todayStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2C3E50] via-[#34495e] to-[#1a252f] text-white p-6 md:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-slate-200 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Sistem Siap Digunakan &bull; Tahun Ajaran {config.tahunAjaran}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
              Selamat Datang, {currentUser.nama}!
            </h2>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
              Anda masuk sebagai <strong className="text-white uppercase">{currentUser.role}</strong>{' '}
              {currentUser.mapelAjar && `(Mata Pelajaran: ${currentUser.mapelAjar})`}.
              Kelola absensi, rekap nilai leger, agenda mengajar, hingga cetak dokumen PDF resmi dengan mudah.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            <button
              onClick={() => onNavigate('absensi')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs md:text-sm font-semibold shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <i className="fa-solid fa-clipboard-check"></i>
              <span>Input Presensi Hari Ini</span>
            </button>
            <button
              onClick={onOpenPdfModal}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center gap-2"
            >
              <i className="fa-solid fa-file-pdf text-rose-400"></i>
              <span>Cetak Laporan PDF</span>
            </button>
          </div>
        </div>

        {/* Decorative background grid and glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* 3 Main Statistics Cards (Sesuai Fitur Wajib: Jumlah Rombel, Guru, Siswa) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Rombel */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-200/80 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Jumlah Rombel
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
              <i className="fa-solid fa-school"></i>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#2C3E50]">{totalRombel}</span>
            <span className="text-xs text-slate-500 font-medium">Kelas Aktif</span>
          </div>
          <div className="mt-2 text-xs text-emerald-600 flex items-center gap-1 font-medium">
            <i className="fa-solid fa-circle-check text-[11px]"></i>
            <span>Tingkat X, XI, XII terdata</span>
          </div>
        </div>

        {/* Card 2: Guru */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-200/80 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Jumlah Guru
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
              <i className="fa-solid fa-chalkboard-user"></i>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#2C3E50]">{totalGuru}</span>
            <span className="text-xs text-slate-500 font-medium">Pendidik</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span className="font-semibold text-slate-700">+{totalAdmin} Admin</span>
            <span>terdaftar di akun sistem</span>
          </div>
        </div>

        {/* Card 3: Siswa */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-200/80 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Jumlah Siswa
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
              <i className="fa-solid fa-user-graduate"></i>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#2C3E50]">{totalSiswa}</span>
            <span className="text-xs text-slate-500 font-medium">Peserta Didik</span>
          </div>
          <div className="mt-2 text-xs text-blue-600 flex items-center gap-1 font-medium">
            <i className="fa-solid fa-database text-[11px]"></i>
            <span>Sinkron dengan DataSiswa</span>
          </div>
        </div>

        {/* Card 4: Tanggal & Waktu */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-200/80 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Kalender Kerja
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
              <i className="fa-solid fa-calendar-day"></i>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-sm font-bold text-[#2C3E50] leading-snug">{todayStr}</div>
            <div className="text-xs text-slate-500 mt-1">Semester {config.semester}</div>
          </div>
        </div>
      </div>

      {/* Profil Sekolah & Metadata Kop Surat */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200/80">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 p-2 flex items-center justify-center shrink-0">
              <img
                src={config.logoKiriUrl || 'https://api.iconify.design/emojione:school.svg'}
                alt="Logo Sekolah"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-bold text-[#2C3E50]">
                  {config.namaSekolah}
                </h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800">
                  {config.jenjang}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {config.alamat}, {config.kabupatenKota}, {config.provinsi}
              </p>
            </div>
          </div>
          <div className="text-left md:text-right">
            <div className="text-xs text-slate-500">Kepala Sekolah:</div>
            <div className="text-sm font-bold text-slate-800">{config.namaKepsek}</div>
            <div className="text-xs text-slate-500">NIP. {config.nipKepsek}</div>
          </div>
        </div>

        {/* Quick Shortcut Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
          <button
            onClick={() => onNavigate('absensi')}
            className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-left transition-all hover:border-slate-300"
          >
            <i className="fa-solid fa-clipboard-user text-blue-600 text-base mb-1 block"></i>
            <span className="text-xs font-bold text-slate-800 block">Presensi</span>
            <span className="text-[10px] text-slate-500">Input Harian</span>
          </button>
          <button
            onClick={() => onNavigate('penilaian')}
            className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-left transition-all hover:border-slate-300"
          >
            <i className="fa-solid fa-file-pen text-emerald-600 text-base mb-1 block"></i>
            <span className="text-xs font-bold text-slate-800 block">Penilaian</span>
            <span className="text-[10px] text-slate-500">Leger Nilai</span>
          </button>
          <button
            onClick={() => onNavigate('jadwal')}
            className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-left transition-all hover:border-slate-300"
          >
            <i className="fa-solid fa-calendar-days text-purple-600 text-base mb-1 block"></i>
            <span className="text-xs font-bold text-slate-800 block">Jadwal</span>
            <span className="text-[10px] text-slate-500">Jam Mengajar</span>
          </button>
          <button
            onClick={() => onNavigate('agenda')}
            className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-left transition-all hover:border-slate-300"
          >
            <i className="fa-solid fa-book-bookmark text-amber-600 text-base mb-1 block"></i>
            <span className="text-xs font-bold text-slate-800 block">Jurnal Guru</span>
            <span className="text-[10px] text-slate-500">Catatan KBM</span>
          </button>
          <button
            onClick={() => onNavigate('bimbingan')}
            className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-left transition-all hover:border-slate-300"
          >
            <i className="fa-solid fa-hand-holding-heart text-rose-600 text-base mb-1 block"></i>
            <span className="text-xs font-bold text-slate-800 block">Bimbingan</span>
            <span className="text-[10px] text-slate-500">Wali Kelas</span>
          </button>
          <button
            onClick={onOpenPdfModal}
            className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-left transition-all hover:border-slate-300"
          >
            <i className="fa-solid fa-print text-indigo-600 text-base mb-1 block"></i>
            <span className="text-xs font-bold text-slate-800 block">Cetak PDF</span>
            <span className="text-[10px] text-slate-500">Kop &amp; Barcode</span>
          </button>
        </div>
      </div>
    </div>
  );
};
