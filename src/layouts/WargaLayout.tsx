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
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl relative pb-20 overflow-hidden">
      {/* Dynamic Header with Gradient */}
      <header className="relative bg-mesh-gradient text-white pt-10 pb-12 px-6 rounded-b-[2.5rem] shadow-lg">
        <div className="absolute inset-0 bg-navy-900/40 mix-blend-multiply rounded-b-[2.5rem]"></div>
        <div className="relative z-10 flex justify-between items-start">
          <div className="animate-fade-in">
            <p className="text-emerald-300 text-sm font-medium mb-1">Selamat Datang,</p>
            <h1 className="text-2xl font-bold tracking-tight">Keluarga Bpk. Budi</h1>
            <p className="text-xs text-slate-300 mt-1 opacity-80">Blok A No. 12</p>
          </div>
          <button onClick={handleLogout} className="p-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all shadow-sm">
            <LogOut className="h-5 w-5 text-white" />
          </button>
        </div>
      </header>

      {/* Main Content Area - Shifted up slightly to overlap header */}
      <main className="flex-1 p-6 overflow-auto z-20 -mt-6">
        <div className="animate-fade-in stagger-1">
          <Outlet />
        </div>
      </main>

      {/* Modern Glassmorphism Bottom Navigation */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[calc(28rem-2rem)] glass-panel rounded-2xl flex justify-around py-3 px-2 z-50">
        <button className="flex flex-col items-center justify-center w-16 text-emerald-600 transition-all transform scale-105">
          <div className="p-1.5 bg-emerald-100 rounded-xl mb-1">
            <Home className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-bold">Beranda</span>
        </button>
        <button className="flex flex-col items-center justify-center w-16 text-slate-400 hover:text-emerald-600 transition-all">
          <div className="p-1.5 mb-1">
            <FileText className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-medium">Surat</span>
        </button>
        <button className="flex flex-col items-center justify-center w-16 text-slate-400 hover:text-emerald-600 transition-all">
          <div className="p-1.5 mb-1">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-medium">Lapor</span>
        </button>
        <button className="flex flex-col items-center justify-center w-16 text-slate-400 hover:text-emerald-600 transition-all">
          <div className="p-1.5 mb-1">
            <User className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-medium">Profil</span>
        </button>
      </nav>
    </div>
  );
}
