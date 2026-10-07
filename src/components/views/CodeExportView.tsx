import React, { useState } from 'react';
import { GAS_CODE } from '../../services/gasCodeGenerator';
import { BLOGGER_XML_CODE } from '../../services/bloggerXmlGenerator';

interface CodeExportViewProps {
  initialType?: 'gas' | 'blogger';
}

export const CodeExportView: React.FC<CodeExportViewProps> = ({ initialType = 'gas' }) => {
  const [activeCode, setActiveCode] = useState<'gas' | 'blogger'>(initialType);
  const [copied, setCopied] = useState<boolean>(false);

  const currentCode = activeCode === 'gas' ? GAS_CODE : BLOGGER_XML_CODE;
  const fileName = activeCode === 'gas' ? 'Kode.gs' : 'Template-Blogger.xml';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([currentCode], {
      type: activeCode === 'gas' ? 'text/javascript' : 'application/xml',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const lineCount = currentCode.split('\n').length;

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-[#2C3E50] flex items-center gap-2">
              <i className="fa-solid fa-code text-blue-600"></i>
              <span>Kode Sumber Siap Pakai &amp; Download</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Salin atau unduh berkas Kode Backend (Apps Script) dan Tema Frontend (Blogger XML) dalam satu klik.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`text-xs md:text-sm font-semibold px-4 py-2 rounded-xl border transition-all flex items-center gap-1.5 ${
                copied
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
              }`}
            >
              <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>
              <span>{copied ? 'Berhasil Disalin!' : 'Salin Kode'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="text-xs md:text-sm font-semibold px-4 py-2 rounded-xl bg-[#2C3E50] hover:bg-[#1a252f] text-white shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
            >
              <i className="fa-solid fa-download"></i>
              <span>Unduh {fileName}</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher between GAS and Blogger XML */}
        <div className="flex items-center gap-2 pt-4">
          <button
            onClick={() => setActiveCode('gas')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${
              activeCode === 'gas'
                ? 'bg-[#2C3E50] text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <i className="fa-solid fa-server text-emerald-400"></i>
            <span>1. Kode Backend (Kode.gs)</span>
            <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded">GAS REST API</span>
          </button>
          <button
            onClick={() => setActiveCode('blogger')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${
              activeCode === 'blogger'
                ? 'bg-[#2C3E50] text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <i className="fa-solid fa-b text-orange-400"></i>
            <span>2. Kode Frontend (Tema Blogger XML)</span>
            <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded">Blogger XML</span>
          </button>
        </div>

        {/* Highlights & Information Banner */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
          {activeCode === 'gas' ? (
            <>
              <div className="font-bold text-[#2C3E50] flex items-center gap-1.5">
                <i className="fa-solid fa-circle-check text-emerald-600"></i>
                <span>Fitur &amp; Jaminan Teknis Kode.gs:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1 text-[11px]">
                <li><strong>Tanggal Bebas Bug ISO:</strong> Menggunakan <code>getDisplayValues()</code> secara eksklusif agar tanggal dan angka persis seperti di sel spreadsheet.</li>
                <li><strong>Blok Try-Catch Bersih:</strong> Semua struktur <code>try...catch...finally</code> memiliki pemisah baris (line break) standar tanpa error kompilasi di editor GAS web.</li>
                <li><strong>Auto Inisialisasi:</strong> Dilengkapi fungsi <code>setupDatabase()</code> untuk membuat otomatis 10 sheet beserta header dan contoh data.</li>
                <li><strong>10 Sheet Lengkap:</strong> Config, Users, Kelas, Mapel, DataSiswa, Absensi, Nilai, Agenda, BimbinganWali, JadwalMengajar.</li>
              </ul>
            </>
          ) : (
            <>
              <div className="font-bold text-[#2C3E50] flex items-center gap-1.5">
                <i className="fa-solid fa-circle-check text-orange-600"></i>
                <span>Fitur &amp; Jaminan Teknis Template-Blogger.xml:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1 text-[11px]">
                <li><strong>Bypass CORS Blogger:</strong> Menggunakan fungsi <code>fetch(url, &#123; method: 'POST', headers: &#123; 'Content-Type': 'text/plain;charset=utf-8' &#125;, body: JSON.stringify(...) &#125;)</code>.</li>
                <li><strong>Desain Platinum Glassmorphism:</strong> Warna primer <code>#2C3E50</code>, backdrop-filter frosted glass, dan 100% responsif mobile.</li>
                <li><strong>Cetak PDF Lengkap:</strong> jsPDF + jsPDF-AutoTable + Kop Surat ganda resmi + Tanda tangan Kepsek &amp; Guru + JsBarcode digital verifier.</li>
                <li><strong>Struktur XML Valid:</strong> Dilengkapi wrapper CDATA dan section standar Blogger tanpa error saat paste di Tema Blogger.</li>
              </ul>
            </>
          )}
        </div>

        {/* Code Viewer Container */}
        <div className="mt-4 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-200">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              <span className="font-mono text-slate-400 font-semibold ml-2">{fileName}</span>
            </div>
            <div className="text-slate-400 font-mono text-[11px]">
              {lineCount} baris &bull; {(currentCode.length / 1024).toFixed(1)} KB
            </div>
          </div>

          <pre className="p-4 text-xs font-mono overflow-x-auto max-h-[550px] leading-relaxed text-slate-300 selection:bg-blue-600/40">
            <code>{currentCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
