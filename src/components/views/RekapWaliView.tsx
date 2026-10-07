import React from 'react';
import { KelasItem, Siswa, User } from '../../types';

interface RekapWaliViewProps {
  usersList: User[];
  kelasList: KelasItem[];
  siswaList: Siswa[];
  onOpenPdfModal: () => void;
}

export const RekapWaliView: React.FC<RekapWaliViewProps> = ({
  usersList,
  kelasList,
  siswaList,
  onOpenPdfModal,
}) => {
  const guruList = usersList.filter(u => u.role === 'guru');

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-[#2C3E50] flex items-center gap-2">
              <i className="fa-solid fa-id-card-clip text-indigo-600"></i>
              <span>Rekapitulasi Guru &amp; Penugasan Wali Kelas</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar seluruh tenaga pendidik, mata pelajaran yang diampu, serta rombongan belajar perwalian.
            </p>
          </div>
          <button
            onClick={onOpenPdfModal}
            className="text-xs md:text-sm font-semibold px-4 py-2 rounded-lg bg-[#2C3E50] hover:bg-[#1a252f] text-white shadow-sm transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-print"></i> Cetak Rekap PDF
          </button>
        </div>

        {/* Table of Teachers & Wali Kelas */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 bg-slate-50/70">
                <th className="py-3 px-3 font-semibold w-12 text-center">No</th>
                <th className="py-3 px-3 font-semibold">Nama Lengkap &amp; Gelar</th>
                <th className="py-3 px-3 font-semibold">NIP / NUPTK</th>
                <th className="py-3 px-3 font-semibold">Mata Pelajaran Diampu</th>
                <th className="py-3 px-3 font-semibold">Tugas Tambahan (Wali Kelas)</th>
                <th className="py-3 px-3 font-semibold text-center w-28">Jumlah Siswa</th>
                <th className="py-3 px-3 font-semibold text-center w-24">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {guruList.map((guru, idx) => {
                const assignedClass = kelasList.find(k => k.waliKelas === guru.nama);
                const studentCount = assignedClass
                  ? siswaList.filter(s => s.kelas === assignedClass.nama).length
                  : 0;

                return (
                  <tr key={guru.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 text-center text-slate-500 font-medium">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-800">{guru.nama}</div>
                      <div className="text-[11px] text-slate-400">Username: {guru.username}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {guru.nip || '-'}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">
                      {guru.mapelAjar || 'Belum Ditentukan'}
                    </td>
                    <td className="py-3 px-3">
                      {assignedClass ? (
                        <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                          Wali Kelas {assignedClass.nama}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Bukan Wali Kelas</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {assignedClass ? (
                        <span className="font-bold text-slate-700">{studentCount} Siswa</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        {guru.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
