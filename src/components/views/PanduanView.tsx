import React from 'react';
import { ActiveTab } from '../../types';

interface PanduanViewProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenApiModal: () => void;
}

export const PanduanView: React.FC<PanduanViewProps> = ({ onNavigate, onOpenApiModal }) => {
  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6 border border-slate-200">
        <div className="pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-[#2C3E50] flex items-center gap-2">
            <i className="fa-solid fa-book-open-reader text-blue-600"></i>
            <span>Panduan Instalasi &amp; Integrasi Lengkap (GAS + Blogger)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ikuti 4 langkah mudah berikut untuk menghubungkan Google Sheets sebagai database REST API dan Blogger sebagai Frontend UI.
          </p>
        </div>

        <div className="mt-6 space-y-6 text-xs md:text-sm">
          {/* Langkah 1 */}
          <div className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center shrink-0 text-base shadow-sm">
              1
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="font-bold text-[#2C3E50] text-sm md:text-base">
                Membuat Google Spreadsheet &amp; Menempelkan Kode.gs
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Buka <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold">Google Sheets</a> baru dengan nama (misal: <code>Database_Administrasi_Guru</code>).
              </p>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
                <li>Klik menu <strong>Extensions (Ekstensi)</strong> &gt; <strong>Apps Script</strong>.</li>
                <li>Hapus seluruh kode bawaan <code>function myFunction() &#123;&#125;</code> di editor.</li>
                <li>
                  Buka tab <button onClick={() => onNavigate('code-gas')} className="text-blue-600 underline font-semibold">Kode Backend (Kode.gs)</button>, klik tombol <strong>Salin Kode</strong>, lalu tempel (Paste) seluruhnya ke web editor Apps Script.
                </li>
                <li>Beri nama project Apps Script (misal: <em>SAG Backend API</em>) lalu tekan icon <strong>Save (Simpan)</strong>.</li>
              </ol>
            </div>
          </div>

          {/* Langkah 2 */}
          <div className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center shrink-0 text-base shadow-sm">
              2
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="font-bold text-[#2C3E50] text-sm md:text-base">
                Menjalankan Inisialisasi Database Otomatis (setupDatabase)
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Di dalam <code>Kode.gs</code> sudah disediakan fungsi <code>setupDatabase()</code> yang secara otomatis membuat seluruh 10 Sheet database:
              </p>
              <div className="flex flex-wrap gap-1.5 py-1">
                {['Config', 'Users', 'Kelas', 'Mapel', 'DataSiswa', 'Absensi', 'Nilai', 'Agenda', 'BimbinganWali', 'JadwalMengajar'].map(s => (
                  <span key={s} className="px-2 py-0.5 rounded-md bg-slate-100 font-mono text-[11px] font-bold text-slate-700 border border-slate-200">
                    {s}
                  </span>
                ))}
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
                <li>Pada toolbar atas Apps Script, pilih dropdown fungsi: <strong>setupDatabase</strong>.</li>
                <li>Klik tombol <strong>Run (Jalankan)</strong>.</li>
                <li>Jika Google meminta otorisasi, klik <em>Review Permissions</em> &gt; pilih email Anda &gt; klik <em>Advanced</em> &gt; <em>Go to SAG Backend (unsafe)</em> &gt; <strong>Allow</strong>.</li>
                <li>Cek tab spreadsheet Anda, seluruh 10 sheet beserta header rapi dan data bawaan telah tercipta!</li>
              </ol>
            </div>
          </div>

          {/* Langkah 3 */}
          <div className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-extrabold flex items-center justify-center shrink-0 text-base shadow-sm">
              3
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="font-bold text-[#2C3E50] text-sm md:text-base">
                Menerapkan (Deploy) Apps Script sebagai REST API Web App
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Langkah ini memberikan URL REST API publik untuk diakses oleh frontend Blogger tanpa batasan login Google pengguna:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
                <li>Klik tombol biru <strong>Deploy (Terapkan)</strong> di pojok kanan atas Apps Script &gt; <strong>New deployment (Penerapan baru)</strong>.</li>
                <li>Klik ikon gerigi di samping 'Select type' &gt; pilih <strong>Web app (Aplikasi Web)</strong>.</li>
                <li>
                  Isi konfigurasi penting berikut:
                  <ul className="list-disc list-inside pl-4 mt-1 space-y-0.5 text-slate-700 font-medium">
                    <li>Execute as (Jalankan sebagai): <strong>Me (email_anda@...)</strong></li>
                    <li>Who has access (Yang memiliki akses): <strong>Anyone (Siapa saja)</strong></li>
                  </ul>
                </li>
                <li>Klik <strong>Deploy</strong> &gt; Salin <strong>Web App URL</strong> (yang berakhiran <code>/exec</code>).</li>
                <li>
                  Anda dapat langsung menguji URL tersebut di sini dengan menekan tombol:{' '}
                  <button onClick={onOpenApiModal} className="text-blue-600 font-bold underline">
                    Uji &amp; Hubungkan URL GAS
                  </button>.
                </li>
              </ol>
            </div>
          </div>

          {/* Langkah 4 */}
          <div className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white font-extrabold flex items-center justify-center shrink-0 text-base shadow-sm">
              4
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="font-bold text-[#2C3E50] text-sm md:text-base">
                Memasang Tema Frontend di Blogger (Blogspot)
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Sekarang pasang tema frontend XML ke blog Blogger Anda:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
                <li>Buka dashboard <a href="https://blogger.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold">Blogger.com</a> dan pilih blog Anda.</li>
                <li>Pilih menu <strong>Tema (Theme)</strong> di bilah navigasi kiri.</li>
                <li>Klik tanda panah ke bawah di sebelah tombol 'Sesuaikan' (Customize) &gt; pilih <strong>Edit HTML</strong>.</li>
                <li>Hapus seluruh isi HTML template lama di layar editor Blogger.</li>
                <li>
                  Buka tab <button onClick={() => onNavigate('code-blogger')} className="text-blue-600 underline font-semibold">Kode Blogger (XML)</button>, klik <strong>Salin Kode</strong>, lalu tempelkan (Paste) seluruhnya ke dalam editor Blogger.
                </li>
                <li>Klik icon <strong>Simpan (Save)</strong> di pojok kanan atas Blogger.</li>
                <li>Buka blog Anda di browser (atau di smartphone). Sistem Administrasi Guru Platinum siap digunakan 100%!</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
