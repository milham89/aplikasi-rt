import { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { Home, FileText, AlertTriangle, LogOut, User, Loader2, Bell, Moon, Sun, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import React from 'react';

export default function WargaLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [resident, setResident] = useState<any>(null);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode immediately to avoid flash
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  useEffect(() => {
    fetchResidentData();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const fetchResidentData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/login'); return; }

      // Safe username extraction
      const uname = user.email?.split('@')[0] || '';

      let finalResident = { 
        id: '00000000-0000-0000-0000-000000000000',
        full_name: 'Warga Digital', 
        username: uname,
        nik: '-',
        families: { address: 'RT 01', no_kk: '0000000000000000' }
      };

      // 1. Search by user_id as the most accurate link
      const { data: resByUserId } = await supabase
        .from('residents')
        .select('*, families(*)')
        .eq('user_id', user.id)
        .maybeSingle();

      if (resByUserId) {
        finalResident = resByUserId;
      } else if (uname) {
        // 2. Fallback to username search for backward compatibility
        const { data: resUname } = await supabase.from('residents').select('*, families(*)').eq('username', uname).maybeSingle();
        if (resUname) finalResident = resUname;
      }

      setResident(finalResident);
    } catch (error) {
      console.error('Layout critical failure:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (resident?.id && resident.id !== '00000000-0000-0000-0000-000000000000') {
      fetchNotifications();
    }
  }, [resident]);

  const fetchNotifications = async () => {
    try {
      // Use fallback table logic for notifications too
      let letters = [];
      try {
        const { data } = await supabase.from('letters').select('*').eq('resident_id', resident.id).in('status', ['processed', 'completed']).order('created_at', { ascending: false }).limit(5);
        letters = data || [];
      } catch (e) {
        console.error("Letters fetch failed");
      }

      const recentNotifs = letters.map((l: any) => ({
        id: l.id,
        type: 'letter',
        title: `Surat ${l.type}`,
        desc: l.status === 'completed' ? 'Sudah selesai & bisa diambil' : 'Sedang diproses oleh Admin',
        status: l.status
      }));
      setNotifications(recentNotifs);
    } catch (error) {
      console.error("Notification error:", error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 10) return 'Selamat Pagi';
    if (hour >= 10 && hour < 15) return 'Selamat Siang';
    if (hour >= 15 && hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 transition-colors">
        <div className="relative">
          <div className="h-16 w-16 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex flex-col max-w-lg mx-auto shadow-2xl relative pb-24 overflow-hidden font-sans transition-colors duration-500">
      <header className="relative pt-12 pb-20 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>

        <div className="relative z-10 flex justify-between items-center">
          <div className="animate-in slide-in-from-left duration-700 flex items-center gap-4 pr-2">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-emerald-500/20 shrink-0 overflow-hidden">
              {resident?.avatar_url ? (
                <img src={resident.avatar_url} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                resident?.full_name?.charAt(0) || 'W'
              )}
            </div>
            <div>
              <h2 className="text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em] mb-1 drop-shadow-sm">Portal Warga Digital</h2>
              <div className="flex flex-col">
                <p className="text-xl font-black text-white tracking-tight leading-none uppercase">
                  {resident?.full_name || 'Warga Digital'}
                </p>
                <p className="text-[10px] font-black text-emerald-300 tracking-widest mt-1 uppercase">
                  @{resident?.username || 'user'}
                </p>
              </div>
              <span className="block text-slate-400 font-black text-[9px] mt-0.5 uppercase tracking-widest whitespace-normal leading-relaxed">
                {resident?.families?.no_kk ? `Blok ${resident?.families?.no_kk?.slice(-3)}` : 'Grup A'} • {resident?.families?.address || 'RT 01'}
              </span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={toggleDarkMode} className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-all text-white">
              {isDarkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-indigo-300" />}
            </button>
            <button onClick={handleLogout} className="p-3 bg-rose-500/10 backdrop-blur-md rounded-2xl border border-rose-500/20 hover:bg-rose-500/20 transition-all text-rose-400">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 -mt-10 relative z-20 overflow-y-auto custom-scrollbar">
        <div className="animate-in fade-in zoom-in-95 duration-500">
          {/* Sediakan fungsi refreshData ke semua halaman anak */}
          <Outlet context={{ resident, refreshData: fetchResidentData }} />
        </div>
      </main>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
        <nav className="bg-[#1E293B]/90 backdrop-blur-2xl rounded-[2.5rem] p-2 flex justify-between items-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10">
          <NavItem to="/warga" icon={<Home />} label="Beranda" active={location.pathname === '/warga'} />
          <NavItem to="/warga/surat" icon={<FileText />} label="Surat" active={location.pathname === '/warga/surat'} />
          <NavItem to="/warga/lapor" icon={<AlertTriangle />} label="Lapor" active={location.pathname === '/warga/lapor'} />
          <NavItem to="/warga/profil" icon={<User />} label="Profil" active={location.pathname === '/warga/profil'} />
        </nav>
      </div>
    </div>
  );
}

function NavItem({ to, icon, label, active }: { to: string, icon: any, label: string, active: boolean }) {
  return (
    <Link to={to} className={`flex-1 flex flex-col items-center justify-center py-2 px-1 transition-all duration-500 relative ${active ? 'text-white' : 'text-slate-500'}`}>
      <div className={`relative z-10 transition-transform duration-300 ${active ? 'scale-110 -translate-y-1' : 'scale-100'}`}>
        {React.cloneElement(icon, { className: `h-6 w-6 ${active ? 'text-emerald-400' : ''}` })}
      </div>
      <span className={`text-[9px] font-black mt-1 transition-all duration-300 uppercase tracking-tighter ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        {label}
      </span>
      {active && (
        <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-xl animate-pulse"></div>
      )}
    </Link>
  );
}
