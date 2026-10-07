import React, { useState } from 'react';
import { KelasItem, User } from '../../types';

interface UserManagementViewProps {
  usersList: User[];
  kelasList: KelasItem[];
  onAddUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  currentUser: User;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  usersList,
  kelasList,
  onAddUser,
  onDeleteUser,
  currentUser,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('guru123');
  const [nama, setNama] = useState('');
  const [nip, setNip] = useState('');
  const [role, setRole] = useState<'admin' | 'guru'>('guru');
  const [mapelAjar, setMapelAjar] = useState('Matematika Wajib');
  const [waliKelas, setWaliKelas] = useState('-');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !nama.trim()) return;

    const newUser: User = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      username: username.trim().toLowerCase(),
      password: password.trim(),
      nama: nama.trim(),
      nip: nip.trim() || '-',
      role,
      mapelAjar: role === 'guru' ? mapelAjar : 'TIK / Administrasi',
      waliKelas,
      status: 'Aktif',
    };

    onAddUser(newUser);
    setUsername('');
    setNama('');
    setNip('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-[#2C3E50] flex items-center gap-2">
              <i className="fa-solid fa-users-gear text-blue-600"></i>
              <span>Manajemen Akun Pengguna Sistem</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tambah pengguna baru (Administrator atau Guru), atur hak akses, dan kelola penugasan perwalian.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="text-xs md:text-sm font-semibold px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-user-plus"></i>
            <span>Tambah Pengguna Baru</span>
          </button>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 bg-slate-50/70">
                <th className="py-3 px-3 font-semibold w-12 text-center">No</th>
                <th className="py-3 px-3 font-semibold">Username</th>
                <th className="py-3 px-3 font-semibold">Nama Lengkap</th>
                <th className="py-3 px-3 font-semibold">NIP</th>
                <th className="py-3 px-3 font-semibold">Role</th>
                <th className="py-3 px-3 font-semibold">Mata Pelajaran</th>
                <th className="py-3 px-3 font-semibold">Wali Kelas</th>
                <th className="py-3 px-3 font-semibold text-center w-24">Status</th>
                <th className="py-3 px-3 font-semibold text-center w-20">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usersList.map((u, idx) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 text-center text-slate-500 font-medium">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-[#2C3E50]">
                    @{u.username}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {u.nama}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600">
                    {u.nip}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {u.mapelAjar || '-'}
                  </td>
                  <td className="py-3 px-3">
                    {u.waliKelas && u.waliKelas !== '-' ? (
                      <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-xs">
                        {u.waliKelas}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {u.id === currentUser.id ? (
                      <span className="text-[10px] text-slate-400 italic">Akun Anda</span>
                    ) : (
                      <button
                        onClick={() => onDeleteUser(u.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus Pengguna"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah User */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#2C3E50]">Tambah Pengguna Baru</h3>
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
                  <label className="block font-semibold text-slate-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="misal: ahmad_guru"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Password</label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password awal"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap &amp; Gelar</label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="misal: Ahmad Dahlan, M.Pd."
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIP</label>
                  <input
                    type="text"
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    placeholder="19800101 200501 1 001"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role Akun</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'admin' | 'guru')}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="guru">Guru Biasa</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              {role === 'guru' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
                    <input
                      type="text"
                      value={mapelAjar}
                      onChange={(e) => setMapelAjar(e.target.value)}
                      placeholder="cth: Matematika Wajib"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Wali Kelas</label>
                    <select
                      value={waliKelas}
                      onChange={(e) => setWaliKelas(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="-">- Bukan Wali Kelas -</option>
                      {kelasList.map((k) => (
                        <option key={k.id} value={k.nama}>{k.nama}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

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
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
