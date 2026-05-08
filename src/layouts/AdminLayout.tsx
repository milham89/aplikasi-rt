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
