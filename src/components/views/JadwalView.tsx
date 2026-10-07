import React, { useState } from 'react';
import { JadwalMengajarItem, KelasItem, MapelItem, User } from '../../types';

interface JadwalViewProps {
  jadwalList: JadwalMengajarItem[];
  kelasList: KelasItem[];
  mapelList: MapelItem[];
  usersList: User[];
  onAddJadwal: (item: JadwalMengajarItem) => void;
  currentUser: User;
}

export const JadwalView: React.FC<JadwalViewProps> = ({
  jadwalList,
  kelasList,
  mapelList,
  usersList,
  onAddJadwal,
  currentUser,
}) => {
  const [filterHari, setFilterHari] = useState<string>('Semua');
  const [showModal, setShowModal] = useState<boolean>(false);

  const [formHari, setFormHari] = useState<JadwalMengajarItem['hari']>('Senin');
  const [formJamKe, setFormJamKe] = useState('1 - 2');
  const [formWaktu, setFormWaktu] = useState('07.15 - 08.45');
  const [formKelas, setFormKelas] = useState(kelasList[0]?.nama || 'X-MIPA-1');
  const [formMapel, setFormMapel] = useState(mapelList[0]?.nama || 'Matematika Wajib');
  const [formRuang, setFormRuang] = useState('R. 101');
  const [formGuru, setFormGuru] = useState(currentUser.nama);

  const filteredJadwal = jadwalList.filter(
    (j) => filterHari === 'Semua' || j.hari === filterHari
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetGuru = usersList.find((u) => u.nama === formGuru) || currentUser;

    const newItem: JadwalMengajarItem = {
      id: `JDW-${Date.now()}`,
      hari: formHari,
      jamKe: formJamKe,
      waktu: formWaktu,
      kelas: formKelas,
      mapel: formMapel,
      guruNip: targetGuru.nip,
      guruNama: targetGuru.nama,
      ruang: formRuang,
    };

    onAddJadwal(newItem);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Filter */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-[#2C3E50] flex items-center gap-2">
              <i className="fa-solid fa-calendar-days text-purple-600"></i>
              <span>Jadwal Mengajar Guru</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Jadwal tatap muka mingguan terstruktur per hari, jam ke, ruang kelas, dan mata pelajaran.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="text-xs md:text-sm font-semibold px-4 py-2 rounded-lg bg-[#2C3E50] hover:bg-[#1a252f] text-white shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
          >
            <i className="fa-solid fa-plus"></i>
            <span>Tambah Jadwal Baru</span>
          </button>
        </div>

        {/* Filter Hari Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 pb-1">
          {['Semua', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((hari) => (
            <button
              key={hari}
              onClick={() => setFilterHari(hari)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                filterHari === hari
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {hari}
            </button>
          ))}
        </div>
      </div>

      {/* Jadwal Table */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 bg-slate-50/70">
                <th className="py-3 px-3 font-semibold w-24">Hari</th>
                <th className="py-3 px-3 font-semibold w-24">Jam Ke</th>
                <th className="py-3 px-3 font-semibold w-32">Waktu</th>
                <th className="py-3 px-3 font-semibold w-28">Kelas</th>
                <th className="py-3 px-3 font-semibold">Mata Pelajaran</th>
                <th className="py-3 px-3 font-semibold">Guru Pengampu</th>
                <th className="py-3 px-3 font-semibold w-24 text-center">Ruang</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJadwal.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada jadwal mengajar pada hari yang dipilih.
                  </td>
                </tr>
              ) : (
                filteredJadwal.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-700 px-2 py-0.5 rounded bg-slate-100">
                        {item.hari}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-medium text-slate-600">
                      {item.jamKe}
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-medium">
                      {item.waktu}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {item.kelas}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      {item.mapel}
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      <div>{item.guruNama}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{item.guruNip}</div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                        {item.ruang}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Jadwal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#2C3E50]">Tambah Jadwal Mengajar</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 mt-4 text-xs md:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hari</label>
                  <select
                    value={formHari}
                    onChange={(e) => setFormHari(e.target.value as JadwalMengajarItem['hari'])}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jam Ke</label>
                  <input
                    type="text"
                    value={formJamKe}
                    onChange={(e) => setFormJamKe(e.target.value)}
                    placeholder="misal: 1 - 2"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Waktu</label>
                  <input
                    type="text"
                    value={formWaktu}
                    onChange={(e) => setFormWaktu(e.target.value)}
                    placeholder="07.15 - 08.45"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ruang</label>
                  <input
                    type="text"
                    value={formRuang}
                    onChange={(e) => setFormRuang(e.target.value)}
                    placeholder="R. 101 / Lab"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kelas</label>
                  <select
                    value={formKelas}
                    onChange={(e) => setFormKelas(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    {kelasList.map((k) => (
                      <option key={k.id} value={k.nama}>{k.nama}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
                  <select
                    value={formMapel}
                    onChange={(e) => setFormMapel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    {mapelList.map((m) => (
                      <option key={m.id} value={m.nama}>{m.nama}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Guru Pengampu</label>
                <select
                  value={formGuru}
                  onChange={(e) => setFormGuru(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  {usersList.map((u) => (
                    <option key={u.id} value={u.nama}>{u.nama} ({u.role})</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-sm"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
