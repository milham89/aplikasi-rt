import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardPage from './pages/admin/DashboardPage';
import WargaPage from './pages/admin/WargaPage';
import BukuTamuPage from './pages/admin/BukuTamuPage';
import KeuanganPage from './pages/admin/KeuanganPage';
import SuratPage from './pages/admin/SuratPage';
import AduanPage from './pages/admin/AduanPage';
import LoginPage from './pages/auth/LoginPage';
import WargaLayout from './layouts/WargaLayout';
import WargaHomePage from './pages/warga/WargaHomePage';

function App() {
  return (
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
          <Route path="buku-tamu" element={<BukuTamuPage />} />
          <Route path="keuangan" element={<KeuanganPage />} />
          <Route path="surat" element={<SuratPage />} />
          <Route path="aduan" element={<AduanPage />} />
        </Route>

        {/* Warga Routes */}
        <Route path="/warga" element={<WargaLayout />}>
          <Route index element={<WargaHomePage />} />
        </Route>

        {/* Redirect root to login for now */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
