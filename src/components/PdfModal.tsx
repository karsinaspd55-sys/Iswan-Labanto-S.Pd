import React, { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { generateReportPdf } from '../services/pdfService';
import {
  AgendaRecord,
  BimbinganRecord,
  JadwalMengajarItem,
  KelasItem,
  NilaiRecord,
  SchoolConfig,
  Siswa,
  User,
} from '../types';

interface PdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SchoolConfig;
  currentUser: User;
  kelasList: KelasItem[];
  siswaList: Siswa[];
  nilaiList: NilaiRecord[];
  agendaList: AgendaRecord[];
  bimbinganList: BimbinganRecord[];
  jadwalList: JadwalMengajarItem[];
}

export const PdfModal: React.FC<PdfModalProps> = ({
  isOpen,
  onClose,
  config,
  currentUser,
  kelasList,
  siswaList,
  nilaiList,
  agendaList,
  bimbinganList,
  jadwalList,
}) => {
  const [reportType, setReportType] = useState<'leger' | 'absensi' | 'agenda' | 'bimbingan' | 'jadwal'>('leger');
  const [selectedKelas, setSelectedKelas] = useState<string>(kelasList[0]?.nama || 'X-MIPA-1');
  const [isGenerating, setIsGenerating] = useState(false);
  const barcodeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isOpen && barcodeCanvasRef.current) {
      try {
        const code = `SAG-${config.npsn}-${(selectedKelas || 'ALL').replace(/[^a-zA-Z0-9]/g, '')}-${Date.now().toString().slice(-4)}`;
        JsBarcode(barcodeCanvasRef.current, code, {
          format: 'CODE128',
          width: 1.5,
          height: 36,
          displayValue: true,
          fontSize: 10,
        });
      } catch (err) {
        console.warn('JsBarcode preview error', err);
      }
    }
  }, [isOpen, reportType, selectedKelas, config.npsn]);

  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    setIsGenerating(true);
    try {
      const doc = generateReportPdf({
        type: reportType,
        kelas: selectedKelas,
        config,
        currentUser,
        siswaList,
        nilaiList,
        agendaList,
        bimbinganList,
        jadwalList,
      });

      const todayStr = new Date().toISOString().slice(0, 10);
      doc.save(`Laporan_${reportType.toUpperCase()}_${selectedKelas}_${todayStr}.pdf`);
      setIsGenerating(false);
      onClose();
    } catch (err) {
      console.error('PDF error:', err);
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-[#2C3E50] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-file-pdf text-rose-400 text-lg"></i>
            <h3 className="font-bold text-sm md:text-base">Pusat Cetak Dokumen PDF Resmi</h3>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs md:text-sm">
          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Jenis Laporan Dokumen</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="leger">Leger Nilai Hasil Belajar Siswa</option>
                <option value="absensi">Rekapitulasi Presensi Kehadiran</option>
                <option value="agenda">Jurnal Agenda Pembelajaran Guru</option>
                <option value="jadwal">Jadwal Mengajar Mingguan</option>
                <option value="bimbingan">Buku Catatan Bimbingan Wali</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pilih Kelas / Rombel</label>
              <select
                value={selectedKelas}
                onChange={(e) => setSelectedKelas(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                {kelasList.map((k) => (
                  <option key={k.id} value={k.nama}>{k.nama}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Kop Surat Live Preview */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Pratinjau Kop Surat Resmi &amp; Logo
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between gap-3 text-center">
                <img
                  src={config.logoKiriUrl || 'https://api.iconify.design/emojione:school.svg'}
                  alt="Logo Kiri"
                  className="w-12 h-12 object-contain shrink-0"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://api.iconify.design/emojione:school.svg';
                  }}
                />
                <div className="flex-1">
                  <div className="font-bold text-[10px] md:text-xs text-[#2C3E50] uppercase tracking-wide">
                    PEMERINTAH DAERAH PROVINSI {config.provinsi?.toUpperCase() || 'JAWA BARAT'}
                  </div>
                  <div className="font-extrabold text-xs md:text-sm text-slate-900 tracking-tight">
                    {config.namaSekolah}
                  </div>
                  <div className="text-[9px] md:text-[10px] text-slate-500">
                    {config.alamat} {config.kabupatenKota}
                  </div>
                  <div className="text-[8px] md:text-[9px] text-slate-400">
                    Telp: {config.noTelp} &bull; Email: {config.email}
                  </div>
                </div>
                <img
                  src={config.logoKananUrl || 'https://api.iconify.design/openmoji:graduation-cap.svg'}
                  alt="Logo Kanan"
                  className="w-12 h-12 object-contain shrink-0"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://api.iconify.design/openmoji:graduation-cap.svg';
                  }}
                />
              </div>

              {/* Garis Kop Ganda */}
              <div className="mt-3 border-b-2 border-slate-800"></div>
              <div className="mt-0.5 border-b border-slate-800"></div>

              {/* Judul & Tanda Tangan Preview */}
              <div className="mt-4 text-center">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-800 block">
                  {reportType === 'leger'
                    ? 'LEGER NILAI HASIL EVALUASI PEMBELAJARAN'
                    : reportType === 'absensi'
                    ? 'REKAPITULASI PRESENSI KEHADIRAN SISWA'
                    : reportType === 'agenda'
                    ? 'JURNAL AGENDA HARIAN PEMBELAJARAN GURU'
                    : reportType === 'jadwal'
                    ? 'JADWAL MENGAJAR MINGGUAN GURU'
                    : 'BUKU CATATAN BIMBINGAN WALI KELAS'}
                </span>
                <span className="text-[10px] text-slate-500">
                  Kelas: {selectedKelas} &bull; Tahun Ajaran {config.tahunAjaran} ({config.semester})
                </span>
              </div>

              {/* Barcode & Signature Preview */}
              <div className="mt-6 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left text-[10px] text-slate-600">
                  <div>Mengetahui, Kepala Sekolah</div>
                  <div className="font-bold text-slate-800 mt-6">{config.namaKepsek}</div>
                  <div className="text-[9px] text-slate-400">NIP. {config.nipKepsek}</div>
                </div>

                <div className="text-center">
                  <canvas ref={barcodeCanvasRef} className="max-w-[140px]"></canvas>
                  <div className="text-[8px] text-slate-400">Validasi Barcode Otomatis</div>
                </div>

                <div className="text-right text-[10px] text-slate-600">
                  <div>Guru Pengampu / Wali Kelas</div>
                  <div className="font-bold text-slate-800 mt-6">{currentUser.nama}</div>
                  <div className="text-[9px] text-slate-400">NIP. {currentUser.nip}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs md:text-sm"
          >
            Tutup
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={isGenerating}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs md:text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            <i className="fa-solid fa-download"></i>
            <span>{isGenerating ? 'Menyiapkan PDF...' : 'Unduh Berkas PDF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
