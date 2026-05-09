import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';
import { AlertTriangle, Clock, CheckCircle, Search, MessageSquare, ArrowUpRight, Filter, Trash2 } from 'lucide-react';

export default function AduanPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchComplaints();
  }, [filterStatus]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      // Fetch data dasar dulu untuk memastikan sinkronisasi tabel
      const { data, error } = await supabase
        .from('complaints')
        .select(`
          *,
          residents (
            full_name,
            nik
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Filter status di sisi client agar lebih responsif
      if (filterStatus === 'all') {
        setComplaints(data || []);
      } else {
        setComplaints((data || []).filter(c => c.status === filterStatus));
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('complaints')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) throw error;
      fetchComplaints();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Hapus laporan aduan ini?")) return;
    try {
      const { error } = await supabase
        .from('complaints')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchComplaints();
    } catch (error: any) {
      alert("Gagal menghapus: " + error.message);
    }
  };

  const filteredComplaints = complaints.filter(item => 
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.residents?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Laporan & Aduan Warga</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Pantau & Tindak Lanjuti Keluhan Lingkungan</p>
        </div>
      </div>
      
      {/* Quick Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex gap-2 w-full md:w-auto">
          {['all', 'open', 'in_progress', 'resolved'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filterStatus === s 
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' 
                : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {s === 'all' ? 'SEMUA' : s === 'in_progress' ? 'DIPROSES' : s === 'resolved' ? 'SELESAI' : 'BARU'}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari laporan atau nama..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-rose-500 transition-all"
          />
        </div>
      </div>

      <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 font-black text-[10px] uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-8 py-5">Tgl Lapor</th>
                <th className="px-8 py-5">Pelapor</th>
                <th className="px-8 py-5">Laporan</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {loading ? (
                <tr><td colSpan={5} className="px-8 py-12 text-center text-slate-400 font-bold italic">Menyinkronkan aduan...</td></tr>
              ) : filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <AlertTriangle className="h-12 w-12 text-slate-100 mb-4" />
                      <p className="text-slate-400 font-bold">Tidak ada laporan aduan masuk</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-8 py-5">
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400">{new Date(item.created_at).toLocaleDateString('id-ID')}</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.residents?.full_name}</p>
                      <p className="text-[10px] text-slate-500 font-bold">NIK: {item.residents?.nik}</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-rose-600 uppercase tracking-tight mb-0.5">{item.title}</p>
                      <p className="text-xs text-slate-500 font-medium line-clamp-1">{item.description}</p>
                    </td>
                    <td className="px-8 py-5">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-3">
                        {item.status === 'open' && (
                          <button 
                            onClick={() => updateStatus(item.id, 'in_progress')} 
                            className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                          >
                            <Clock className="h-3 w-3" /> TINDAK LANJUTI
                          </button>
                        )}
                        {(item.status === 'open' || item.status === 'in_progress') && (
                          <button 
                            onClick={() => updateStatus(item.id, 'resolved')} 
                            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                          >
                            <CheckCircle className="h-3 w-3" /> SELESAIKAN
                          </button>
                        )}
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400"><ArrowUpRight className="h-4 w-4" /></button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg text-rose-500 transition-colors"
                          title="Hapus Aduan"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: any = {
    open: { label: 'BARU', color: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400' },
    in_progress: { label: 'DIPROSES', color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' },
    resolved: { label: 'SELESAI', color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' },
  };
  const config = configs[status] || { label: status, color: 'bg-slate-50 text-slate-600' };
  return <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${config.color}`}>{config.label}</span>;
}
