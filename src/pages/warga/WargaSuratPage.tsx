import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';
import { FileText, Send, Clock, CheckCircle, AlertCircle, Plus, X, ChevronRight, Info } from 'lucide-react';

export default function WargaSuratPage() {
  const { resident } = useOutletContext<{ resident: any }>();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    type: 'Surat Pengantar KTP',
    purpose: ''
  });

  useEffect(() => {
    if (resident?.id) {
      fetchRequests();
    } else {
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [resident]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('letters')
        .select('*')
        .eq('resident_id', resident.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resident?.id) {
      alert("Data warga belum siap. Mohon tunggu sebentar atau login ulang.");
      return;
    }
    try {
      setLoading(true);
      const { error } = await supabase.from('letters').insert([{
        resident_id: resident.id,
        type: newRequest.type,
        purpose: newRequest.purpose,
        status: 'requested'
      }]);
      
      if (error) {
        console.error("Supabase Insert Error:", error);
        throw error;
      }

      alert("Berhasil! Permohonan surat Anda telah terkirim ke Pengurus RT.");
      setIsModalOpen(false);
      setNewRequest({ type: 'Surat Pengantar KTP', purpose: '' });
      fetchRequests();
    } catch (error: any) {
      alert("Gagal mengirim surat: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'requested': return { color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400', icon: <Clock className="h-4 w-4" />, label: 'DIAJUKAN' };
      case 'processed': return { color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400', icon: <Clock className="h-4 w-4" />, label: 'DIPROSES' };
      case 'completed': return { color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400', icon: <CheckCircle className="h-4 w-4" />, label: 'SELESAI' };
      case 'rejected': return { color: 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400', icon: <X className="h-4 w-4" />, label: 'DITOLAK' };
      default: return { color: 'bg-slate-50 text-slate-700', icon: <AlertCircle className="h-4 w-4" />, label: status };
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex justify-between items-end px-2">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Layanan Surat</h2>
          <p className="text-[10px] text-slate-900 dark:text-white/70 font-black mt-1 uppercase tracking-widest">Digital RT Management System</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-500 text-white p-4 rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      {/* Statistics Mini Cards */}
      <div className="grid grid-cols-2 gap-4 px-2">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] shadow-sm border border-slate-50 dark:border-slate-800">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Permohonan</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{requests.length}</p>
        </div>
        <div className="bg-emerald-500 p-5 rounded-[2rem] shadow-lg shadow-emerald-500/20">
          <p className="text-[10px] font-black text-emerald-100 uppercase tracking-widest mb-1">Selesai</p>
          <p className="text-3xl font-black text-white">{requests.filter(r => r.status === 'completed').length}</p>
        </div>
      </div>

      {/* History List: High Visibility */}
      <div className="space-y-4">
        <h3 className="px-2 text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Riwayat Permohonan</h3>
        {loading ? (
          <div className="text-center py-10 italic text-slate-400 font-bold">Memuat riwayat surat...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800">
            <FileText className="h-10 w-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-bold text-sm">Belum ada permohonan surat</p>
          </div>
        ) : (
          requests.map((req) => {
            const status = getStatusInfo(req.status);
            return (
              <Card key={req.id} className="border-none bg-white dark:bg-slate-900 shadow-sm rounded-[2rem] overflow-hidden">
                <CardContent className="p-6 flex items-center gap-5">
                  <div className={`h-14 w-14 ${status.color} rounded-2xl flex items-center justify-center shrink-0`}>
                    <FileText className="h-7 w-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-black text-slate-900 dark:text-white text-base truncate pr-2">{req.type}</h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-bold truncate leading-relaxed">
                      Keperluan: {req.purpose}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black flex items-center gap-1.5 ${status.color}`}>
                        {status.icon} {status.label}
                      </span>
                      <span className="text-[9px] text-slate-500 font-black uppercase tracking-tighter">
                        {new Date(req.created_at).toLocaleDateString('id-ID')} {new Date(req.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {req.status === 'rejected' && req.rejection_reason && (
                      <div className="mt-3 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-xl">
                        <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Alasan Penolakan:</p>
                        <p className="text-xs text-rose-700 dark:text-rose-300 font-bold leading-relaxed">{req.rejection_reason}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Modal: High Contrast Forms */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/90 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-[3rem] sm:rounded-[2.5rem] shadow-2xl animate-in slide-in-from-bottom duration-500">
            <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Buat Surat Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-800 flex gap-3">
                <Info className="h-5 w-5 text-emerald-600 shrink-0" />
                <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 leading-relaxed">
                  Permohonan akan diproses oleh Ketua RT dalam waktu maksimal 1x24 jam kerja.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-3">Jenis Surat</label>
                  <select 
                    value={newRequest.type}
                    onChange={(e) => setNewRequest({...newRequest, type: e.target.value})}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>Surat Pengantar KTP / KK</option>
                    <option>Surat Keterangan Domisili</option>
                    <option>Surat Keterangan Tidak Mampu (SKTM)</option>
                    <option>Surat Pengantar Nikah (NA)</option>
                    <option>Surat Keterangan Usaha (SKU)</option>
                    <option>Surat Keterangan Kelahiran</option>
                    <option>Surat Keterangan Kematian</option>
                    <option>Surat Pengantar Pindah / Datang</option>
                    <option>Surat Izin Keramaian / Acara</option>
                    <option>Surat Keterangan Kelakuan Baik (SKCK)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-3">Tujuan / Keperluan</label>
                  <textarea 
                    required
                    value={newRequest.purpose}
                    onChange={(e) => setNewRequest({...newRequest, purpose: e.target.value})}
                    placeholder="Contoh: Untuk persyaratan pembuatan paspor"
                    rows={3}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 active:scale-95 transition-all">
                <Send className="h-6 w-6" /> KIRIM PERMOHONAN
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
