import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';
import { Search, UserPlus, Trash2, CheckCircle, Clock, X, Save, Loader2, User, HelpCircle, Calendar, Hash } from 'lucide-react';

export default function BukuTamuPage() {
  const [guests, setGuests] = useState<any[]>([]);
  const [residents, setResidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newGuest, setNewGuest] = useState({
    visitor_name: '',
    resident_id: '',
    purpose: '',
    status: 'waiting'
  });

  useEffect(() => {
    fetchData();
    fetchResidents();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('guestbooks')
        .select('*, residents(full_name, nik)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setGuests(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResidents = async () => {
    const { data } = await supabase.from('residents').select('id, full_name, nik').order('full_name');
    if (data) setResidents(data);
  };

  const handleCreateGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabase.from('guestbooks').insert([newGuest]);
      if (error) throw error;
      alert("Data tamu berhasil dicatat!");
      setIsModalOpen(false);
      setNewGuest({ visitor_name: '', resident_id: '', purpose: '', status: 'waiting' });
      fetchData();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('guestbooks')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus data tamu ini?")) return;
    try {
      const { error } = await supabase.from('guestbooks').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const filteredGuests = guests.filter(g => 
    g.visitor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.residents?.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Buku Tamu Digital</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Catat & Pantau Kunjungan Lingkungan</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-black shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 text-xs uppercase tracking-widest"
        >
          <UserPlus className="h-4 w-4" /> Catat Tamu Baru
        </button>
      </div>

      <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-slate-900">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari nama tamu atau warga..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 font-black text-[10px] uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-8 py-5">Waktu Kedatangan</th>
                <th className="px-8 py-5">Identitas Tamu</th>
                <th className="px-8 py-5">Tujuan Kunjungan</th>
                <th className="px-8 py-5">Menemui Warga</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {loading ? (
                <tr><td colSpan={6} className="px-8 py-10 text-center text-slate-400 font-bold italic">Sedang menyinkronkan data...</td></tr>
              ) : filteredGuests.length === 0 ? (
                <tr><td colSpan={6} className="px-8 py-16 text-center text-slate-500 font-bold">Belum ada catatan kunjungan tamu</td></tr>
              ) : (
                filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                        {new Date(guest.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                        Pukul {new Date(guest.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{guest.visitor_name}</p>
                      <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Pengunjung</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400 line-clamp-1">{guest.purpose}</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-tight">{guest.residents?.full_name || 'Umum'}</p>
                      <p className="text-[10px] text-slate-400 font-bold">NIK: {guest.residents?.nik || '-'}</p>
                    </td>
                    <td className="px-8 py-5">
                      <StatusBadge status={guest.status} />
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        {guest.status === 'waiting' && (
                          <button 
                            onClick={() => updateStatus(guest.id, 'served')}
                            className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors"
                            title="Tandai Sedang Dilayani"
                          >
                            <Clock className="h-4 w-4" />
                          </button>
                        )}
                        {guest.status !== 'completed' && (
                          <button 
                            onClick={() => updateStatus(guest.id, 'completed')}
                            className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                            title="Tandai Selesai"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button onClick={() => handleDelete(guest.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
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

      {/* Modal Catat Tamu Baru */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Catat Tamu Baru</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Pendataan kunjungan warga & tamu umum</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-rose-500 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateGuest} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Nama Pengunjung</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <input 
                    required
                    value={newGuest.visitor_name}
                    onChange={(e) => setNewGuest({...newGuest, visitor_name: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Nama lengkap tamu..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Tujuan Kunjungan</label>
                <div className="relative">
                  <HelpCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <input 
                    required
                    value={newGuest.purpose}
                    onChange={(e) => setNewGuest({...newGuest, purpose: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Contoh: Silaturahmi, Kurir, Antar Barang..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Warga yang Dikunjungi</label>
                <div className="relative">
                  <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <select 
                    value={newGuest.resident_id}
                    onChange={(e) => setNewGuest({...newGuest, resident_id: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">-- Kunjungan Umum (Bukan Warga) --</option>
                    {residents.map(r => (
                      <option key={r.id} value={r.id}>{r.full_name} ({r.nik})</option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" disabled={isSaving} className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 active:scale-95 transition-all">
                {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
                SIMPAN DATA TAMU
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
    waiting: { label: 'MENUNGGU', color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' },
    served: { label: 'DILAYANI', color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' },
    completed: { label: 'SELESAI', color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' },
  };
  const config = configs[status] || { label: status, color: 'bg-slate-50 text-slate-600' };
  return <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${config.color}`}>{config.label}</span>;
}
