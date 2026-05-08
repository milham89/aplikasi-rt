import { Outlet, useNavigate } from 'react-router-dom';
import { Home, FileText, AlertTriangle, LogOut, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function WargaLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-xl relative pb-16">
      {/* Mobile App Header */}
      <header className="bg-navy-900 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-emerald-400 text-sm font-medium">Selamat Datang,</p>
            <h1 className="text-xl font-bold">Aplikasi Warga</h1>
          </div>
          <button onClick={handleLogout} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
            <LogOut className="h-5 w-5 text-white" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-slate-200 flex justify-around py-3 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] rounded-t-2xl z-50">
        <button className="flex flex-col items-center text-emerald-600 gap-1">
          <Home className="h-6 w-6" />
          <span className="text-[10px] font-medium">Beranda</span>
        </button>
        <button className="flex flex-col items-center text-slate-400 hover:text-emerald-600 transition-colors gap-1">
          <FileText className="h-6 w-6" />
          <span className="text-[10px] font-medium">Surat</span>
        </button>
        <button className="flex flex-col items-center text-slate-400 hover:text-emerald-600 transition-colors gap-1">
          <AlertTriangle className="h-6 w-6" />
          <span className="text-[10px] font-medium">Lapor</span>
        </button>
        <button className="flex flex-col items-center text-slate-400 hover:text-emerald-600 transition-colors gap-1">
          <User className="h-6 w-6" />
          <span className="text-[10px] font-medium">Profil</span>
        </button>
      </nav>
    </div>
  );
}
