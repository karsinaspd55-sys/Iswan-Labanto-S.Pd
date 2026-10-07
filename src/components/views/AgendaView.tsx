import React, { useState } from 'react';
import { AgendaRecord, KelasItem, MapelItem, User } from '../../types';

interface AgendaViewProps {
  agendaList: AgendaRecord[];
  kelasList: KelasItem[];
  mapelList: MapelItem[];
  currentUser: User;
  onSaveAgenda: (record: AgendaRecord) => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  agendaList,
  kelasList,
  mapelList,
  currentUser,
  onSaveAgenda,
}) => {
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [jamKe, setJamKe] = useState('1 - 2 (07.15 - 08.45)');
  const [kelas, setKelas] = useState(kelasList[0]?.nama || 'X-MIPA-1');
  const [mapel, setMapel] = useState(currentUser.mapelAjar || mapelList[0]?.nama || 'Matematika Wajib');
  const [materiPokok, setMateriPokok] = useState('');
  const [kegiatan, setKegiatan] = useState('');
  const [kendala, setKendala] = useState('');
  const [absensiRingkasan, setAbsensiRingkasan] = useState('Hadir: Lengkap (Nihil)');
  const [saveAlert, setSaveAlert] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materiPokok.trim() || !kegiatan.trim()) return;

    const newAgenda: AgendaRecord = {
      id: `AGN-${Date.now()}`,
      tanggal,
      jamKe,
      kelas,
      mapel,
      guruNip: currentUser.nip,
      guruNama: currentUser.nama,
      materiPokok,
      kegiatanPembelajaran: kegiatan,
      kendalaCatatan: kendala || '-',
      absensiRingkasan: absensiRingkasan || 'Hadir Lengkap',
    };

    onSaveAgenda(newAgenda);
    setMateriPokok('');
    setKegiatan('');
    setKendala('');
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Form Input Jurnal */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-[#2C3E50] flex items-center gap-2">
              <i className="fa-solid fa-book-bookmark text-amber-600"></i>
              <span>Jurnal Agenda Harian Mengajar Guru</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Dokumentasi resmi aktivitas KBM, pencapaian materi pokok, serta kendala pembelajaran di kelas.
            </p>
          </div>
        </div>

        {saveAlert && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
            <i className="fa-solid fa-circle-check text-emerald-600"></i>
            <span>Jurnal agenda baru berhasil ditambahkan dan tersimpan ke sistem!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs md:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal</label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jam Pelajaran Ke</label>
              <input
                type="text"
                value={jamKe}
                onChange={(e) => setJamKe(e.target.value)}
                placeholder="misal: 1 - 2 (07.15 - 08.45)"
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kelas</label>
              <select
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                {kelasList.map((k) => (
                  <option key={k.id} value={k.nama}>{k.nama}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
              <input
                type="text"
                value={mapel}
                onChange={(e) => setMapel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Materi Pokok / Kompetensi Dasar (KD / TP)
            </label>
            <input
              type="text"
              value={materiPokok}
              onChange={(e) => setMateriPokok(e.target.value)}
              placeholder="cth: Relasi Sudut Kuadran Trigonometri dan Perbandingan Sudut Istimewa"
              required
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kegiatan Pembelajaran &amp; Metode
              </label>
              <textarea
                value={kegiatan}
                onChange={(e) => setKegiatan(e.target.value)}
                rows={3}
                placeholder="Uraikan kegiatan pendahuluan, inti, dan penutup pembelajaran..."
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              ></textarea>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kendala Pembelajaran / Catatan Refleksi
              </label>
              <textarea
                value={kendala}
                onChange={(e) => setKendala(e.target.value)}
                rows={3}
                placeholder="Catatan keaktifan siswa, kendala proyektor/perangkat, atau tugas remedial..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              ></textarea>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Ringkasan Presensi</label>
            <input
              type="text"
              value={absensiRingkasan}
              onChange={(e) => setAbsensiRingkasan(e.target.value)}
              placeholder="cth: Hadir: 30, Sakit: 1, Izin: 1, Alpa: 0"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-sm transition-all active:scale-95 flex items-center gap-2"
            >
              <i className="fa-solid fa-floppy-disk"></i>
              <span>Simpan Jurnal Agenda</span>
            </button>
          </div>
        </form>
      </div>

      {/* History of Agendas */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200">
        <h3 className="text-sm font-bold text-[#2C3E50] mb-4 flex items-center gap-2">
          <i className="fa-solid fa-list-check text-slate-500"></i>
          <span>Daftar Riwayat Jurnal Guru</span>
        </h3>
        <div className="space-y-3">
          {agendaList.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              Belum ada riwayat agenda pembelajaran.
            </div>
          ) : (
            agendaList.map((ag) => (
              <div
                key={ag.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-200/60 font-semibold">
                  <div className="flex items-center gap-2 text-slate-800">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                      {ag.kelas}
                    </span>
                    <span>{ag.mapel}</span>
                    <span className="text-slate-400 font-normal">({ag.jamKe})</span>
                  </div>
                  <div className="text-slate-500 font-mono text-[11px]">{ag.tanggal}</div>
                </div>

                <div className="mt-2 text-slate-800 font-semibold">
                  Materi: <span className="font-normal text-slate-700">{ag.materiPokok}</span>
                </div>
                <div className="mt-1 text-slate-600 leading-relaxed">
                  <strong>Kegiatan:</strong> {ag.kegiatanPembelajaran}
                </div>
                {ag.kendalaCatatan && ag.kendalaCatatan !== '-' && (
                  <div className="mt-1 text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200/70">
                    <strong>Refleksi / Catatan:</strong> {ag.kendalaCatatan}
                  </div>
                )}
                <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-2">
                  <i className="fa-solid fa-user-check text-emerald-600"></i>
                  <span>Guru: {ag.guruNama} &bull; {ag.absensiRingkasan}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
