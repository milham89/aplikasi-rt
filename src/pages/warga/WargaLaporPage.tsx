import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';
import { AlertTriangle, Send, Loader2, Info, MessageSquare, Clock, CheckCircle, Plus, X } from 'lucide-react';

export default function WargaLaporPage() {
  const { resident } = useOutletContext<{ resident: any }>();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newLaporan, setNewLaporan] = useState({
    title: '',
    category: 'Fasilitas Umum',
    description: ''
  });

  useEffect(() => {
    if (resident?.id) {
      fetchComplaints();
    }
  }, [resident]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('resident_complaints')
        .select('*')
        .eq('resident_id', resident.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setComplaints(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabase.from('resident_complaints').insert([{
        resident_id: resident.id,
        title: newLaporan.title,
        category: newLaporan.category,
        description: newLaporan.description,
        status: 'open'
      }]);
      if (error) throw error;
      setIsModalOpen(false);
      setNewLaporan({ title: '', category: 'Fasilitas Umum', description: '' });
      fetchComplaints();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400';
      case 'in_progress': return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400';
      case 'resolved': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400';
      default: return 'bg-slate-50 text-slate-700';
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex justify-between items-end px-2">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Lapor Aduan</h2>
          <p className="text-[10px] text-slate-900 dark:text-white/70 font-black mt-1 uppercase tracking-widest">Digital RT Management System</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-rose-500 text-white p-4 rounded-2xl shadow-xl shadow-rose-500/20 active:scale-95 transition-all"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      <div className="p-5 bg-rose-50 dark:bg-rose-500/10 rounded-[2rem] border border-rose-100 dark:border-rose-800/50 flex gap-4 mx-2">
        <Info className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
        <p className="text-[10px] font-bold text-rose-800 dark:text-rose-200 leading-relaxed uppercase tracking-tight">
          Laporan Anda akan langsung masuk ke dashboard pengurus RT untuk segera ditindaklanjuti.
        </p>
      </div>

      {/* History List */}
      <div className="space-y-4">
        <h3 className="px-2 text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Riwayat Laporan Anda</h3>
        {loading ? (
          <div className="text-center py-10 italic text-slate-400 font-bold">Memuat data aduan...</div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800 mx-2">
            <AlertTriangle className="h-10 w-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-bold text-sm">Belum ada laporan yang dibuat</p>
          </div>
        ) : (
          complaints.map((item) => (
            <Card key={item.id} className="border-none bg-white dark:bg-slate-900 shadow-sm rounded-[2rem] overflow-hidden mx-2">
              <CardContent className="p-6 flex items-start gap-5">
                <div className={`h-14 w-14 ${getStatusColor(item.status)} rounded-2xl flex items-center justify-center shrink-0`}>
                  <AlertTriangle className="h-7 w-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-slate-800 dark:text-white text-base truncate mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${getStatusColor(item.status)}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                    <span className="text-[9px] text-slate-400 font-black uppercase">
                      {new Date(item.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal Lapor Baru */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/90 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-[3rem] sm:rounded-[2.5rem] shadow-2xl animate-in slide-in-from-bottom duration-500 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm z-10">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Kirim Laporan</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Judul Laporan</label>
                  <input 
                    required
                    value={newLaporan.title}
                    onChange={(e) => setNewLaporan({...newLaporan, title: e.target.value})}
                    placeholder="Contoh: Lampu Jalan Mati"
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-800 dark:text-white border-none focus:ring-2 focus:ring-rose-500 shadow-inner" 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Kategori</label>
                  <select 
                    value={newLaporan.category}
                    onChange={(e) => setNewLaporan({...newLaporan, category: e.target.value})}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-800 dark:text-white border-none focus:ring-2 focus:ring-rose-500 shadow-inner"
                  >
                    <option>Fasilitas Umum</option>
                    <option>Kebersihan</option>
                    <option>Keamanan</option>
                    <option>Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Isi Laporan</label>
                  <textarea 
                    required
                    value={newLaporan.description}
                    onChange={(e) => setNewLaporan({...newLaporan, description: e.target.value})}
                    placeholder="Ceritakan detail masalahnya..."
                    rows={4}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-800 dark:text-white border-none focus:ring-2 focus:ring-rose-500 shadow-inner"
                  />
                </div>
              </div>

              <button type="submit" disabled={isSaving} className="w-full py-5 bg-rose-500 text-white rounded-2xl font-black shadow-xl shadow-rose-500/30 flex items-center justify-center gap-3 active:scale-95 transition-all">
                {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
                KIRIM LAPORAN
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
