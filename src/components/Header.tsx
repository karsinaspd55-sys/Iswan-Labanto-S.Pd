import React from 'react';
import { SchoolConfig, User } from '../types';

interface HeaderProps {
  config: SchoolConfig;
  currentUser: User;
  onOpenPdfModal: () => void;
  onOpenApiModal: () => void;
  onToggleSidebar: () => void;
  users: User[];
  onSwitchUser: (user: User) => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  currentUser,
  onOpenPdfModal,
  onOpenApiModal,
  onToggleSidebar,
  users,
  onSwitchUser,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            title="Toggle Menu"
          >
            <i className="fa-solid fa-bars text-lg"></i>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-bold text-[#2C3E50] tracking-tight">
                Sistem Administrasi Guru
              </h1>
              <span className="hidden sm:inline-block text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Platinum v1.0
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              {config.namaSekolah} &bull; TA {config.tahunAjaran} ({config.semester})
            </p>
          </div>
        </div>

        {/* Right: User switcher, API status, Cetak button */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Quick Role / User Switcher */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-1">
            <span className="text-xs text-slate-500 px-2 font-medium">Masuk Sebagai:</span>
            {users.map((u) => {
              const isSelected = u.id === currentUser.id;
              return (
                <button
                  key={u.id}
                  onClick={() => onSwitchUser(u)}
                  className={`text-xs px-2.5 py-1 rounded font-medium transition-all ${
                    isSelected
                      ? 'bg-[#2C3E50] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-white hover:text-slate-900'
                  }`}
                  title={`${u.nama} (${u.role.toUpperCase()})`}
                >
                  {u.role === 'admin' ? (
                    <><i className="fa-solid fa-shield-halved text-amber-300 mr-1"></i>Admin</>
                  ) : (
                    <><i className="fa-solid fa-chalkboard-user mr-1 text-sky-300"></i>{u.nama.split(' ')[0]}</>
                  )}
                </button>
              );
            })}
          </div>

          {/* Google Apps Script API Connection status */}
          <button
            onClick={onOpenApiModal}
            className={`text-xs px-3 py-1.5 rounded-full border flex items-center gap-1.5 font-medium transition-all ${
              config.gasApiUrl
                ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                : 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${config.gasApiUrl ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
            <span className="hidden sm:inline">
              {config.gasApiUrl ? 'GAS Terhubung' : 'Mode Demo / Set GAS'}
            </span>
          </button>

          {/* Cetak PDF button */}
          <button
            onClick={onOpenPdfModal}
            className="flex items-center gap-1.5 bg-[#2C3E50] hover:bg-[#1a252f] text-white text-xs md:text-sm font-semibold px-3 md:px-4 py-2 rounded-lg shadow-sm transition-all active:scale-95"
          >
            <i className="fa-solid fa-print"></i>
            <span>Cetak PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
