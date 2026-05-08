import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';
import { Mail, Plus, Search, FileText, Send, Inbox, Trash2, X, CheckCircle, Clock, AlertCircle, ArrowUpRight, Save, Loader2, Calendar, Hash, User } from 'lucide-react';

export default function SuratPage() {
  const [activeTab, setActiveTab] = useState<'requests' | 'archive'>('requests');
  const [requests, setRequests] = useState<any[]>([]);
  const [archive, setArchive] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State for New Archive
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newArchive, setNewArchive] = useState({
    letter_number: '',
    subject: '',
    date: new Date().toISOString().split('T')[0],
    sender_receiver: ''
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'requests') {
        const { data, error } = await supabase
          .from('surat_warga')
          .select('*, residents(full_name, nik)')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setRequests(data || []);
      } else {
        const { data, error } = await supabase
          .from('arsip_surat_rt')
          .select('*')
          .order('date', { ascending: false });
        if (error) throw error;
        setArchive(data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateArchive = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabase.from('arsip_surat_rt').insert([newArchive]);
      if (error) throw error;
      alert("Arsip surat berhasil disimpan!");
      setIsModalOpen(false);
      setNewArchive({ letter_number: '', subject: '', date: new Date().toISOString().split('T')[0], sender_receiver: '' });
      fetchData();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteArchive = async (id: string) => {
    if (!confirm("Hapus arsip ini?")) return;
    try {
      const { error } = await supabase.from('arsip_surat_rt').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('surat_warga')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Layanan Surat & Arsip</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Sinkronisasi Data Warga & Admin</p>
        </div>
        {activeTab === 'archive' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-black shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 text-xs uppercase tracking-widest"
          >
            <Plus className="h-4 w-4" /> Tambah Arsip
          </button>
        )}
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 w-fit rounded-2xl">
        <button 
          onClick={() => setActiveTab('requests')}
          className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'requests' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          PERMOHONAN WARGA
        </button>
        <button 
          onClick={() => setActiveTab('archive')}
          className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'archive' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          ARSIP SURAT RT
        </button>
      </div>

      <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-slate-900">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari permohonan atau nama warga..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 font-black text-[10px] uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
              {activeTab === 'requests' ? (
                <tr>
                  <th className="px-8 py-5">Tgl Pengajuan</th>
                  <th className="px-8 py-5">Nama Warga</th>
                  <th className="px-8 py-5">Jenis Surat</th>
                  <th className="px-8 py-5">Keperluan</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Aksi</th>
                </tr>
              ) : (
                <tr>
                  <th className="px-8 py-5">No. Surat</th>
                  <th className="px-8 py-5">Perihal</th>
                  <th className="px-8 py-5">Tgl Surat</th>
                  <th className="px-8 py-5">Pengirim/Penerima</th>
                  <th className="px-8 py-5 text-right">Aksi</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {loading ? (
                <tr><td colSpan={6} className="px-8 py-10 text-center text-slate-400 font-bold italic">Sedang menyinkronkan data...</td></tr>
              ) : activeTab === 'requests' ? (
                requests.length === 0 ? (
                  <tr><td colSpan={6} className="px-8 py-10 text-center text-slate-400 font-bold">Belum ada permohonan surat dari warga.</td></tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-8 py-5">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                          {new Date(req.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                          Pukul {new Date(req.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                        </p>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{req.residents?.full_name}</p>
                        <p className="text-[10px] text-slate-500 font-bold">NIK: {req.residents?.nik}</p>
                      </td>
                      <td className="px-8 py-5 text-sm font-bold text-emerald-600">{req.type}</td>
                      <td className="px-8 py-5 text-xs text-slate-500 font-medium max-w-xs truncate">{req.purpose}</td>
                      <td className="px-8 py-5">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-3">
                          {req.status === 'requested' && (
                            <button 
                              onClick={() => updateStatus(req.id, 'processed')} 
                              className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all"
                            >
                              <Clock className="h-3 w-3" /> PROSES
                            </button>
                          )}
                          {(req.status === 'requested' || req.status === 'processed') && (
                            <button 
                              onClick={() => updateStatus(req.id, 'completed')} 
                              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all"
                            >
                              <CheckCircle className="h-3 w-3" /> SELESAIKAN
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )
              ) : (
                archive.length === 0 ? (
                  <tr><td colSpan={5} className="px-8 py-10 text-center text-slate-400 font-bold">Belum ada arsip surat.</td></tr>
                ) : (
                  archive.map((arc) => (
                    <tr key={arc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-8 py-5 text-sm font-mono text-slate-500 font-black">{arc.letter_number}</td>
                      <td className="px-8 py-5 text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{arc.subject}</td>
                      <td className="px-8 py-5">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                          {new Date(arc.date).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </p>
                      </td>
                      <td className="px-8 py-5 text-sm font-bold text-slate-500 uppercase">{arc.sender_receiver}</td>
                      <td className="px-8 py-5 text-right">
                        <button onClick={() => handleDeleteArchive(arc.id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Tambah Arsip */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Tambah Arsip Surat</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Dokumentasi surat masuk & keluar RT</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-rose-500 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateArchive} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-full space-y-2">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Nomor Surat</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <input 
                      required
                      value={newArchive.letter_number}
                      onChange={(e) => setNewArchive({...newArchive, letter_number: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="001/RT01/V/2024"
                    />
                  </div>
                </div>
                <div className="col-span-full space-y-2">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Perihal / Judul Surat</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <input 
                      required
                      value={newArchive.subject}
                      onChange={(e) => setNewArchive({...newArchive, subject: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Undangan Rapat Warga"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Tanggal Surat</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <input 
                      type="date"
                      required
                      value={newArchive.date}
                      onChange={(e) => setNewArchive({...newArchive, date: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Pengirim/Penerima</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <input 
                      required
                      value={newArchive.sender_receiver}
                      onChange={(e) => setNewArchive({...newArchive, sender_receiver: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Kelurahan / Bpk. Andi"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={isSaving} className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 active:scale-95 transition-all">
                {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
                SIMPAN ARSIP SURAT
              </button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: any = {
    requested: { label: 'DIAJUKAN', color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' },
    processed: { label: 'DIPROSES', color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' },
    completed: { label: 'SELESAI', color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' },
  };
  const config = configs[status] || { label: status, color: 'bg-slate-50 text-slate-600' };
  return <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${config.color}`}>{config.label}</span>;
}
