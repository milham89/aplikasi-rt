import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardPage from './pages/admin/DashboardPage';
import WargaPage from './pages/admin/WargaPage';
import KeluargaPage from './pages/admin/KeluargaPage';
import KeuanganPage from './pages/admin/KeuanganPage';
import SuratPage from './pages/admin/SuratPage';
import AduanPage from './pages/admin/AduanPage';
import SettingsPage from './pages/admin/SettingsPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import AnnouncementsPage from './pages/admin/AnnouncementsPage';
import BukuTamuPage from './pages/admin/BukuTamuPage';
import LoginPage from './pages/auth/LoginPage';
import WargaLayout from './layouts/WargaLayout';
import WargaHomePage from './pages/warga/WargaHomePage';
import WargaSuratPage from './pages/warga/WargaSuratPage';
import WargaLaporPage from './pages/warga/WargaLaporPage';
import WargaProfilPage from './pages/warga/WargaProfilPage';
import WargaIuranPage from './pages/warga/WargaIuranPage';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="rt-theme">
      <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="warga" element={<WargaPage />} />
          <Route path="keluarga" element={<KeluargaPage />} />
          <Route path="keuangan" element={<KeuanganPage />} />
          <Route path="surat" element={<SuratPage />} />
          <Route path="aduan" element={<AduanPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="buku-tamu" element={<BukuTamuPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Warga Routes */}
        <Route path="/warga" element={<WargaLayout />}>
          <Route index element={<WargaHomePage />} />
          <Route path="surat" element={<WargaSuratPage />} />
          <Route path="lapor" element={<WargaLaporPage />} />
          <Route path="profil" element={<WargaProfilPage />} />
          <Route path="iuran" element={<WargaIuranPage />} />
        </Route>

        {/* Redirect root to login for now */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
