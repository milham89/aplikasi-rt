import { useState, useEffect } from 'react';
import { Users, FileText, Activity, CreditCard, ArrowUpRight, ArrowDownRight, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';

export default function DashboardPage() {
  const [totalWarga, setTotalWarga] = useState(0);
  const [suratMenunggu, setSuratMenunggu] = useState(0);
  const [aduanAktif, setAduanAktif] = useState(0);
  const [unpaidDues, setUnpaidDues] = useState(0);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // 1. Fetch Basic Counts (Defensive)
      const [wargaRes, suratRes, aduanRes, iuranRes] = await Promise.all([
        supabase.from('residents').select('id', { count: 'exact', head: true }),
        supabase.from('letters').select('id', { count: 'exact', head: true }).neq('status', 'completed'),
        supabase.from('complaints').select('id', { count: 'exact', head: true }).neq('status', 'resolved'),
        supabase.from('payments').select('id', { count: 'exact', head: true }).neq('status', 'verified')
      ]);

      setTotalWarga(wargaRes.count || 0);
      setSuratMenunggu(suratRes.count || 0);
      setAduanAktif(aduanRes.count || 0);
      setUnpaidDues(iuranRes.count || 0);

      // 2. Fetch Recent Activities (Standardized & Defensive)
      // We'll fetch them separately to avoid one failure blocking everything
      const activitiesList: any[] = [];

      try {
        const { data: s } = await supabase.from('letters').select('id, type, created_at, residents(full_name)').order('created_at', { ascending: false }).limit(5);
        if (s) s.forEach(x => activitiesList.push({
          id: x.id, type: 'SURAT', title: x.type, user: x.residents?.full_name || 'Warga', date: x.created_at, icon: <FileText className="h-4 w-4 text-blue-500" />, color: 'bg-blue-50'
        }));
      } catch (e) { console.warn("Letters fetch failed"); }

      try {
        const { data: a } = await supabase.from('complaints').select('id, title, created_at, residents(full_name)').order('created_at', { ascending: false }).limit(5);
        if (a) a.forEach(x => activitiesList.push({
          id: x.id, type: 'ADUAN', title: x.title, user: x.residents?.full_name || 'Warga', date: x.created_at, icon: <AlertTriangle className="h-4 w-4 text-rose-500" />, color: 'bg-rose-50'
        }));
      } catch (e) { console.warn("Complaints fetch failed"); }

      try {
        // For payments, we join families then residents (if possible) or just show Payment
        const { data: p } = await supabase.from('payments').select('id, amount_paid, created_at, status').order('created_at', { ascending: false }).limit(5);
        if (p) p.forEach(x => activitiesList.push({
          id: x.id, type: 'IURAN', title: `Pembayaran Rp${(x.amount_paid || 0).toLocaleString()}`, user: 'Warga', date: x.created_at, icon: <CreditCard className="h-4 w-4 text-emerald-500" />, color: 'bg-emerald-50'
        }));
      } catch (e) { console.warn("Payments fetch failed"); }

      setActivities(activitiesList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8));

    } catch (error) {
      console.error('Dashboard critical error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Ikhtisar Dashboard</h2>
        <p className="text-slate-500 mt-1">Pantau ringkasan data dan aktivitas RT terkini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Card 1 */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-500 to-emerald-600 text-white overflow-hidden relative group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-emerald-100 text-sm font-medium mb-1">Total Warga Aktif</p>
            <h3 className="text-3xl font-bold">{loading ? '...' : totalWarga}</h3>
          </CardContent>
        </Card>
        
        {/* Stat Card 2 */}
        <Card className="border border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <FileText className="h-6 w-6" />
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium mb-1">Permintaan Surat</p>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-bold text-slate-800">{loading ? '...' : suratMenunggu}</h3>
              <p className="text-sm font-medium text-amber-500 mb-1">Menunggu</p>
            </div>
          </CardContent>
        </Card>

        {/* Stat Card 3 */}
        <Card className="border border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                <Activity className="h-6 w-6" />
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium mb-1">Aduan Terbuka</p>
            <h3 className="text-3xl font-bold text-slate-800">{loading ? '...' : aduanAktif}</h3>
          </CardContent>
        </Card>

        {/* Stat Card 4 */}
        <Card className="border border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <CreditCard className="h-6 w-6" />
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium mb-1">Iuran Belum Lunas</p>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-bold text-slate-800">{loading ? '...' : unpaidDues}</h3>
              <p className="text-sm font-medium text-slate-400 mb-1">Transaksi</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Activity Timeline */}
      <div className="mt-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Aktivitas Terkini</h3>
            <p className="text-[10px] text-slate-500 font-black uppercase mt-1 tracking-widest">Log aktivitas warga terbaru dari database</p>
          </div>
        </div>
        
        {loading ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border-none shadow-sm">
            <Clock className="h-8 w-8 animate-spin mx-auto text-slate-300 mb-4" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sinkronisasi Aktivitas...</p>
          </div>
        ) : activities.length === 0 ? (
          <Card className="border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-12 text-center rounded-[2.5rem] bg-white dark:bg-slate-900">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Belum ada aktivitas terekam</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {activities.map((act) => (
              <Card key={`${act.type}-${act.id}`} className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden hover:shadow-md transition-all group">
                <CardContent className="p-5 flex items-center gap-5">
                  <div className={`h-12 w-12 ${act.color} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    {act.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{act?.type || 'AKTIVITAS'}</span>
                      <span className="text-[9px] font-black text-slate-400 uppercase">
                        {act?.date ? new Date(act.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) : '-'} • {act?.date ? new Date(act.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm truncate">{act?.title || 'Tanpa Judul'}</h4>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">{act?.user || 'Warga'}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
