/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  SchoolConfig,
  User,
  KelasItem,
  MapelItem,
  Siswa,
  AbsensiRecord,
  NilaiRecord,
  AgendaRecord,
  BimbinganRecord,
  JadwalMengajarItem,
} from './types';
import {
  initialConfig,
  initialUsers,
  initialKelas,
  initialMapel,
  initialSiswa,
  initialAbsensi,
  initialNilai,
  initialAgenda,
  initialBimbingan,
  initialJadwal,
} from './data/defaultData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { AbsensiView } from './components/views/AbsensiView';
import { PenilaianView } from './components/views/PenilaianView';
import { JadwalView } from './components/views/JadwalView';
import { AgendaView } from './components/views/AgendaView';
import { BimbinganView } from './components/views/BimbinganView';
import { RekapWaliView } from './components/views/RekapWaliView';
import { UserManagementView } from './components/views/UserManagementView';
import { ImportSiswaView } from './components/views/ImportSiswaView';
import { ConfigView } from './components/views/ConfigView';
import { CodeExportView } from './components/views/CodeExportView';
import { PanduanView } from './components/views/PanduanView';
import { PdfModal } from './components/PdfModal';
import { ApiModal } from './components/ApiModal';

export default function App() {
  // State initialization with localStorage fallback
  const [config, setConfig] = useState<SchoolConfig>(() => {
    const saved = localStorage.getItem('SAG_CONFIG');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return initialConfig;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('SAG_USERS');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return initialUsers;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => users[0] || initialUsers[0]);
  const [kelasList] = useState<KelasItem[]>(initialKelas);
  const [mapelList] = useState<MapelItem[]>(initialMapel);

  const [siswaList, setSiswaList] = useState<Siswa[]>(() => {
    const saved = localStorage.getItem('SAG_SISWA');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return initialSiswa;
  });

  const [absensiList, setAbsensiList] = useState<AbsensiRecord[]>(() => {
    const saved = localStorage.getItem('SAG_ABSENSI');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return initialAbsensi;
  });

  const [nilaiList, setNilaiList] = useState<NilaiRecord[]>(() => {
    const saved = localStorage.getItem('SAG_NILAI');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return initialNilai;
  });

  const [agendaList, setAgendaList] = useState<AgendaRecord[]>(() => {
    const saved = localStorage.getItem('SAG_AGENDA');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return initialAgenda;
  });

  const [bimbinganList, setBimbinganList] = useState<BimbinganRecord[]>(() => {
    const saved = localStorage.getItem('SAG_BIMBINGAN');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return initialBimbingan;
  });

  const [jadwalList, setJadwalList] = useState<JadwalMengajarItem[]>(() => {
    const saved = localStorage.getItem('SAG_JADWAL');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return initialJadwal;
  });

  // UI Navigation states
  const [currentTab, setCurrentTab] = useState<ActiveTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [apiModalOpen, setApiModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('SAG_CONFIG', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('SAG_USERS', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('SAG_SISWA', JSON.stringify(siswaList));
  }, [siswaList]);

  useEffect(() => {
    localStorage.setItem('SAG_ABSENSI', JSON.stringify(absensiList));
  }, [absensiList]);

  useEffect(() => {
    localStorage.setItem('SAG_NILAI', JSON.stringify(nilaiList));
  }, [nilaiList]);

  useEffect(() => {
    localStorage.setItem('SAG_AGENDA', JSON.stringify(agendaList));
  }, [agendaList]);

  useEffect(() => {
    localStorage.setItem('SAG_BIMBINGAN', JSON.stringify(bimbinganList));
  }, [bimbinganList]);

  useEffect(() => {
    localStorage.setItem('SAG_JADWAL', JSON.stringify(jadwalList));
  }, [jadwalList]);

  // Handler functions
  const handleSaveAbsensi = async (record: AbsensiRecord) => {
    setAbsensiList((prev) => {
      const filtered = prev.filter((r) => !(r.tanggal === record.tanggal && r.kelas === record.kelas && r.mapel === record.mapel));
      return [...filtered, record];
    });

    if (config.gasApiUrl) {
      try {
        await fetch(config.gasApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'saveAbsensi', params: record }),
        });
      } catch (e) {
        console.warn('Sync to GAS failed', e);
      }
    }
  };

  const handleSaveNilai = async (records: NilaiRecord[]) => {
    setNilaiList((prev) => {
      const recordMap = new Map(records.map(r => [`${r.nis}_${r.mapel}`, r]));
      const untouched = prev.filter(p => !recordMap.has(`${p.nis}_${p.mapel}`));
      return [...untouched, ...records];
    });

    if (config.gasApiUrl) {
      try {
        await fetch(config.gasApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'saveNilaiLeger', params: { records } }),
        });
      } catch (e) {
        console.warn('Sync to GAS failed', e);
      }
    }
  };

  const handleSaveAgenda = (record: AgendaRecord) => {
    setAgendaList((prev) => [record, ...prev]);
  };

  const handleSaveBimbingan = (record: BimbinganRecord) => {
    setBimbinganList((prev) => [record, ...prev]);
  };

  const handleAddJadwal = (item: JadwalMengajarItem) => {
    setJadwalList((prev) => [...prev, item]);
  };

  const handleAddUser = (user: User) => {
    setUsers((prev) => [...prev, user]);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleImportSiswa = (newSiswaList: Siswa[]) => {
    setSiswaList((prev) => {
      const existingNis = new Set(prev.map((s) => s.nis));
      const filtered = newSiswaList.filter((s) => !existingNis.has(s.nis));
      return [...prev, ...filtered];
    });
  };

  const handleSaveConfig = (newConfig: SchoolConfig) => {
    setConfig(newConfig);
  };

  const handleSaveGasUrl = (url: string) => {
    setConfig((prev) => ({ ...prev, gasApiUrl: url }));
    localStorage.setItem('SAG_GAS_URL', url);
  };

  const handleLogout = () => {
    // Switch to another user or reset to default
    const nextUser = users.find((u) => u.id !== currentUser.id) || users[0];
    setCurrentUser(nextUser);
    setCurrentTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        config={config}
        currentUser={currentUser}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <Header
          config={config}
          currentUser={currentUser}
          onOpenPdfModal={() => setPdfModalOpen(true)}
          onOpenApiModal={() => setApiModalOpen(true)}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          users={users}
          onSwitchUser={(user) => setCurrentUser(user)}
        />

        {/* View Switcher Container */}
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              config={config}
              currentUser={currentUser}
              siswaList={siswaList}
              usersList={users}
              kelasList={kelasList}
              onNavigate={setCurrentTab}
              onOpenPdfModal={() => setPdfModalOpen(true)}
            />
          )}

          {currentTab === 'absensi' && (
            <AbsensiView
              kelasList={kelasList}
              mapelList={mapelList}
              siswaList={siswaList}
              currentUser={currentUser}
              onSaveAbsensi={handleSaveAbsensi}
              absensiHistory={absensiList}
            />
          )}

          {currentTab === 'penilaian' && (
            <PenilaianView
              kelasList={kelasList}
              mapelList={mapelList}
              siswaList={siswaList}
              nilaiList={nilaiList}
              onSaveNilai={handleSaveNilai}
              onOpenPdfModal={() => setPdfModalOpen(true)}
            />
          )}

          {currentTab === 'jadwal' && (
            <JadwalView
              jadwalList={jadwalList}
              kelasList={kelasList}
              mapelList={mapelList}
              usersList={users}
              onAddJadwal={handleAddJadwal}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'agenda' && (
            <AgendaView
              agendaList={agendaList}
              kelasList={kelasList}
              mapelList={mapelList}
              currentUser={currentUser}
              onSaveAgenda={handleSaveAgenda}
            />
          )}

          {currentTab === 'bimbingan' && (
            <BimbinganView
              bimbinganList={bimbinganList}
              siswaList={siswaList}
              kelasList={kelasList}
              currentUser={currentUser}
              onSaveBimbingan={handleSaveBimbingan}
            />
          )}

          {currentTab === 'rekap-wali' && (
            <RekapWaliView
              usersList={users}
              kelasList={kelasList}
              siswaList={siswaList}
              onOpenPdfModal={() => setPdfModalOpen(true)}
            />
          )}

          {currentTab === 'users' && (
            <UserManagementView
              usersList={users}
              kelasList={kelasList}
              onAddUser={handleAddUser}
              onDeleteUser={handleDeleteUser}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'import-siswa' && (
            <ImportSiswaView
              onImportSiswa={handleImportSiswa}
              siswaList={siswaList}
            />
          )}

          {currentTab === 'config' && (
            <ConfigView
              config={config}
              onSaveConfig={handleSaveConfig}
            />
          )}

          {currentTab === 'code-gas' && (
            <CodeExportView initialType="gas" />
          )}

          {currentTab === 'code-blogger' && (
            <CodeExportView initialType="blogger" />
          )}

          {currentTab === 'panduan' && (
            <PanduanView
              onNavigate={setCurrentTab}
              onOpenApiModal={() => setApiModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* PDF Generation Modal */}
      <PdfModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        config={config}
        currentUser={currentUser}
        kelasList={kelasList}
        siswaList={siswaList}
        nilaiList={nilaiList}
        agendaList={agendaList}
        bimbinganList={bimbinganList}
        jadwalList={jadwalList}
      />

      {/* API GAS Setup Modal */}
      <ApiModal
        isOpen={apiModalOpen}
        onClose={() => setApiModalOpen(false)}
        gasApiUrl={config.gasApiUrl}
        onSaveUrl={handleSaveGasUrl}
      />
    </div>
  );
}
