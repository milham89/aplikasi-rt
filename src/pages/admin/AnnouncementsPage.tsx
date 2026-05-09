import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';
import { Megaphone, Plus, Trash2, Pin, Calendar, Search, X, Save, Loader2, FileText, CheckCircle } from 'lucide-react';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    is_pinned: false
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });
      if (error) throw error;
      setAnnouncements(data || []);
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
      const { error } = await supabase
        .from('announcements')
        .insert([formData]);
      if (error) throw error;
      alert("Pengumuman berhasil diterbitkan!");
      setIsModalOpen(false);
      setFormData({ title: '', content: '', is_pinned: false });
      fetchAnnouncements();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pengumuman ini secara permanen?")) return;
    try {
      const { error } = await supabase.from('announcements').delete().eq('id', id);
      if (error) throw error;
      alert("Pengumuman berhasil dihapus!");
      fetchAnnouncements();
    } catch (error: any) {
      alert("Gagal menghapus: " + error.message);
      console.error("Delete Error:", error);
    }
  };

  const togglePin = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .update({ is_pinned: !currentStatus })
        .eq('id', id);
      if (error) throw error;
      fetchAnnouncements();
    } catch (error: any) {
      alert("Gagal mengubah status semat: " + error.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Manajemen Pengumuman</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Siarkan Informasi Kepada Seluruh Warga</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-black shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 text-xs uppercase tracking-widest"
        >
          <Plus className="h-4 w-4" /> Buat Pengumuman
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-20 italic text-slate-400 font-bold">Sinkronisasi pengumuman...</div>
        ) : announcements.length === 0 ? (
          <div className="col-span-full py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800 text-center">
            <Megaphone className="h-12 w-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold">Belum ada pengumuman yang diterbitkan</p>
          </div>
        ) : (
          announcements.map((item) => (
            <Card key={item.id} className={`border-none shadow-sm rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900 group hover:shadow-xl transition-all duration-300 ${item.is_pinned ? 'ring-2 ring-emerald-500/50' : ''}`}>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="h-12 w-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-emerald-500">
                    <Megaphone className="h-6 w-6" />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => togglePin(item.id, item.is_pinned)} 
                      className={`p-2 rounded-xl transition-all ${item.is_pinned ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-50 dark:bg-slate-800 text-slate-300 hover:text-emerald-500'}`}
                      title={item.is_pinned ? "Lepas Pin" : "Sematkan"}
                    >
                      <Pin className={`h-4 w-4 ${item.is_pinned ? 'fill-current' : ''}`} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)} 
                      className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-300 hover:text-rose-500 rounded-xl transition-all"
                      title="Hapus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tight line-clamp-2">{item.title}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                    <Calendar className="h-3 w-3" /> {new Date(item.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                  </p>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium line-clamp-3 leading-relaxed">
                  {item.content}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal Terbitkan Pengumuman */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Terbitkan Pengumuman</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Siarkan informasi ke seluruh warga</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-rose-500 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Judul Informasi</label>
                <div className="relative">
                  <Megaphone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <input 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Contoh: Kerja Bakti Massal"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Isi Pesan / Pengumuman</label>
                <textarea 
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-emerald-500 min-h-[120px]"
                  placeholder="Tuliskan detail pengumuman di sini..."
                />
              </div>

              <div className="flex items-center gap-3 px-1">
                <input 
                  type="checkbox" 
                  id="pin" 
                  checked={formData.is_pinned}
                  onChange={(e) => setFormData({...formData, is_pinned: e.target.checked})}
                  className="h-5 w-5 rounded-lg border-slate-200 text-emerald-500 focus:ring-emerald-500" 
                />
                <label htmlFor="pin" className="text-xs font-bold text-slate-600 dark:text-slate-400 cursor-pointer uppercase tracking-tighter">Sematkan di bagian atas (Pin)</label>
              </div>

              <button type="submit" disabled={isSaving} className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 active:scale-95 transition-all">
                {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
                TERBITKAN SEKARANG
              </button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
