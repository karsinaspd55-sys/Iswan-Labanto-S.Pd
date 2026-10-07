import React, { useState } from 'react';
import { SchoolConfig } from '../../types';

interface ConfigViewProps {
  config: SchoolConfig;
  onSaveConfig: (newConfig: SchoolConfig) => void;
}

export const ConfigView: React.FC<ConfigViewProps> = ({ config, onSaveConfig }) => {
  const [formData, setFormData] = useState<SchoolConfig>({ ...config });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (field: keyof SchoolConfig, val: string) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-[#2C3E50] flex items-center gap-2">
              <i className="fa-solid fa-sliders text-amber-600"></i>
              <span>Konfigurasi Profil Sekolah &amp; Kop Surat Resmi</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Data identitas sekolah, kepala sekolah, dan logo digunakan langsung untuk kop surat dan avatar sistem.
            </p>
          </div>
        </div>

        {saveSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
            <i className="fa-solid fa-circle-check text-emerald-600"></i>
            <span>Konfigurasi sekolah berhasil diperbarui dan disimpan!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs md:text-sm">
          {/* Section: Identitas Umum */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <h3 className="font-bold text-[#2C3E50] text-xs uppercase tracking-wider">
              1. Identitas Pokok Satuan Pendidikan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Nama Satuan Pendidikan</label>
                <input
                  type="text"
                  value={formData.namaSekolah}
                  onChange={(e) => handleChange('namaSekolah', e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">NPSN</label>
                <input
                  type="text"
                  value={formData.npsn}
                  onChange={(e) => handleChange('npsn', e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jenjang</label>
                <input
                  type="text"
                  value={formData.jenjang}
                  onChange={(e) => handleChange('jenjang', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tahun Ajaran Aktif</label>
                <input
                  type="text"
                  value={formData.tahunAjaran}
                  onChange={(e) => handleChange('tahunAjaran', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Semester</label>
                <select
                  value={formData.semester}
                  onChange={(e) => handleChange('semester', e.target.value as 'Ganjil' | 'Genap')}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Alamat & Kontak */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <h3 className="font-bold text-[#2C3E50] text-xs uppercase tracking-wider">
              2. Alamat Lengkap &amp; Kontak Resmi
            </h3>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Alamat Jalan / Kompleks</label>
              <input
                type="text"
                value={formData.alamat}
                onChange={(e) => handleChange('alamat', e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kabupaten / Kota</label>
                <input
                  type="text"
                  value={formData.kabupatenKota}
                  onChange={(e) => handleChange('kabupatenKota', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Provinsi</label>
                <input
                  type="text"
                  value={formData.provinsi}
                  onChange={(e) => handleChange('provinsi', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nomor Telepon</label>
                <input
                  type="text"
                  value={formData.noTelp}
                  onChange={(e) => handleChange('noTelp', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Resmi</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section: Kepala Sekolah & Tanda Tangan */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <h3 className="font-bold text-[#2C3E50] text-xs uppercase tracking-wider">
              3. Pimpinan Sekolah (Pengesahan Dokumen PDF)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Kepala Sekolah &amp; Gelar</label>
                <input
                  type="text"
                  value={formData.namaKepsek}
                  onChange={(e) => handleChange('namaKepsek', e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">NIP Kepala Sekolah</label>
                <input
                  type="text"
                  value={formData.nipKepsek}
                  onChange={(e) => handleChange('nipKepsek', e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section: URL Logo & GAS Endpoint */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <h3 className="font-bold text-[#2C3E50] text-xs uppercase tracking-wider">
              4. Logo Sekolah &amp; Google Apps Script REST API
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">URL Logo Kiri (Logo Sekolah / Daerah)</label>
                <input
                  type="text"
                  value={formData.logoKiriUrl}
                  onChange={(e) => handleChange('logoKiriUrl', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">URL Logo Kanan (Logo Tut Wuri / Jurusan)</label>
                <input
                  type="text"
                  value={formData.logoKananUrl}
                  onChange={(e) => handleChange('logoKananUrl', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Google Apps Script Web App URL (REST API)</label>
              <input
                type="text"
                value={formData.gasApiUrl}
                onChange={(e) => handleChange('gasApiUrl', e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-xs"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Biarkan kosong untuk menjalankan simulasi lokal, atau masukkan URL deployment GAS Anda.
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#2C3E50] hover:bg-[#1a252f] text-white font-bold shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <i className="fa-solid fa-floppy-disk"></i>
              <span>Simpan Seluruh Konfigurasi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
