import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, BookOpen, LogOut, Settings, Bell, Search, Menu, CreditCard, FileText, AlertTriangle, Sun, Moon, UserCog, Megaphone, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../components/ThemeProvider';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [adminName, setAdminName] = useState('Bpk. Ketua RT');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [totalPending, setTotalPending] = useState(0);

  useEffect(() => {
    const fetchAdminName = async () => {
      try {
        const { data } = await supabase.from('app_settings').select('admin_name').eq('id', 1).single();
        if (data) setAdminName(data.admin_name);
      } catch (err) {
        console.warn("Table app_settings not found, using default name.");
      }
    };
    fetchAdminName();
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Auto-refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      // 1. Fetch Pending Letters
      const { data: letters } = await supabase
        .from('letters')
        .select('id, title, status, created_at, residents(full_name)')
        .eq('status', 'pending')
        .limit(5);

      // 2. Fetch Pending Complaints
      const { data: complaints } = await supabase
        .from('complaints')
        .select('id, title, status, created_at, residents(full_name)')
        .eq('status', 'pending')
        .limit(5);

      // 3. Fetch Pending Payments
      const { data: payments } = await supabase
        .from('resident_payments')
        .select('id, amount, status, created_at, residents(full_name)')
        .eq('status', 'pending')
        .limit(5);

      const combined: any[] = [];
      if (letters) {
        letters.forEach(l => combined.push({
          id: l.id,
          type: 'surat',
          title: 'Permintaan Surat',
          content: `${(l as any).residents?.full_name} mengajukan ${l.title}`,
          date: l.created_at,
          link: '/admin/surat'
        }));
      }
      if (complaints) {
        complaints.forEach(c => combined.push({
          id: c.id,
          type: 'aduan',
          title: 'Aduan Warga Baru',
          content: `${(c as any).residents?.full_name}: ${c.title}`,
          date: c.created_at,
          link: '/admin/aduan'
        }));
      }
      if (payments) {
        payments.forEach(p => combined.push({
          id: p.id,
          type: 'bayar',
          title: 'Konfirmasi Iuran',
          content: `${(p as any).residents?.full_name} membayar Rp ${Number(p.amount).toLocaleString('id-ID')}`,
          date: p.created_at,
          link: '/admin/keuangan'
        }));
      }

      // Sort by date newest first
      combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setNotifications(combined);
      setTotalPending(combined.length);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    // Close sidebar on route change (for mobile)
    setIsSidebarOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: Home },
    { name: 'Data Warga', path: '/admin/warga', icon: Users },
    { name: 'Data Keluarga', path: '/admin/keluarga', icon: BookOpen },
    { name: 'Keuangan & Iuran', path: '/admin/keuangan', icon: CreditCard },
    { name: 'Persuratan', path: '/admin/surat', icon: FileText },
    { name: 'Manajemen Pengumuman', path: '/admin/announcements', icon: Megaphone },
    { name: 'Manajemen User', path: '/admin/users', icon: UserCog },
    { name: 'Laporan & Aduan', path: '/admin/aduan', icon: AlertTriangle },
    { name: 'Buku Tamu', path: '/admin/buku-tamu', icon: Search },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans transition-colors duration-300">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[60] md:hidden transition-all duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Modern Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-sm z-[70] transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        {/* Logo Area */}
        <div className="h-20 flex items-center px-8 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 mr-3">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-none">Digital RT</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Admin Portal</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-slate-400 hover:text-rose-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 scrollbar-hide">
          <p className="px-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Menu Utama</p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 shadow-sm ring-1 ring-emerald-500/20 dark:ring-emerald-500/30' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Area */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 flex items-center mb-3 border border-slate-100 dark:border-slate-700/50">
            <img src="https://i.pravatar.cc/100?img=11" alt="Admin" className="h-10 w-10 rounded-full border-2 border-white dark:border-slate-700 shadow-sm" />
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{adminName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Administrator</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium rounded-xl text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Keluar Sistem
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg active:scale-90 transition-transform"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            {/* Search Bar */}
            <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 w-80 border border-transparent focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
              <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              <input 
                type="text" 
                placeholder="Cari data warga, surat..." 
                className="bg-transparent border-none focus:outline-none text-sm ml-2 w-full text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 relative">
            {/* Dark Mode Toggle */}
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-full transition-colors"
              title="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-emerald-400" /> : <Moon className="h-5 w-5" />}
            </button>
            
            {/* Notification */}
            <div className="relative">
              <button 
                onClick={() => document.getElementById('notif-dropdown')?.classList.toggle('hidden')}
                className="relative p-2.5 text-slate-500 dark:text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-full transition-colors focus:outline-none"
              >
                <span className="relative p-2.5 text-slate-500 dark:text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-full transition-colors focus:outline-none">
                  <Bell className="h-5 w-5" />
                  {totalPending > 0 && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-rose-500 text-white text-[8px] font-black rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                      {totalPending}
                    </span>
                  )}
                </span>
              </button>
              
              {/* Dropdown Notifikasi */}
              <div id="notif-dropdown" className="hidden absolute right-0 mt-3 w-85 bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-800 z-50 overflow-hidden transition-all animate-in zoom-in-95 duration-200 origin-top-right">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Notifikasi Baru</h3>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full font-black uppercase tracking-widest">{totalPending} Pending</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[350px] overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-10 text-center">
                      <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-6 w-6 text-emerald-500" />
                      </div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Semua tugas selesai!</p>
                    </div>
                  ) : (
                    notifications.map((notif, idx) => (
                      <Link 
                        key={idx} 
                        to={notif.link} 
                        className="block p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                        onClick={() => document.getElementById('notif-dropdown')?.classList.add('hidden')}
                      >
                        <div className="flex gap-4">
                          <div className={`p-2.5 rounded-xl h-fit transition-transform group-hover:scale-110 ${
                            notif.type === 'surat' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 
                            notif.type === 'bayar' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' :
                            'bg-rose-50 dark:bg-rose-900/20 text-rose-600'
                          }`}>
                            {notif.type === 'surat' ? <FileText className="h-5 w-5" /> : 
                             notif.type === 'bayar' ? <CreditCard className="h-5 w-5" /> :
                             <AlertTriangle className="h-5 w-5" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <p className="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight">{notif.title}</p>
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                {new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{notif.content}</p>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="p-4 text-center border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selesaikan tugas anda hari ini</p>
                  </div>
                )}
              </div>
            </div>

            {/* Settings */}
            <Link 
              to="/admin/settings"
              className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-full transition-colors flex items-center justify-center"
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-10 overflow-auto bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-300">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
