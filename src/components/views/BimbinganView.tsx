import React, { useState } from 'react';
import { BimbinganRecord, KelasItem, Siswa, User } from '../../types';

interface BimbinganViewProps {
  bimbinganList: BimbinganRecord[];
  siswaList: Siswa[];
  kelasList: KelasItem[];
  currentUser: User;
  onSaveBimbingan: (record: BimbinganRecord) => void;
}

export const BimbinganView: React.FC<BimbinganViewProps> = ({
  bimbinganList,
  siswaList,
  kelasList,
  currentUser,
  onSaveBimbingan,
}) => {
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [selectedNis, setSelectedNis] = useState(siswaList[0]?.nis || '');
  const [permasalahan, setPermasalahan] = useState('');
  const [tindakLanjut, setTindakLanjut] = useState('');
  const [status, setStatus] = useState<BimbinganRecord['statusPenanganan']>('Proses');
  const [alertSuccess, setAlertSuccess] = useState(false);

  const selectedSiswa = siswaList.find(s => s.nis === selectedNis);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSiswa || !permasalahan.trim() || !tindakLanjut.trim()) return;

    const newRec: BimbinganRecord = {
      id: `BMB-${Date.now()}`,
      tanggal,
      nis: selectedSiswa.nis,
      namaSiswa: selectedSiswa.nama,
      kelas: selectedSiswa.kelas,
      guruWali: currentUser.nama,
      permasalahan,
      tindakLanjut,
      statusPenanganan: status,
    };

    onSaveBimbingan(newRec);
    setPermasalahan('');
    setTindakLanjut('');
    setAlertSuccess(true);
    setTimeout(() => setAlertSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header and Input Form */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-[#2C3E50] flex items-center gap-2">
              <i className="fa-solid fa-hand-holding-heart text-rose-600"></i>
              <span>Buku Catatan Bimbingan Wali Kelas &amp; Konseling</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pencatatan kasus, pembinaan karakter, konseling siswa, dan tindak lanjut pemanggilan orang tua.
            </p>
          </div>
        </div>

        {alertSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
            <i className="fa-solid fa-circle-check text-emerald-600"></i>
            <span>Catatan bimbingan siswa berhasil disimpan ke sistem!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs md:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal Kasus / Konseling</label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pilih Siswa</label>
              <select
                value={selectedNis}
                onChange={(e) => setSelectedNis(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                {siswaList.map((s) => (
                  <option key={s.nis} value={s.nis}>
                    {s.nama} ({s.kelas})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kelas</label>
              <input
                type="text"
                value={selectedSiswa?.kelas || '-'}
                readOnly
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status Penanganan</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BimbinganRecord['statusPenanganan'])}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="Proses">Dalam Proses</option>
                <option value="Selesai">Selesai / Teratasi</option>
                <option value="Pemanggilan Orang Tua">Pemanggilan Orang Tua</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Uraian Permasalahan / Indikasi Kasus
              </label>
              <textarea
                value={permasalahan}
                onChange={(e) => setPermasalahan(e.target.value)}
                rows={3}
                placeholder="cth: Mengalami penurunan drastis nilai tugas, sering tidur saat jam KBM, atau terindikasi sering bolos..."
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              ></textarea>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tindak Lanjut &amp; Solusi Pembinaan
              </label>
              <textarea
                value={tindakLanjut}
                onChange={(e) => setTindakLanjut(e.target.value)}
                rows={3}
                placeholder="cth: Dilakukan konseling empat mata, penetapan target belajar bersama, atau surat panggilan wali murid..."
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm transition-all active:scale-95 flex items-center gap-2"
            >
              <i className="fa-solid fa-floppy-disk"></i>
              <span>Simpan Catatan Bimbingan</span>
            </button>
          </div>
        </form>
      </div>

      {/* List of records */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200">
        <h3 className="text-sm font-bold text-[#2C3E50] mb-4 flex items-center gap-2">
          <i className="fa-solid fa-book-medical text-rose-500"></i>
          <span>Daftar Kasus &amp; Riwayat Bimbingan Terkini</span>
        </h3>
        <div className="space-y-3">
          {bimbinganList.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              Belum ada data bimbingan siswa.
            </div>
          ) : (
            bimbinganList.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/60 font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-900 font-bold text-sm">{rec.namaSiswa}</span>
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold text-[11px]">
                      {rec.kelas}
                    </span>
                    <span className="font-mono text-slate-400">NIS: {rec.nis}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        rec.statusPenanganan === 'Selesai'
                          ? 'bg-emerald-100 text-emerald-800'
                          : rec.statusPenanganan === 'Proses'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {rec.statusPenanganan}
                    </span>
                    <span className="font-mono text-slate-500 text-[11px]">{rec.tanggal}</span>
                  </div>
                </div>

                <div className="mt-2 text-slate-800">
                  <strong className="text-rose-700">Permasalahan:</strong> {rec.permasalahan}
                </div>
                <div className="mt-1 text-slate-700">
                  <strong className="text-blue-700">Tindak Lanjut:</strong> {rec.tindakLanjut}
                </div>
                <div className="mt-2 text-[11px] text-slate-400">
                  Guru Wali / Pembimbing: <strong className="text-slate-600">{rec.guruWali}</strong>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
