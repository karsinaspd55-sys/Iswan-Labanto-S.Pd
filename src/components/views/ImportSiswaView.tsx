import React, { useState } from 'react';
import { Siswa } from '../../types';

interface ImportSiswaViewProps {
  onImportSiswa: (siswaList: Siswa[]) => void;
  siswaList: Siswa[];
}

export const ImportSiswaView: React.FC<ImportSiswaViewProps> = ({
  onImportSiswa,
  siswaList,
}) => {
  const sampleData = `23241009,0062819289,Haikal Faris Al-Ghifari,X-MIPA-1,L,Islam,081234567810
23241010,0062819290,Irena Melati Putri,X-MIPA-1,P,Islam,081234567811
23241011,0062819291,Kurniawan Dwi Nugroho,X-MIPA-2,L,Kristen,081234567812
23241012,0062819292,Laras Ayu Ningrum,X-MIPA-2,P,Islam,081234567813
23241013,0062819293,Muhammad Fikri Pratama,XI-MIPA-1,L,Islam,081234567814`;

  const [rawText, setRawText] = useState(sampleData);
  const [parsedList, setParsedList] = useState<Siswa[]>([]);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleParse = () => {
    const lines = rawText.trim().split('\n');
    const result: Siswa[] = [];

    lines.forEach((line) => {
      const parts = line.split(/[,\t]/).map((p) => p.trim());
      if (parts.length >= 4 && parts[0] && parts[2]) {
        result.push({
          nis: parts[0],
          nisn: parts[1] || '0000000000',
          nama: parts[2],
          kelas: parts[3],
          jenisKelamin: (parts[4]?.toUpperCase() === 'P' ? 'P' : 'L') as 'L' | 'P',
          agama: parts[5] || 'Islam',
          noHp: parts[6] || '-',
          status: 'Aktif',
        });
      }
    });

    setParsedList(result);
  };

  const handleCommitImport = () => {
    if (parsedList.length === 0) return;
    onImportSiswa(parsedList);
    setImportSuccess(true);
    setParsedList([]);
    setTimeout(() => setImportSuccess(false), 3500);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-[#2C3E50] flex items-center gap-2">
              <i className="fa-solid fa-file-import text-emerald-600"></i>
              <span>Import Siswa Massal (CSV &amp; Tab-Delimited)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Salin data dari Microsoft Excel / Google Sheets lalu tempel langsung ke kotak teks di bawah.
            </p>
          </div>
          <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-medium">
            Total Siswa Terdaftar: <strong>{siswaList.length}</strong>
          </div>
        </div>

        {importSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
            <i className="fa-solid fa-circle-check text-emerald-600"></i>
            <span>Berhasil mengimpor data siswa ke database DataSiswa!</span>
          </div>
        )}

        <div className="mt-4 space-y-3">
          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <strong>Format Kolom per baris:</strong>{' '}
            <code className="text-blue-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
              NIS, NISN, Nama Siswa, Kelas, Jenis Kelamin (L/P), Agama, No HP
            </code>
          </div>

          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={6}
            placeholder="Tempel baris teks CSV di sini..."
            className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          ></textarea>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setRawText(sampleData)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
            >
              Reset ke Contoh Data
            </button>
            <button
              type="button"
              onClick={handleParse}
              className="text-xs md:text-sm font-semibold px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
            >
              <i className="fa-solid fa-magnifying-glass mr-1.5"></i>
              Pratinjau Data ({rawText.trim().split('\n').filter(Boolean).length} Baris)
            </button>
          </div>
        </div>

        {/* Parsed Preview Table */}
        {parsedList.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#2C3E50]">
                Pratinjau Validasi ({parsedList.length} Siswa Siap Diimpor)
              </h3>
              <button
                type="button"
                onClick={handleCommitImport}
                className="text-xs md:text-sm font-bold px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                <i className="fa-solid fa-cloud-arrow-up"></i>
                <span>Simpan ke Database</span>
              </button>
            </div>

            <div className="overflow-x-auto max-h-64 rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 sticky top-0">
                    <th className="p-2.5">NIS</th>
                    <th className="p-2.5">NISN</th>
                    <th className="p-2.5">Nama Lengkap</th>
                    <th className="p-2.5">Kelas</th>
                    <th className="p-2.5">L/P</th>
                    <th className="p-2.5">Agama</th>
                    <th className="p-2.5">No HP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {parsedList.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2.5 font-mono font-semibold text-slate-700">{s.nis}</td>
                      <td className="p-2.5 font-mono text-slate-500">{s.nisn}</td>
                      <td className="p-2.5 font-semibold text-slate-800">{s.nama}</td>
                      <td className="p-2.5 font-bold text-blue-700">{s.kelas}</td>
                      <td className="p-2.5">{s.jenisKelamin}</td>
                      <td className="p-2.5">{s.agama}</td>
                      <td className="p-2.5 text-slate-500">{s.noHp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
