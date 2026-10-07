import React from 'react';
import { ActiveTab, SchoolConfig, User } from '../types';

interface SidebarProps {
  currentTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  config: SchoolConfig;
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  config,
  currentUser,
  isOpen,
  onClose,
  onLogout,
}) => {
  const isAdmin = currentUser.role === 'admin';

  const handleNav = (tab: ActiveTab) => {
    onSelectTab(tab);
    onClose();
  };

  const menuGuru: { tab: ActiveTab; label: string; icon: string; badge?: string }[] = [
    { tab: 'dashboard', label: 'Dashboard Statistik', icon: 'fa-chart-pie' },
    { tab: 'absensi', label: 'Input Absensi Siswa', icon: 'fa-clipboard-user' },
    { tab: 'penilaian', label: 'Penilaian (Leger)', icon: 'fa-file-pen' },
    { tab: 'jadwal', label: 'Jadwal Mengajar', icon: 'fa-calendar-days' },
    { tab: 'agenda', label: 'Jurnal Agenda Guru', icon: 'fa-book-bookmark' },
    { tab: 'bimbingan', label: 'Bimbingan Siswa (Wali)', icon: 'fa-hand-holding-heart' },
  ];

  const menuAdmin: { tab: ActiveTab; label: string; icon: string }[] = [
    { tab: 'rekap-wali', label: 'Rekap Guru & Wali', icon: 'fa-id-card-clip' },
    { tab: 'users', label: 'Manajemen User', icon: 'fa-users-gear' },
    { tab: 'import-siswa', label: 'Import Siswa Massal', icon: 'fa-file-import' },
    { tab: 'config', label: 'Konfigurasi Sekolah', icon: 'fa-sliders' },
  ];

  const codeTabs: { tab: ActiveTab; label: string; icon: string; badge: string }[] = [
    { tab: 'code-gas', label: 'Kode Backend (Kode.gs)', icon: 'fa-code', badge: 'GAS' },
    { tab: 'code-blogger', label: 'Kode Blogger (XML)', icon: 'fa-file-code', badge: 'XML' },
    { tab: 'panduan', label: 'Panduan Instalasi', icon: 'fa-book-open-reader', badge: 'TUTORIAL' },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#2C3E50] text-slate-100 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand & School Logo */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-sm">
              <img
                src={config.logoKiriUrl || 'https://api.iconify.design/emojione:school.svg'}
                alt="Logo Sekolah"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://api.iconify.design/emojione:school.svg';
                }}
              />
            </div>
            <div className="truncate">
              <h2 className="text-sm font-bold tracking-wide text-white truncate">
                {config.namaSekolah}
              </h2>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>NPSN: {config.npsn}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* User Profile Card (Avatar memakai Logo Sekolah dari Config sesuai instruksi) */}
        <div className="p-3 mx-3 my-2.5 rounded-xl bg-black/20 border border-white/5 flex items-center gap-3">
          <div className="relative shrink-0">
            <img
              src={config.logoKiriUrl || 'https://api.iconify.design/emojione:school.svg'}
              alt="Avatar User"
              className="w-10 h-10 rounded-full bg-white p-1 border-2 border-slate-400/30 object-contain shadow-xs"
            />
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#2C3E50] ${
                currentUser.role === 'admin' ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
            ></span>
          </div>
          <div className="overflow-hidden flex-1">
            <div className="text-xs font-bold text-white truncate" title={currentUser.nama}>
              {currentUser.nama}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span
                className={`text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded ${
                  currentUser.role === 'admin'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {currentUser.role}
              </span>
              {currentUser.waliKelas && currentUser.waliKelas !== '-' && (
                <span className="text-[10px] text-slate-300 truncate">
                  &bull; Wali {currentUser.waliKelas}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 text-xs font-medium scrollbar-thin scrollbar-thumb-white/10">
          {/* Section: Administrasi Guru */}
          <div>
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Menu Administrasi Guru
            </div>
            <nav className="space-y-0.5">
              {menuGuru.map((item) => {
                const isActive = currentTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => handleNav(item.tab)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md shadow-blue-900/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <i className={`fa-solid ${item.icon} w-4 text-center text-sm ${isActive ? 'text-white' : 'text-slate-400'}`}></i>
                    <span className="flex-1 truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Section: Menu Admin (Visible only to Admin or for inspection) */}
          <div>
            <div className="px-3 pb-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span>Menu Administrator</span>
              {!isAdmin && <span className="text-[9px] bg-white/10 px-1 rounded text-slate-300">Admin Only</span>}
            </div>
            <nav className="space-y-0.5">
              {menuAdmin.map((item) => {
                const isActive = currentTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => handleNav(item.tab)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md shadow-blue-900/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <i className={`fa-solid ${item.icon} w-4 text-center text-sm ${isActive ? 'text-white' : 'text-slate-400'}`}></i>
                    <span className="flex-1 truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Section: Kode & Integrasi Sistem */}
          <div>
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-amber-300/80">
              Kode Sumber &amp; Deploy
            </div>
            <nav className="space-y-0.5">
              {codeTabs.map((item) => {
                const isActive = currentTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => handleNav(item.tab)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold shadow-md shadow-amber-950/40'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <i className={`fa-solid ${item.icon} w-4 text-center text-sm ${isActive ? 'text-amber-300' : 'text-amber-400/80'}`}></i>
                    <span className="flex-1 truncate">{item.label}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/30 text-amber-300">
                      {item.badge}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer Sidebar with Logout */}
        <div className="p-3 border-t border-white/10 bg-black/15">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-600/30 border border-rose-500/30 rounded-lg transition-colors"
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>
    </>
  );
};
