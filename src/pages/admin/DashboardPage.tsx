import { useState, useEffect } from 'react';
import { Users, FileText, Activity, CreditCard, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';

export default function DashboardPage() {
  const [totalWarga, setTotalWarga] = useState(0);
  const [suratMenunggu, setSuratMenunggu] = useState(0);
  const [aduanAktif, setAduanAktif] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch Total Warga
      const { count: wargaCount } = await supabase
        .from('residents')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Aktif');
      
      // Fetch Surat Menunggu
      const { count: suratCount } = await supabase
        .from('surat_warga')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'requested');

      // Fetch Aduan Aktif
      const { count: aduanCount } = await supabase
        .from('resident_complaints')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open');

      setTotalWarga(wargaCount || 0);
      setSuratMenunggu(suratCount || 0);
      setAduanAktif(aduanCount || 0);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
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
              <h3 className="text-3xl font-bold text-slate-800">0</h3>
              <p className="text-sm font-medium text-slate-400 mb-1">Keluarga</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Activity Timeline */}
      <div className="mt-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Aktivitas Terkini</h3>
            <p className="text-sm text-slate-500">Log aktivitas warga dalam 24 jam terakhir.</p>
          </div>
        </div>
        
        <Card className="border border-slate-200 shadow-sm overflow-hidden p-8 text-center">
            <p className="text-slate-500">Belum ada aktivitas terekam di database.</p>
        </Card>
      </div>
    </div>
  );
}
