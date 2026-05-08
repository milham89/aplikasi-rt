import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Home, Users, BookOpen, LogOut, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-navy-900 text-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-navy-800">
          <h1 className="text-xl font-bold text-white">Admin RT</h1>
        </div>
        <nav className="flex-1 py-4 flex flex-col gap-2 px-3">
          <Link to="/admin" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-navy-800 text-slate-300 hover:text-white transition-colors">
            <Home className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
          <Link to="/admin/warga" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-navy-800 text-slate-300 hover:text-white transition-colors">
            <Users className="mr-3 h-5 w-5" />
            Manajemen Warga
          </Link>
          <Link to="/admin/keuangan" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-navy-800 text-slate-300 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
            Keuangan & Iuran
          </Link>
          <Link to="/admin/surat" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-navy-800 text-slate-300 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            Persuratan
          </Link>
          <Link to="/admin/aduan" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-navy-800 text-slate-300 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
            Laporan & Aduan
          </Link>
          <Link to="/admin/buku-tamu" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-navy-800 text-slate-300 hover:text-white transition-colors">
            <BookOpen className="mr-3 h-5 w-5" />
            Buku Tamu
          </Link>
        </nav>
        <div className="p-4 border-t border-navy-800">
          <button onClick={handleLogout} className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg hover:bg-red-500 hover:text-white transition-colors text-slate-300">
            <LogOut className="mr-3 h-5 w-5" />
            Keluar
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white shadow-sm flex items-center px-8 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Portal Pengurus</h2>
          <div className="ml-auto">
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
