import { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { CreditCard, FileText, AlertTriangle, PhoneCall, ChevronRight, Zap, Info, Calendar, AlertCircle, ShieldCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function WargaHomePage() {
  const { resident } = useOutletContext<{ resident: any }>();
  const [hasUnpaidDues, setHasUnpaidDues] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (resident?.id) {
      checkDuesStatus();
      fetchAnnouncements();
    }
  }, [resident]);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(3);
      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const checkDuesStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('dues_payments')
        .select('id')
        .eq('resident_id', resident.id)
        .eq('status', 'pending');
      
      if (error) throw error;
      setHasUnpaidDues(data && data.length > 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Wallet-Style Status Card - Now Dynamic */}
      <div className="relative pt-2">
        <div className={`absolute inset-0 rounded-[2.5rem] blur-3xl opacity-10 animate-pulse ${hasUnpaidDues ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
        <Card className="bg-white dark:bg-slate-900 border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden relative">
          <CardContent className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="space-y-1">
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${hasUnpaidDues ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10'}`}>
                  Status Iuran
                </span>
                <h2 className={`text-3xl font-black tracking-tighter pt-2 ${hasUnpaidDues ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
                  {loading ? 'MENGECEK...' : hasUnpaidDues ? 'ADA TUNGGAKAN' : 'LUNAS'}
                </h2>
              </div>
              <div className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center shadow-lg transition-colors ${hasUnpaidDues ? 'bg-rose-500 shadow-rose-500/30' : 'bg-emerald-500 shadow-emerald-500/30'}`}>
                {hasUnpaidDues ? <AlertCircle className="h-8 w-8 text-white" /> : <ShieldCheck className="h-8 w-8 text-white" />}
              </div>
            </div>
            
            <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${hasUnpaidDues ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800'}`}>
              <div className="h-8 w-8 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
                <Info className={`h-4 w-4 ${hasUnpaidDues ? 'text-rose-500' : 'text-emerald-500'}`} />
              </div>
              <p className={`text-xs font-bold ${hasUnpaidDues ? 'text-rose-700 dark:text-rose-400' : 'text-slate-600 dark:text-slate-300'}`}>
                {hasUnpaidDues ? 'Segera lakukan pembayaran untuk bulan ini' : 'Terverifikasi oleh admin'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid Menu */}
      <div className="grid grid-cols-2 gap-5">
        <ModernAction to="/warga/surat" icon={<FileText className="h-6 w-6" />} label="Layanan Surat" desc="KTP, Domisili, dll" color="bg-blue-500" light="bg-blue-50 text-blue-600" />
        <ModernAction to="/warga/lapor" icon={<AlertTriangle className="h-6 w-6" />} label="Lapor Aduan" desc="Keluhan Warga" color="bg-rose-500" light="bg-rose-50 text-rose-600" />
        <ModernAction to="/warga/profil" icon={<Zap className="h-6 w-6" />} label="Data Keluarga" desc="Profil & No. KK" color="bg-amber-500" light="bg-amber-50 text-amber-600" />
        <ModernAction to="/warga/iuran" icon={<CreditCard className="h-6 w-6" />} label="Bayar Iuran" desc="E-Wallet / Bank" color="bg-emerald-500" light="bg-emerald-50 text-emerald-600" />
      </div>

      {/* Info Sections */}
      <div className="space-y-5">
        <div className="flex justify-between items-end px-2">
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Info Terkini</h3>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">Berita RT Sekitar Anda</p>
          </div>
          <button className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-xl hover:bg-emerald-500 hover:text-white transition-all">
            LIHAT SEMUA
          </button>
        </div>

        {announcements.length === 0 ? (
          <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800 mx-2">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Belum ada info terbaru</p>
          </div>
        ) : (
          announcements.map((item) => (
            <Link key={item.id} to="#" className="block group">
              <Card className={`border-none bg-white dark:bg-slate-900 shadow-sm rounded-[2rem] overflow-hidden hover:shadow-xl transition-all duration-500 group-active:scale-95 mx-2 ${item.is_pinned ? 'ring-2 ring-emerald-500/30' : ''}`}>
                <CardContent className="p-6 flex gap-5">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${item.is_pinned ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20'}`}>
                    <Calendar className="h-7 w-7" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className={`text-[9px] font-black uppercase tracking-widest ${item.is_pinned ? 'text-emerald-600' : 'text-indigo-600'}`}>
                        {item.is_pinned ? 'Penting' : 'Pengumuman'}
                      </span>
                      <span className="text-[9px] text-slate-400 font-black uppercase">
                        {new Date(item.created_at).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <h4 className="font-black text-slate-800 dark:text-white text-base leading-tight">{item.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium line-clamp-2">
                      {item.content}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>

    </div>
  );
}

function ModernAction({ to, icon, label, desc, color, light }: any) {
  return (
    <Link to={to} className="group relative block">
      <div className={`absolute inset-0 ${color} rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-10 transition-opacity`}></div>
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-sm border border-slate-50 dark:border-slate-800 relative z-10 transition-all duration-300 group-hover:-translate-y-1 group-active:scale-95">
        <div className={`h-14 w-14 ${light} rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
          {icon}
        </div>
        <h4 className="text-sm font-black text-slate-900 dark:text-white mb-1 leading-tight">{label}</h4>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-tight uppercase tracking-tighter">{desc}</p>
      </div>
    </Link>
  );
}
