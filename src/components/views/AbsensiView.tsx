import React, { useState } from 'react';
import { AbsensiRecord, KelasItem, MapelItem, Siswa, User } from '../../types';

interface AbsensiViewProps {
  kelasList: KelasItem[];
  mapelList: MapelItem[];
  siswaList: Siswa[];
  currentUser: User;
  onSaveAbsensi: (record: AbsensiRecord) => void;
  absensiHistory: AbsensiRecord[];
}

export const AbsensiView: React.FC<AbsensiViewProps> = ({
  kelasList,
  mapelList,
  siswaList,
  currentUser,
  onSaveAbsensi,
  absensiHistory,
}) => {
  const [selectedKelas, setSelectedKelas] = useState<string>(kelasList[0]?.nama || 'X-MIPA-1');
  const [selectedMapel, setSelectedMapel] = useState<string>(mapelList[0]?.nama || 'Matematika Wajib');
  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().split('T')[0]);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Filter siswa based on class
  const classSiswa = siswaList.filter(s => s.kelas === selectedKelas);

  // Local attendance status state { [nis]: 'H' | 'S' | 'I' | 'A' }
  const [attendance, setAttendance] = useState<{ [nis: string]: 'H' | 'S' | 'I' | 'A' }>({});
  const [notes, setNotes] = useState<{ [nis: string]: string }>({});

  const handleStatusChange = (nis: string, status: 'H' | 'S' | 'I' | 'A') => {
    setAttendance(prev => ({ ...prev, [nis]: status }));
  };

  const handleNoteChange = (nis: string, note: string) => {
    setNotes(prev => ({ ...prev, [nis]: note }));
  };

  const handleMarkAll = (status: 'H' | 'S' | 'I' | 'A') => {
    const next: { [nis: string]: 'H' | 'S' | 'I' | 'A' } = {};
    classSiswa.forEach(s => {
      next[s.nis] = status;
    });
    setAttendance(prev => ({ ...prev, ...next }));
  };

  const handleSave = () => {
    const detail = classSiswa.map(s => ({
      nis: s.nis,
      nama: s.nama,
      status: attendance[s.nis] || 'H',
      keterangan: notes[s.nis] || '',
    }));

    const newRecord: AbsensiRecord = {
      id: `ABS-${tanggal.replace(/-/g, '')}-${selectedKelas.replace(/[^a-zA-Z0-9]/g, '')}`,
      tanggal,
      kelas: selectedKelas,
      mapel: selectedMapel,
      guruNip: currentUser.nip,
      guruNama: currentUser.nama,
      detail,
    };

    onSaveAbsensi(newRecord);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Summary counts for current form
  const totalStudents = classSiswa.length;
  let hadirCount = 0;
  let sakitCount = 0;
  let izinCount = 0;
  let alpaCount = 0;

  classSiswa.forEach(s => {
    const st = attendance[s.nis] || 'H';
    if (st === 'H') hadirCount++;
    else if (st === 'S') sakitCount++;
    else if (st === 'I') izinCount++;
    else if (st === 'A') alpaCount++;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter & Form Header */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-[#2C3E50] flex items-center gap-2">
              <i className="fa-solid fa-clipboard-user text-blue-600"></i>
              <span>Input Presensi Kehadiran Siswa</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Data tanggal diproses dengan format teks lokal untuk mencegah pergeseran zona waktu ISO.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleMarkAll('H')}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <i className="fa-solid fa-check-double mr-1"></i> Hadir Semua
            </button>
            <button
              onClick={handleSave}
              className="text-xs md:text-sm font-semibold px-4 py-2 rounded-lg bg-[#2C3E50] hover:bg-[#1a252f] text-white shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
            >
              <i className="fa-solid fa-floppy-disk"></i>
              <span>Simpan Presensi</span>
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
            <i className="fa-solid fa-circle-check text-emerald-600 text-sm"></i>
            <span>Data presensi kelas <strong>{selectedKelas}</strong> tanggal <strong>{tanggal}</strong> berhasil disimpan ke database!</span>
          </div>
        )}

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pilih Kelas / Rombel
            </label>
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="w-full text-xs md:text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {kelasList.map((k) => (
                <option key={k.id} value={k.nama}>
                  {k.nama} (Wali: {k.waliKelas})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mata Pelajaran
            </label>
            <select
              value={selectedMapel}
              onChange={(e) => setSelectedMapel(e.target.value)}
              className="w-full text-xs md:text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {mapelList.map((m) => (
                <option key={m.id} value={m.nama}>
                  {m.nama} (KKM: {m.kkm})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tanggal Presensi
            </label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full text-xs md:text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Real-time Summary Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
          <span className="font-semibold text-slate-600">Ringkasan:</span>
          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
            Total: {totalStudents} Siswa
          </span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
            Hadir (H): {hadirCount}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-semibold">
            Sakit (S): {sakitCount}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold">
            Izin (I): {izinCount}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-semibold">
            Alpa (A): {alpaCount}
          </span>
        </div>
      </div>

      {/* Student List Table */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 bg-slate-50/70">
                <th className="py-3 px-3 font-semibold w-12 text-center">No</th>
                <th className="py-3 px-3 font-semibold w-28">NIS</th>
                <th className="py-3 px-3 font-semibold">Nama Siswa</th>
                <th className="py-3 px-3 font-semibold text-center w-52">Status Kehadiran</th>
                <th className="py-3 px-3 font-semibold">Keterangan Tambahan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classSiswa.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Tidak ada siswa terdaftar pada kelas {selectedKelas}.
                  </td>
                </tr>
              ) : (
                classSiswa.map((siswa, idx) => {
                  const currentStatus = attendance[siswa.nis] || 'H';
                  return (
                    <tr key={siswa.nis} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 text-center text-slate-500 font-medium">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-3 font-mono font-medium text-slate-600">
                        {siswa.nis}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{siswa.nama}</div>
                        <div className="text-[11px] text-slate-400">
                          {siswa.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'} &bull; {siswa.agama}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-center gap-1 bg-slate-100 p-1 rounded-xl">
                          {(['H', 'S', 'I', 'A'] as const).map((stat) => {
                            const isSelected = currentStatus === stat;
                            let activeClass = '';
                            if (isSelected) {
                              if (stat === 'H') activeClass = 'bg-emerald-600 text-white shadow-xs';
                              else if (stat === 'S') activeClass = 'bg-amber-500 text-white shadow-xs';
                              else if (stat === 'I') activeClass = 'bg-blue-600 text-white shadow-xs';
                              else activeClass = 'bg-rose-600 text-white shadow-xs';
                            } else {
                              activeClass = 'text-slate-600 hover:bg-white';
                            }

                            return (
                              <button
                                key={stat}
                                type="button"
                                onClick={() => handleStatusChange(siswa.nis, stat)}
                                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${activeClass}`}
                              >
                                {stat}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          placeholder="cth: Sakit surat dokter, Izin keluarga..."
                          value={notes[siswa.nis] || ''}
                          onChange={(e) => handleNoteChange(siswa.nis, e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Riwayat Absensi Terakhir */}
      {absensiHistory.length > 0 && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-200">
          <h3 className="text-sm font-bold text-[#2C3E50] mb-3 flex items-center gap-2">
            <i className="fa-solid fa-clock-rotate-left text-slate-500"></i>
            <span>Riwayat Presensi Tersimpan</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {absensiHistory.slice(-4).map((rec) => (
              <div key={rec.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>{rec.kelas} &bull; {rec.mapel}</span>
                  <span className="font-mono text-slate-500 font-normal">{rec.tanggal}</span>
                </div>
                <div className="text-slate-500 mt-1">Guru: {rec.guruNama}</div>
                <div className="mt-2 flex items-center gap-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Hadir: {rec.detail.filter(d => d.status === 'H').length}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    Sakit: {rec.detail.filter(d => d.status === 'S').length}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    Izin: {rec.detail.filter(d => d.status === 'I').length}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                    Alpa: {rec.detail.filter(d => d.status === 'A').length}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
