/**
 * Generator dan Template Kode Google Apps Script (Kode.gs)
 * Didesain khusus untuk Web App API dengan Google Sheets sebagai Database.
 * Menggunakan getDisplayValues() untuk menjamin tanggal dan format angka tidak mengalami ISO/timezone shift.
 * Struktur try...catch...finally diformat dengan baris baru bersih agar valid di editor Apps Script modern.
 */

export const GAS_CODE = `/**
 * ============================================================================
 * SISTEM ADMINISTRASI GURU (SAG) - BACKEND REST API
 * Engine: Google Apps Script (GAS) & Google Sheets
 * 
 * PETUNJUK DEPLOY:
 * 1. Buat Spreadsheet baru di Google Drive (misal: "Database_Administrasi_Guru").
 * 2. Buka menu Extensions (Ekstensi) > Apps Script.
 * 3. Hapus semua kode default, lalu PASTE SELURUH KODE DI BAWAH INI.
 * 4. Jalankan fungsi "setupDatabase()" sekali saja dari toolbar atas untuk
 *    membuat otomatis seluruh sheet: Config, Users, Kelas, Mapel, DataSiswa,
 *    Absensi, Nilai, Agenda, BimbinganWali, JadwalMengajar beserta data awal.
 * 5. Klik tombol "Deploy" (Terapkan) > "New deployment" (Penerapan baru).
 * 6. Pilih tipe: "Web app" (Aplikasi Web).
 * 7. Konfigurasi penting:
 *    - Description: "SAG REST API v1.0"
 *    - Execute as: "Me" (Saya / pemilik akun email)
 *    - Who has access: "Anyone" (Siapa saja, bahkan anonim)
 * 8. Klik "Deploy", izinkan otorisasi akun Google Anda.
 * 9. Salin "Web App URL" (akhiran /exec) dan masukkan ke Konfigurasi Frontend Blogger.
 * ============================================================================
 */

// Konfigurasi Nama-Nama Sheet Database
var SHEET_NAMES = {
  CONFIG: "Config",
  USERS: "Users",
  KELAS: "Kelas",
  MAPEL: "Mapel",
  SISWA: "DataSiswa",
  ABSENSI: "Absensi",
  NILAI: "Nilai",
  AGENDA: "Agenda",
  BIMBINGAN: "BimbinganWali",
  JADWAL: "JadwalMengajar"
};

/**
 * Endpoint Penanganan Request POST (Utama)
 * Menerima request payload JSON baik via 'text/plain' maupun 'application/json'
 */
function doPost(e) {
  var output = {
    status: false,
    message: "Terjadi kesalahan internal.",
    data: null
  };
  
  try {
    var rawContent = "";
    if (e && e.postData && e.postData.contents) {
      rawContent = e.postData.contents;
    } else if (e && e.parameter && e.parameter.data) {
      rawContent = e.parameter.data;
    }

    if (!rawContent) {
      output.message = "Payload kosong atau tidak terdeteksi.";
      return createJsonResponse(output);
    }

    var payload = JSON.parse(rawContent);
    var action = payload.action;
    var params = payload.params || {};

    switch (action) {
      case "ping":
        output.status = true;
        output.message = "SAG API terhubung dengan sukses!";
        output.data = { timestamp: new Date().toISOString() };
        break;

      case "initDatabase":
        output = setupDatabase();
        break;

      case "login":
        output = handleLogin(params.username, params.password);
        break;

      case "getDashboard":
        output = handleGetDashboard();
        break;

      case "getConfig":
        output = handleGetConfig();
        break;

      case "saveConfig":
        output = handleSaveConfig(params);
        break;

      case "getKelasMapel":
        output = handleGetKelasMapel();
        break;

      case "getSiswaByKelas":
        output = handleGetSiswaByKelas(params.kelas);
        break;

      case "importSiswaMassal":
        output = handleImportSiswaMassal(params.siswaList);
        break;

      case "getAbsensi":
        output = handleGetAbsensi(params.kelas, params.tanggal);
        break;

      case "saveAbsensi":
        output = handleSaveAbsensi(params);
        break;

      case "getNilaiLeger":
        output = handleGetNilaiLeger(params.kelas, params.mapel);
        break;

      case "saveNilaiLeger":
        output = handleSaveNilaiLeger(params);
        break;

      case "getAgenda":
        output = handleGetAgenda(params.kelas, params.guruNip);
        break;

      case "saveAgenda":
        output = handleSaveAgenda(params);
        break;

      case "getBimbingan":
        output = handleGetBimbingan(params.kelas, params.guruWali);
        break;

      case "saveBimbingan":
        output = handleSaveBimbingan(params);
        break;

      case "getJadwal":
        output = handleGetJadwal(params.guruNip, params.hari);
        break;

      case "saveJadwal":
        output = handleSaveJadwal(params);
        break;

      case "getUsers":
        output = handleGetUsers();
        break;

      case "saveUser":
        output = handleSaveUser(params);
        break;

      case "deleteUser":
        output = handleDeleteUser(params.id);
        break;

      default:
        output.message = "Aksi tidak dikenali: " + action;
        break;
    }
  }
  catch (err) {
    output.status = false;
    output.message = "Exception doPost: " + err.toString();
  }
  finally {
    return createJsonResponse(output);
  }
}

/**
 * Endpoint Penanganan Request GET (Untuk Pengujian di Browser)
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "ping";
  if (action === "setup") {
    var res = setupDatabase();
    return createJsonResponse(res);
  }
  return createJsonResponse({
    status: true,
    message: "Sistem Administrasi Guru Backend API Aktif. Gunakan POST untuk berinteraksi.",
    serverTime: new Date().toString()
  });
}

/**
 * Helper pembuat Response JSON dengan header MIME tipe JSON
 */
function createJsonResponse(data) {
  var jsonString = JSON.stringify(data);
  return ContentService.createTextOutput(jsonString)
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Helper Membuka Spreadsheet Aktif
 */
function getDb() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Helper Mendapatkan Sheet atau Membuat Jika Belum Ada
 */
function getOrCreateSheet(sheetName, headers) {
  var ss = getDb();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    if (headers && headers.length > 0) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length)
        .setFontWeight("bold")
        .setBackground("#2C3E50")
        .setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }
  }
  return sheet;
}

/**
 * Mengambil data sheet sebagai array of objects.
 * SANGAT PENTING: Menggunakan getDisplayValues() untuk menjamin tanggal dan angka
 * tidak terdistorsi menjadi format ISO string yang membingungkan.
 */
function getSheetDataObjects(sheetName) {
  var ss = getDb();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow < 2 || lastCol < 1) return [];

  // Ambil teks persis apa adanya yang ditampilkan di spreadsheet
  var displayValues = sheet.getRange(1, 1, lastRow, lastCol).getDisplayValues();
  var headers = displayValues[0];
  var rows = [];

  for (var i = 1; i < displayValues.length; i++) {
    var rowObj = { _rowIndex: i + 1 };
    var hasData = false;
    for (var j = 0; j < headers.length; j++) {
      var key = headers[j].trim();
      var val = displayValues[i][j];
      rowObj[key] = val;
      if (val !== "") hasData = true;
    }
    if (hasData) {
      rows.push(rowObj);
    }
  }
  return rows;
}

/**
 * 1. AUTHENTICATION / LOGIN
 */
function handleLogin(username, password) {
  try {
    var users = getSheetDataObjects(SHEET_NAMES.USERS);
    var found = null;
    
    for (var i = 0; i < users.length; i++) {
      var u = users[i];
      if (String(u.username).trim().toLowerCase() === String(username).trim().toLowerCase() &&
          String(u.password).trim() === String(password).trim()) {
        found = u;
        break;
      }
    }

    if (!found) {
      return {
        status: false,
        message: "Username atau Password tidak cocok."
      };
    }

    if (found.status && String(found.status).toLowerCase() === "nonaktif") {
      return {
        status: false,
        message: "Akun Anda berstatus Nonaktif. Hubungi Administrator."
      };
    }

    // Buat session payload aman tanpa password
    var safeUser = {
      id: found.id,
      username: found.username,
      nama: found.nama,
      nip: found.nip,
      role: found.role,
      mapelAjar: found.mapelAjar || "",
      waliKelas: found.waliKelas || "",
      status: found.status
    };

    return {
      status: true,
      message: "Login berhasil. Selamat datang, " + safeUser.nama,
      data: safeUser
    };
  }
  catch (err) {
    return { status: false, message: "Error login: " + err.toString() };
  }
}

/**
 * 2. DASHBOARD STATISTIK
 */
function handleGetDashboard() {
  try {
    var siswaList = getSheetDataObjects(SHEET_NAMES.SISWA);
    var usersList = getSheetDataObjects(SHEET_NAMES.USERS);
    var kelasList = getSheetDataObjects(SHEET_NAMES.KELAS);
    var absensiList = getSheetDataObjects(SHEET_NAMES.ABSENSI);

    var jumlahGuru = 0;
    for (var u = 0; u < usersList.length; u++) {
      if (usersList[u].role === "guru") jumlahGuru++;
    }

    return {
      status: true,
      data: {
        totalSiswa: siswaList.length,
        totalGuru: jumlahGuru,
        totalRombel: kelasList.length,
        totalUser: usersList.length,
        totalAbsensiTercatat: absensiList.length
      }
    };
  }
  catch (err) {
    return { status: false, message: "Error dashboard: " + err.toString() };
  }
}

/**
 * 3. CONFIG SEKOLAH
 */
function handleGetConfig() {
  try {
    var rows = getSheetDataObjects(SHEET_NAMES.CONFIG);
    var configObj = {};
    for (var i = 0; i < rows.length; i++) {
      var k = rows[i].key;
      var v = rows[i].value;
      if (k) configObj[k] = v;
    }
    return { status: true, data: configObj };
  }
  catch (err) {
    return { status: false, message: "Error config: " + err.toString() };
  }
}

function handleSaveConfig(params) {
  try {
    var sheet = getOrCreateSheet(SHEET_NAMES.CONFIG, ["key", "value"]);
    var lastRow = sheet.getLastRow();
    var existingData = [];
    if (lastRow >= 2) {
      existingData = sheet.getRange(2, 1, lastRow - 1, 2).getDisplayValues();
    }

    var keys = Object.keys(params);
    var keyMap = {};
    for (var i = 0; i < existingData.length; i++) {
      keyMap[existingData[i][0]] = i + 2; // Baris di sheet
    }

    for (var k = 0; k < keys.length; k++) {
      var keyName = keys[k];
      var valName = String(params[keyName]);
      if (keyMap[keyName]) {
        sheet.getRange(keyMap[keyName], 2).setValue(valName);
      } else {
        sheet.appendRow([keyName, valName]);
      }
    }

    return { status: true, message: "Konfigurasi sekolah berhasil disimpan." };
  }
  catch (err) {
    return { status: false, message: "Error save config: " + err.toString() };
  }
}

/**
 * 4. KELAS & MAPEL
 */
function handleGetKelasMapel() {
  try {
    var kelasList = getSheetDataObjects(SHEET_NAMES.KELAS);
    var mapelList = getSheetDataObjects(SHEET_NAMES.MAPEL);
    return {
      status: true,
      data: {
        kelas: kelasList,
        mapel: mapelList
      }
    };
  }
  catch (err) {
    return { status: false, message: "Error get kelas & mapel: " + err.toString() };
  }
}

/**
 * 5. DATA SISWA & IMPORT MASSAL
 */
function handleGetSiswaByKelas(kelasNama) {
  try {
    var siswaList = getSheetDataObjects(SHEET_NAMES.SISWA);
    var filtered = [];
    for (var i = 0; i < siswaList.length; i++) {
      var s = siswaList[i];
      if (!kelasNama || String(s.kelas).trim() === String(kelasNama).trim()) {
        filtered.push(s);
      }
    }
    return { status: true, data: filtered };
  }
  catch (err) {
    return { status: false, message: "Error get siswa: " + err.toString() };
  }
}

function handleImportSiswaMassal(siswaList) {
  try {
    if (!siswaList || !siswaList.length) {
      return { status: false, message: "Daftar siswa kosong." };
    }

    var sheet = getOrCreateSheet(SHEET_NAMES.SISWA, [
      "nis", "nisn", "nama", "kelas", "jenisKelamin", "agama", "noHp", "status"
    ]);

    var rowsToAdd = [];
    for (var i = 0; i < siswaList.length; i++) {
      var s = siswaList[i];
      rowsToAdd.push([
        s.nis || "",
        s.nisn || "",
        s.nama || "",
        s.kelas || "",
        s.jenisKelamin || "L",
        s.agama || "Islam",
        s.noHp || "",
        s.status || "Aktif"
      ]);
    }

    if (rowsToAdd.length > 0) {
      var startRow = sheet.getLastRow() + 1;
      sheet.getRange(startRow, 1, rowsToAdd.length, rowsToAdd[0].length).setValues(rowsToAdd);
    }

    return {
      status: true,
      message: "Berhasil mengimpor " + rowsToAdd.length + " data siswa secara massal!"
    };
  }
  catch (err) {
    return { status: false, message: "Error import siswa: " + err.toString() };
  }
}

/**
 * 6. ABSENSI (Hadir, Sakit, Izin, Alpa)
 */
function handleGetAbsensi(kelas, tanggal) {
  try {
    var absensiList = getSheetDataObjects(SHEET_NAMES.ABSENSI);
    var filtered = [];
    for (var i = 0; i < absensiList.length; i++) {
      var a = absensiList[i];
      var matchKelas = !kelas || a.kelas === kelas;
      var matchTgl = !tanggal || a.tanggal === tanggal;
      if (matchKelas && matchTgl) {
        filtered.push(a);
      }
    }
    return { status: true, data: filtered };
  }
  catch (err) {
    return { status: false, message: "Error get absensi: " + err.toString() };
  }
}

function handleSaveAbsensi(params) {
  try {
    var sheet = getOrCreateSheet(SHEET_NAMES.ABSENSI, [
      "id", "tanggal", "kelas", "mapel", "guruNip", "guruNama", "detailJson"
    ]);

    var recordId = params.id || "ABS-" + Utilities.formatDate(new Date(), "GMT+7", "yyyyMMdd-HHmmss");
    var detailStr = typeof params.detail === "string" ? params.detail : JSON.stringify(params.detail || []);

    // Cek apakah rekaman tanggal dan kelas ini sudah ada, jika ada perbarui (update)
    var lastRow = sheet.getLastRow();
    var updated = false;

    if (lastRow >= 2) {
      var existingData = sheet.getRange(2, 1, lastRow - 1, 4).getDisplayValues();
      for (var r = 0; r < existingData.length; r++) {
        var rowTanggal = existingData[r][1];
        var rowKelas = existingData[r][2];
        var rowMapel = existingData[r][3];
        if (rowTanggal === params.tanggal && rowKelas === params.kelas && rowMapel === params.mapel) {
          var targetRow = r + 2;
          sheet.getRange(targetRow, 5, 1, 3).setValues([[
            params.guruNip || "",
            params.guruNama || "",
            detailStr
          ]]);
          updated = true;
          break;
        }
      }
    }

    if (!updated) {
      sheet.appendRow([
        recordId,
        params.tanggal,
        params.kelas,
        params.mapel,
        params.guruNip || "",
        params.guruNama || "",
        detailStr
      ]);
    }

    return {
      status: true,
      message: updated ? "Data absensi berhasil diperbarui." : "Data absensi baru berhasil disimpan."
    };
  }
  catch (err) {
    return { status: false, message: "Error save absensi: " + err.toString() };
  }
}

/**
 * 7. PENILAIAN & LEGER DINAMIS
 */
function handleGetNilaiLeger(kelas, mapel) {
  try {
    var nilaiList = getSheetDataObjects(SHEET_NAMES.NILAI);
    var filtered = [];
    for (var i = 0; i < nilaiList.length; i++) {
      var n = nilaiList[i];
      var matchKelas = !kelas || n.kelas === kelas;
      var matchMapel = !mapel || n.mapel === mapel;
      if (matchKelas && matchMapel) {
        filtered.push(n);
      }
    }
    return { status: true, data: filtered };
  }
  catch (err) {
    return { status: false, message: "Error get nilai: " + err.toString() };
  }
}

function handleSaveNilaiLeger(params) {
  try {
    var records = params.records || [];
    if (!records.length) {
      return { status: false, message: "Data nilai kosong." };
    }

    var sheet = getOrCreateSheet(SHEET_NAMES.NILAI, [
      "id", "nis", "namaSiswa", "kelas", "mapel", "tp1", "tp2", "tp3", "uts", "uas", "nilaiAkhir", "predikat"
    ]);

    var lastRow = sheet.getLastRow();
    var existingData = [];
    if (lastRow >= 2) {
      existingData = sheet.getRange(2, 1, lastRow - 1, 5).getDisplayValues();
    }

    var keyToRow = {};
    for (var i = 0; i < existingData.length; i++) {
      var nisKey = existingData[i][1];
      var mapelKey = existingData[i][4];
      keyToRow[nisKey + "_" + mapelKey] = i + 2;
    }

    for (var j = 0; j < records.length; j++) {
      var item = records[j];
      var rowKey = item.nis + "_" + item.mapel;
      var pred = item.predikat || (item.nilaiAkhir >= 85 ? "A" : item.nilaiAkhir >= 75 ? "B" : item.nilaiAkhir >= 60 ? "C" : "D");

      if (keyToRow[rowKey]) {
        var rowNum = keyToRow[rowKey];
        sheet.getRange(rowNum, 6, 1, 7).setValues([[
          item.tp1, item.tp2, item.tp3, item.uts, item.uas, item.nilaiAkhir, pred
        ]]);
      } else {
        var idBaru = "NIL-" + Utilities.formatDate(new Date(), "GMT+7", "yyyyMMdd-HHmmss") + "-" + j;
        sheet.appendRow([
          idBaru,
          item.nis,
          item.namaSiswa,
          item.kelas,
          item.mapel,
          item.tp1,
          item.tp2,
          item.tp3,
          item.uts,
          item.uas,
          item.nilaiAkhir,
          pred
        ]);
      }
    }

    return { status: true, message: "Seluruh data penilaian leger berhasil disimpan ke sistem!" };
  }
  catch (err) {
    return { status: false, message: "Error save nilai: " + err.toString() };
  }
}

/**
 * 8. AGENDA & JURNAL GURU
 */
function handleGetAgenda(kelas, guruNip) {
  try {
    var agendaList = getSheetDataObjects(SHEET_NAMES.AGENDA);
    var filtered = [];
    for (var i = 0; i < agendaList.length; i++) {
      var a = agendaList[i];
      var matchKelas = !kelas || a.kelas === kelas;
      var matchGuru = !guruNip || a.guruNip === guruNip;
      if (matchKelas && matchGuru) {
        filtered.push(a);
      }
    }
    return { status: true, data: filtered };
  }
  catch (err) {
    return { status: false, message: "Error get agenda: " + err.toString() };
  }
}

function handleSaveAgenda(params) {
  try {
    var sheet = getOrCreateSheet(SHEET_NAMES.AGENDA, [
      "id", "tanggal", "jamKe", "kelas", "mapel", "guruNip", "guruNama", "materiPokok", "kegiatanPembelajaran", "kendalaCatatan", "absensiRingkasan"
    ]);

    var idBaru = params.id || "AGN-" + Utilities.formatDate(new Date(), "GMT+7", "yyyyMMdd-HHmmss");
    sheet.appendRow([
      idBaru,
      params.tanggal || Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd"),
      params.jamKe || "",
      params.kelas || "",
      params.mapel || "",
      params.guruNip || "",
      params.guruNama || "",
      params.materiPokok || "",
      params.kegiatanPembelajaran || "",
      params.kendalaCatatan || "",
      params.absensiRingkasan || ""
    ]);

    return { status: true, message: "Jurnal agenda mengajar berhasil dicatat!" };
  }
  catch (err) {
    return { status: false, message: "Error save agenda: " + err.toString() };
  }
}

/**
 * 9. BIMBINGAN WALI KELAS
 */
function handleGetBimbingan(kelas, guruWali) {
  try {
    var bimList = getSheetDataObjects(SHEET_NAMES.BIMBINGAN);
    var filtered = [];
    for (var i = 0; i < bimList.length; i++) {
      var b = bimList[i];
      var matchKelas = !kelas || b.kelas === kelas;
      var matchWali = !guruWali || b.guruWali === guruWali;
      if (matchKelas && matchWali) {
        filtered.push(b);
      }
    }
    return { status: true, data: filtered };
  }
  catch (err) {
    return { status: false, message: "Error get bimbingan: " + err.toString() };
  }
}

function handleSaveBimbingan(params) {
  try {
    var sheet = getOrCreateSheet(SHEET_NAMES.BIMBINGAN, [
      "id", "tanggal", "nis", "namaSiswa", "kelas", "guruWali", "permasalahan", "tindakLanjut", "statusPenanganan"
    ]);

    var idBaru = params.id || "BMB-" + Utilities.formatDate(new Date(), "GMT+7", "yyyyMMdd-HHmmss");
    sheet.appendRow([
      idBaru,
      params.tanggal || Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd"),
      params.nis || "",
      params.namaSiswa || "",
      params.kelas || "",
      params.guruWali || "",
      params.permasalahan || "",
      params.tindakLanjut || "",
      params.statusPenanganan || "Proses"
    ]);

    return { status: true, message: "Catatan bimbingan siswa berhasil disimpan." };
  }
  catch (err) {
    return { status: false, message: "Error save bimbingan: " + err.toString() };
  }
}

/**
 * 10. JADWAL MENGAJAR
 */
function handleGetJadwal(guruNip, hari) {
  try {
    var jadwalList = getSheetDataObjects(SHEET_NAMES.JADWAL);
    var filtered = [];
    for (var i = 0; i < jadwalList.length; i++) {
      var j = jadwalList[i];
      var matchGuru = !guruNip || j.guruNip === guruNip;
      var matchHari = !hari || j.hari === hari;
      if (matchGuru && matchHari) {
        filtered.push(j);
      }
    }
    return { status: true, data: filtered };
  }
  catch (err) {
    return { status: false, message: "Error get jadwal: " + err.toString() };
  }
}

function handleSaveJadwal(params) {
  try {
    var sheet = getOrCreateSheet(SHEET_NAMES.JADWAL, [
      "id", "hari", "jamKe", "waktu", "kelas", "mapel", "guruNip", "guruNama", "ruang"
    ]);

    var idBaru = params.id || "JDW-" + Utilities.formatDate(new Date(), "GMT+7", "yyyyMMdd-HHmmss");
    sheet.appendRow([
      idBaru,
      params.hari || "Senin",
      params.jamKe || "",
      params.waktu || "",
      params.kelas || "",
      params.mapel || "",
      params.guruNip || "",
      params.guruNama || "",
      params.ruang || ""
    ]);

    return { status: true, message: "Jadwal mengajar berhasil ditambahkan!" };
  }
  catch (err) {
    return { status: false, message: "Error save jadwal: " + err.toString() };
  }
}

/**
 * 11. MANAJEMEN USER (ADMIN & GURU)
 */
function handleGetUsers() {
  try {
    var users = getSheetDataObjects(SHEET_NAMES.USERS);
    var safeList = [];
    for (var i = 0; i < users.length; i++) {
      var u = users[i];
      safeList.push({
        id: u.id,
        username: u.username,
        nama: u.nama,
        nip: u.nip,
        role: u.role,
        mapelAjar: u.mapelAjar,
        waliKelas: u.waliKelas,
        status: u.status
      });
    }
    return { status: true, data: safeList };
  }
  catch (err) {
    return { status: false, message: "Error get users: " + err.toString() };
  }
}

function handleSaveUser(params) {
  try {
    var sheet = getOrCreateSheet(SHEET_NAMES.USERS, [
      "id", "username", "password", "nama", "nip", "role", "mapelAjar", "waliKelas", "status"
    ]);

    var lastRow = sheet.getLastRow();
    var existingData = [];
    if (lastRow >= 2) {
      existingData = sheet.getRange(2, 1, lastRow - 1, 2).getDisplayValues();
    }

    var isEdit = false;
    var targetRow = 0;
    for (var i = 0; i < existingData.length; i++) {
      if (existingData[i][0] === params.id || existingData[i][1] === params.username) {
        isEdit = true;
        targetRow = i + 2;
        break;
      }
    }

    if (isEdit) {
      if (params.password) {
        sheet.getRange(targetRow, 3).setValue(params.password);
      }
      sheet.getRange(targetRow, 4, 1, 6).setValues([[
        params.nama || "",
        params.nip || "",
        params.role || "guru",
        params.mapelAjar || "",
        params.waliKelas || "",
        params.status || "Aktif"
      ]]);
      return { status: true, message: "Data pengguna berhasil diperbarui." };
    } else {
      var idBaru = params.id || "USR-" + Utilities.formatDate(new Date(), "GMT+7", "yyyyMMdd-HHmmss");
      sheet.appendRow([
        idBaru,
        params.username,
        params.password || "guru123",
        params.nama || "",
        params.nip || "",
        params.role || "guru",
        params.mapelAjar || "",
        params.waliKelas || "",
        params.status || "Aktif"
      ]);
      return { status: true, message: "Pengguna baru berhasil ditambahkan." };
    }
  }
  catch (err) {
    return { status: false, message: "Error save user: " + err.toString() };
  }
}

function handleDeleteUser(userId) {
  try {
    var sheet = getOrCreateSheet(SHEET_NAMES.USERS);
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return { status: false, message: "Pengguna tidak ditemukan." };

    var ids = sheet.getRange(2, 1, lastRow - 1, 1).getDisplayValues();
    for (var i = 0; i < ids.length; i++) {
      if (ids[i][0] === userId) {
        sheet.deleteRow(i + 2);
        return { status: true, message: "Pengguna berhasil dihapus." };
      }
    }
    return { status: false, message: "ID Pengguna tidak ditemukan." };
  }
  catch (err) {
    return { status: false, message: "Error delete user: " + err.toString() };
  }
}

/**
 * SETUP DAN INITIALISASI SELURUH SHEET OTOMATIS
 * Jalankan fungsi ini sekali di Apps Script jika membuat spreadsheet baru.
 */
function setupDatabase() {
  try {
    var ss = getDb();

    // 1. Sheet Config
    var sCfg = getOrCreateSheet(SHEET_NAMES.CONFIG, ["key", "value"]);
    if (sCfg.getLastRow() <= 1) {
      sCfg.appendRow(["namaSekolah", "SMA NEGERI 1 PRESTASI NUSANTARA"]);
      sCfg.appendRow(["npsn", "20230491"]);
      sCfg.appendRow(["jenjang", "SMA"]);
      sCfg.appendRow(["alamat", "Jl. Pendidikan Karakter No. 45, Kompleks Ki Hajar Dewantara"]);
      sCfg.appendRow(["kelurahanDesa", "Cimanggu"]);
      sCfg.appendRow(["kecamatan", "Tanah Sereal"]);
      sCfg.appendRow(["kabupatenKota", "Kota Bogor"]);
      sCfg.appendRow(["provinsi", "Jawa Barat"]);
      sCfg.appendRow(["kodePos", "16161"]);
      sCfg.appendRow(["noTelp", "(0251) 8332190"]);
      sCfg.appendRow(["email", "info@sman1prestasinusantara.sch.id"]);
      sCfg.appendRow(["website", "https://sman1prestasinusantara.sch.id"]);
      sCfg.appendRow(["namaKepsek", "Dr. H. Bambang Sudirman, M.Pd."]);
      sCfg.appendRow(["nipKepsek", "19680512 199303 1 004"]);
      sCfg.appendRow(["tahunAjaran", "2025/2026"]);
      sCfg.appendRow(["semester", "Genap"]);
      sCfg.appendRow(["logoKiriUrl", "https://api.iconify.design/emojione:school.svg"]);
      sCfg.appendRow(["logoKananUrl", "https://api.iconify.design/openmoji:graduation-cap.svg"]);
    }

    // 2. Sheet Users
    var sUsr = getOrCreateSheet(SHEET_NAMES.USERS, [
      "id", "username", "password", "nama", "nip", "role", "mapelAjar", "waliKelas", "status"
    ]);
    if (sUsr.getLastRow() <= 1) {
      sUsr.appendRow(["USR-001", "admin", "admin123", "Administrator Utama", "19820415 200801 1 012", "admin", "TIK", "-", "Aktif"]);
      sUsr.appendRow(["USR-002", "budi", "guru123", "Budi Santoso, S.Pd.", "19790812 200501 1 008", "guru", "Matematika Wajib", "X-MIPA-1", "Aktif"]);
      sUsr.appendRow(["USR-003", "siti", "guru123", "Dra. Hj. Siti Rahmawati, M.Pd.", "19740320 199802 2 003", "guru", "Bahasa Indonesia", "XI-MIPA-2", "Aktif"]);
    }

    // 3. Sheet Kelas
    var sKls = getOrCreateSheet(SHEET_NAMES.KELAS, ["id", "nama", "waliKelas", "tingkat", "jurusan"]);
    if (sKls.getLastRow() <= 1) {
      sKls.appendRow(["KLS-01", "X-MIPA-1", "Budi Santoso, S.Pd.", "X", "MIPA"]);
      sKls.appendRow(["KLS-02", "X-MIPA-2", "Dra. Hj. Siti Rahmawati, M.Pd.", "X", "MIPA"]);
      sKls.appendRow(["KLS-03", "XI-MIPA-1", "Ahmad Fauzi, S.Pd., M.Si.", "XI", "MIPA"]);
    }

    // 4. Sheet Mapel
    var sMpl = getOrCreateSheet(SHEET_NAMES.MAPEL, ["id", "kode", "nama", "kkm", "kelompok"]);
    if (sMpl.getLastRow() <= 1) {
      sMpl.appendRow(["MP-01", "MTK-W", "Matematika Wajib", "75", "Umum"]);
      sMpl.appendRow(["MP-02", "BIN-W", "Bahasa Indonesia", "75", "Umum"]);
      sMpl.appendRow(["MP-03", "FSK-P", "Fisika", "75", "Peminatan MIPA"]);
    }

    // 5. Sheet DataSiswa
    var sSsw = getOrCreateSheet(SHEET_NAMES.SISWA, [
      "nis", "nisn", "nama", "kelas", "jenisKelamin", "agama", "noHp", "status"
    ]);
    if (sSsw.getLastRow() <= 1) {
      sSsw.appendRow(["23241001", "0062819281", "Aditya Pratama Putra", "X-MIPA-1", "L", "Islam", "081234567890", "Aktif"]);
      sSsw.appendRow(["23241002", "0062819282", "Anisa Dwi Lestari", "X-MIPA-1", "P", "Islam", "081234567891", "Aktif"]);
      sSsw.appendRow(["23241003", "0062819283", "Bagaskara Wahyu", "X-MIPA-1", "L", "Kristen", "081234567892", "Aktif"]);
      sSsw.appendRow(["23241004", "0062819284", "Citra Kirana Melati", "X-MIPA-1", "P", "Islam", "081234567893", "Aktif"]);
      sSsw.appendRow(["23241005", "0062819285", "Daffa Rizky Ramadhan", "X-MIPA-1", "L", "Islam", "081234567894", "Aktif"]);
    }

    // 6. Sheet Absensi
    getOrCreateSheet(SHEET_NAMES.ABSENSI, ["id", "tanggal", "kelas", "mapel", "guruNip", "guruNama", "detailJson"]);

    // 7. Sheet Nilai
    getOrCreateSheet(SHEET_NAMES.NILAI, [
      "id", "nis", "namaSiswa", "kelas", "mapel", "tp1", "tp2", "tp3", "uts", "uas", "nilaiAkhir", "predikat"
    ]);

    // 8. Sheet Agenda
    getOrCreateSheet(SHEET_NAMES.AGENDA, [
      "id", "tanggal", "jamKe", "kelas", "mapel", "guruNip", "guruNama", "materiPokok", "kegiatanPembelajaran", "kendalaCatatan", "absensiRingkasan"
    ]);

    // 9. Sheet BimbinganWali
    getOrCreateSheet(SHEET_NAMES.BIMBINGAN, [
      "id", "tanggal", "nis", "namaSiswa", "kelas", "guruWali", "permasalahan", "tindakLanjut", "statusPenanganan"
    ]);

    // 10. Sheet JadwalMengajar
    getOrCreateSheet(SHEET_NAMES.JADWAL, [
      "id", "hari", "jamKe", "waktu", "kelas", "mapel", "guruNip", "guruNama", "ruang"
    ]);

    return {
      status: true,
      message: "Database Sistem Administrasi Guru berhasil diinisialisasi secara komprehensif!"
    };
  }
  catch (err) {
    return {
      status: false,
      message: "Gagal inisialisasi database: " + err.toString()
    };
  }
}
`;
