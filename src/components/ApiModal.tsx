import React, { useState } from 'react';

interface ApiModalProps {
  isOpen: boolean;
  onClose: () => void;
  gasApiUrl: string;
  onSaveUrl: (url: string) => void;
}

export const ApiModal: React.FC<ApiModalProps> = ({
  isOpen,
  onClose,
  gasApiUrl,
  onSaveUrl,
}) => {
  const [url, setUrl] = useState(gasApiUrl);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTest = async () => {
    if (!url.trim()) {
      setTestResult({ success: false, message: 'Masukkan URL Google Apps Script terlebih dahulu.' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const response = await fetch(url.trim(), {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action: 'ping' }),
      });

      const data = await response.json();
      if (data && data.status) {
        setTestResult({
          success: true,
          message: `Berhasil terhubung ke REST API GAS! (${data.message || 'Respons OK'})`,
        });
      } else {
        setTestResult({
          success: false,
          message: data?.message || 'Server merespons tetapi mengembalikan status false.',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Gagal menghubungi URL: ${err.message}. Pastikan deployment diset 'Who has access: Anyone'.`,
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    onSaveUrl(url.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 bg-[#2C3E50] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-plug text-emerald-400"></i>
            <h3 className="font-bold text-sm md:text-base">Pengaturan Koneksi Google Apps Script</h3>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs md:text-sm">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Web App URL (Berakhiran <code>/exec</code>)
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Diperoleh setelah deploy Apps Script: Deploy &gt; New deployment &gt; Web app (Execute as Me, Anyone).
            </p>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs font-medium flex items-start gap-2 ${
                testResult.success
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              <i
                className={`fa-solid mt-0.5 ${
                  testResult.success ? 'fa-circle-check text-emerald-600' : 'fa-circle-exclamation text-rose-600'
                }`}
              ></i>
              <div className="flex-1">{testResult.message}</div>
            </div>
          )}

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
            <strong>Catatan:</strong> Jika URL dikosongkan, sistem tetap berjalan normal dalam mode simulasi interaktif dengan data mock lengkap yang dapat Anda uji langsung.
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleTest}
            disabled={testing}
            className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5"
          >
            <i className={`fa-solid ${testing ? 'fa-spinner fa-spin' : 'fa-network-wired'}`}></i>
            <span>{testing ? 'Menguji...' : 'Uji Koneksi'}</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
            >
              Simpan URL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
