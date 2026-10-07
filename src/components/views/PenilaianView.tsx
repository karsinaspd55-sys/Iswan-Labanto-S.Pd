import React, { useState, useEffect } from 'react';
import { KelasItem, MapelItem, NilaiRecord, Siswa } from '../../types';

interface PenilaianViewProps {
  kelasList: KelasItem[];
  mapelList: MapelItem[];
  siswaList: Siswa[];
  nilaiList: NilaiRecord[];
  onSaveNilai: (records: NilaiRecord[]) => void;
  onOpenPdfModal: () => void;
}

export const PenilaianView: React.FC<PenilaianViewProps> = ({
  kelasList,
  mapelList,
  siswaList,
  nilaiList,
  onSaveNilai,
  onOpenPdfModal,
}) => {
  const [selectedKelas, setSelectedKelas] = useState<string>(kelasList[0]?.nama || 'X-MIPA-1');
  const [selectedMapel, setSelectedMapel] = useState<string>(mapelList[0]?.nama || 'Matematika Wajib');
  const [localRecords, setLocalRecords] = useState<NilaiRecord[]>([]);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Sync / initialize records for selected class and mapel
  useEffect(() => {
    const classSiswa = siswaList.filter(s => s.kelas === selectedKelas);
    const existing = nilaiList.filter(n => n.kelas === selectedKelas && n.mapel === selectedMapel);

    const merged: NilaiRecord[] = classSiswa.map((siswa, idx) => {
      const match = existing.find(e => e.nis === siswa.nis);
      if (match) return { ...match };

      const baseVal = 78 + (idx % 12);
      const na = Math.round(baseVal);
      const pred = na >= 85 ? 'A' : na >= 75 ? 'B' : na >= 60 ? 'C' : 'D';

      return {
        id: `NIL-${selectedKelas}-${siswa.nis}-${selectedMapel}`,
        nis: siswa.nis,
        namaSiswa: siswa.nama,
        kelas: selectedKelas,
        mapel: selectedMapel,
        tp1: baseVal - 2,
        tp2: baseVal,
        tp3: baseVal + 2,
        uts: baseVal - 1,
        uas: baseVal + 1,
        nilaiAkhir: na,
        predikat: pred,
      };
    });

    setLocalRecords(merged);
  }, [selectedKelas, selectedMapel, siswaList, nilaiList]);

  const handleScoreChange = (
    index: number,
    field: 'tp1' | 'tp2' | 'tp3' | 'uts' | 'uas',
    value: number
  ) => {
    const updated = [...localRecords];
    const rec = { ...updated[index] };
    const clamped = Math.max(0, Math.min(100, isNaN(value) ? 0 : value));
    rec[field] = clamped;

    // Hitung Nilai Akhir: 40% TP (rata-rata TP1..3) + 30% UTS + 30% UAS
    const avgTp = (rec.tp1 + rec.tp2 + rec.tp3) / 3;
    const na = Math.round(avgTp * 0.4 + rec.uts * 0.3 + rec.uas * 0.3);
    rec.nilaiAkhir = na;
    rec.predikat = na >= 85 ? 'A' : na >= 75 ? 'B' : na >= 60 ? 'C' : 'D';

    updated[index] = rec;
    setLocalRecords(updated);
  };

  const handleSaveAll = () => {
    onSaveNilai(localRecords);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Average statistics
  const totalStudents = localRecords.length;
  const avgClassScore =
    totalStudents > 0
      ? (localRecords.reduce((acc, r) => acc + r.nilaiAkhir, 0) / totalStudents).toFixed(1)
      : '0';

  const countA = localRecords.filter(r => r.predikat === 'A').length;
  const countB = localRecords.filter(r => r.predikat === 'B').length;
  const countC = localRecords.filter(r => r.predikat === 'C').length;
  const countD = localRecords.filter(r => r.predikat === 'D').length;

  return (
    <div className="space-y-6">
      {/* Header and Filter */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-[#2C3E50] flex items-center gap-2">
              <i className="fa-solid fa-file-pen text-emerald-600"></i>
              <span>Leger Dinamis Penilaian Siswa</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Rumus otomatis: 40% Rata-rata Tugas/TP + 30% UTS + 30% UAS dengan konversi predikat otomatis.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenPdfModal}
              className="text-xs font-semibold px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5"
            >
              <i className="fa-solid fa-print"></i> Cetak Leger PDF
            </button>
            <button
              onClick={handleSaveAll}
              className="text-xs md:text-sm font-semibold px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
            >
              <i className="fa-solid fa-floppy-disk"></i>
              <span>Simpan Seluruh Nilai</span>
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
            <i className="fa-solid fa-circle-check text-emerald-600 text-sm"></i>
            <span>Nilai Leger kelas <strong>{selectedKelas}</strong> ({selectedMapel}) berhasil disinkronkan ke database!</span>
          </div>
        )}

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pilih Rombel / Kelas
            </label>
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="w-full text-xs md:text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {kelasList.map((k) => (
                <option key={k.id} value={k.nama}>
                  {k.nama} ({k.jurusan})
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
              className="w-full text-xs md:text-sm px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              Rata-rata Kelas
            </label>
            <div className="text-base font-extrabold text-[#2C3E50] px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
              {avgClassScore} / 100
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Distribusi Predikat
            </label>
            <div className="flex items-center gap-1.5 text-xs font-bold pt-1">
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">A: {countA}</span>
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800">B: {countB}</span>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800">C: {countC}</span>
              <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800">D: {countD}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Leger Dynamic Table */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 bg-slate-50/70">
                <th className="py-3 px-3 font-semibold w-12 text-center">No</th>
                <th className="py-3 px-3 font-semibold w-24">NIS</th>
                <th className="py-3 px-3 font-semibold min-w-[160px]">Nama Siswa</th>
                <th className="py-3 px-2 font-semibold text-center w-20">TP 1</th>
                <th className="py-3 px-2 font-semibold text-center w-20">TP 2</th>
                <th className="py-3 px-2 font-semibold text-center w-20">TP 3</th>
                <th className="py-3 px-2 font-semibold text-center w-20">UTS</th>
                <th className="py-3 px-2 font-semibold text-center w-20">UAS</th>
                <th className="py-3 px-3 font-semibold text-center w-24">Nilai Akhir</th>
                <th className="py-3 px-2 font-semibold text-center w-16">Predikat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {localRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    Tidak ada siswa di kelas {selectedKelas}.
                  </td>
                </tr>
              ) : (
                localRecords.map((rec, idx) => (
                  <tr key={rec.nis} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 text-center text-slate-500 font-medium">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-600">
                      {rec.nis}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      {rec.namaSiswa}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={rec.tp1}
                        onChange={(e) => handleScoreChange(idx, 'tp1', parseInt(e.target.value) || 0)}
                        className="w-16 text-center text-xs px-2 py-1.5 rounded-lg border border-slate-200 bg-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={rec.tp2}
                        onChange={(e) => handleScoreChange(idx, 'tp2', parseInt(e.target.value) || 0)}
                        className="w-16 text-center text-xs px-2 py-1.5 rounded-lg border border-slate-200 bg-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={rec.tp3}
                        onChange={(e) => handleScoreChange(idx, 'tp3', parseInt(e.target.value) || 0)}
                        className="w-16 text-center text-xs px-2 py-1.5 rounded-lg border border-slate-200 bg-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={rec.uts}
                        onChange={(e) => handleScoreChange(idx, 'uts', parseInt(e.target.value) || 0)}
                        className="w-16 text-center text-xs px-2 py-1.5 rounded-lg border border-slate-200 bg-white focus:ring-1 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-700"
                      />
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={rec.uas}
                        onChange={(e) => handleScoreChange(idx, 'uas', parseInt(e.target.value) || 0)}
                        className="w-16 text-center text-xs px-2 py-1.5 rounded-lg border border-slate-200 bg-white focus:ring-1 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-700"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="font-extrabold text-sm text-[#2C3E50] px-2.5 py-1 rounded-lg bg-slate-100">
                        {rec.nilaiAkhir}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          rec.predikat === 'A'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rec.predikat === 'B'
                            ? 'bg-blue-100 text-blue-800'
                            : rec.predikat === 'C'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {rec.predikat}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
