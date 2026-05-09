import { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';
import { Calendar, ChevronLeft, Bell, Info } from 'lucide-react';

export default function WargaInfoPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('announcements')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });
      setAnnouncements(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Header */}
      <div className="flex items-center gap-4 px-2">
        <Link to="/warga" className="h-10 w-10 bg-white dark:bg-slate-900 rounded-xl shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-400">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight uppercase">Info Terkini</h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Berita & Pengumuman RT</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="h-12 w-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Memuat Berita...</p>
        </div>
      ) : announcements.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800 mx-2">
          <div className="h-20 w-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="h-10 w-10 text-slate-300" />
          </div>
          <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Belum Ada Pengumuman</h4>
          <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase leading-relaxed">Cek kembali nanti untuk info terbaru dari RT.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((item) => (
            <Card key={item.id} className={`border-none bg-white dark:bg-slate-900 shadow-sm rounded-[2rem] overflow-hidden mx-2 ${item.is_pinned ? 'ring-2 ring-emerald-500/30' : ''}`}>
              <CardContent className="p-6">
                <div className="flex gap-5">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${item.is_pinned ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'}`}>
                    {item.is_pinned ? <Info className="h-7 w-7" /> : <Calendar className="h-7 w-7" />}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`text-[9px] font-black uppercase tracking-widest ${item.is_pinned ? 'text-emerald-600' : 'text-blue-600'}`}>
                        {item.is_pinned ? 'Sangat Penting' : 'Pengumuman'}
                      </span>
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">
                        {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <h4 className="font-black text-slate-800 dark:text-white text-lg leading-tight">{item.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {item.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
