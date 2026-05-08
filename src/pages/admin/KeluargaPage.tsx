import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';
import { Users, MapPin, ChevronRight, Hash, X, Search, Plus, Edit2, Trash2, Home, Navigation, Loader2 } from 'lucide-react';

export default function KeluargaPage() {
  const [families, setFamilies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFamily, setSelectedFamily] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    id: '',
    no_kk: '',
    address: '',
    block_number: ''
  });

  useEffect(() => {
    fetchFamilies();
  }, []);

  const fetchFamilies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('families')
        .select(`
          *,
          residents (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFamilies(data || []);
    } catch (error) {
      console.error('Error fetching families:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ id: '', no_kk: '', address: '', block_number: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (family: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditMode(true);
    setFormData({
      id: family.id,
      no_kk: family.no_kk,
      address: family.address,
      block_number: family.block_number
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Menghapus Kartu Keluarga juga akan menghapus SEMUA anggota warga di dalamnya. Lanjutkan?")) return;
    
    try {
      setLoading(true);
      const { error } = await supabase.from('families').delete().eq('id', id);
      if (error) throw error;
      alert("Data Kartu Keluarga berhasil dihapus!");
      fetchFamilies();
    } catch (error: any) {
      alert("Gagal menghapus: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        const { error } = await supabase
          .from('families')
          .update({
            no_kk: formData.no_kk,
            address: formData.address,
            block_number: formData.block_number
          })
          .eq('id', formData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('families')
          .insert([{
            no_kk: formData.no_kk,
            address: formData.address,
            block_number: formData.block_number
          }]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchFamilies();
      alert(`Data KK berhasil ${isEditMode ? 'diperbarui' : 'ditambahkan'}!`);
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFamilies = families.filter(family => 
    family.no_kk?.includes(searchTerm) ||
    family.block_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    family.residents?.some((m: any) => m.full_name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Database Keluarga</h2>
          <p className="text-[10px] text-emerald-500 font-black mt-1 uppercase tracking-[0.2em]">Manajemen Kartu Keluarga & Domisili</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-[2rem] font-black shadow-2xl shadow-emerald-500/20 transition-all flex items-center gap-2 active:scale-95 text-xs uppercase tracking-widest"
        >
          <Plus className="h-5 w-5" /> TAMBAH KK BARU
        </button>
      </div>

      <div className="relative group max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
        </div>
        <input 
          type="text" 
          placeholder="Cari No. KK, Nama Warga, atau Nomor Blok..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-16 pr-6 py-5 bg-white dark:bg-slate-900 border-none shadow-xl shadow-slate-200/50 dark:shadow-none rounded-[2rem] text-sm font-bold focus:ring-2 focus:ring-emerald-500 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading && families.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Menghubungkan ke pusat data...</p>
          </div>
        ) : filteredFamilies.length === 0 ? (
          <Card className="col-span-full py-20 border-none shadow-2xl rounded-[3rem] bg-white/50 backdrop-blur-md">
            <div className="flex flex-col items-center justify-center text-center px-10">
              <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] mb-6">
                <Users className="h-12 w-12 text-slate-300" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Data Tidak Ditemukan</h3>
              <p className="text-xs text-slate-500 mt-2 font-medium">Coba gunakan kata kunci pencarian yang berbeda atau tambahkan data KK baru.</p>
            </div>
          </Card>
        ) : (
          filteredFamilies.map((family) => (
            <Card 
              key={family.id} 
              onClick={() => setSelectedFamily(family)}
              className="group overflow-hidden border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2.5rem] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer relative"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                      <Hash className="h-3.5 w-3.5" />
                      KK: {family.no_kk}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                      {family.block_number}
                    </h3>
                  </div>
                  <div className="bg-emerald-500 text-white px-4 py-2 rounded-2xl text-[10px] font-black shadow-lg shadow-emerald-500/20 uppercase tracking-widest">
                    {family.residents?.length || 0} JIWA
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Penghuni Rumah:</p>
                  <div className="space-y-3">
                    {family.residents?.slice(0, 2).map((member: any) => (
                      <div key={member.id} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                          member.family_relation === 'Kepala Keluarga' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {member.full_name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{member.full_name}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{member.family_relation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <MapPin className="h-4 w-4 text-slate-400" />
                    </div>
                    <p className="text-xs font-bold text-slate-500 truncate italic">
                      {family.address}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={(e) => openEditModal(family, e)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                      <Edit2 className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button 
                      onClick={(e) => handleDelete(family.id, e)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* CRUD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {isEditMode ? 'Update Data KK' : 'Registrasi KK Baru'}
                </h3>
                <p className="text-[10px] text-emerald-500 font-black uppercase mt-1 tracking-widest">Lengkapi Data Domisili</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-rose-500 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nomor Kartu Keluarga</label>
                  <div className="relative group">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                      required 
                      type="text"
                      value={formData.no_kk}
                      onChange={(e) => setFormData({...formData, no_kk: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 text-sm font-bold transition-all shadow-inner" 
                      placeholder="16 Digit No. KK" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Blok / Nomor Rumah</label>
                  <div className="relative group">
                    <Home className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                      required 
                      type="text"
                      value={formData.block_number}
                      onChange={(e) => setFormData({...formData, block_number: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 text-sm font-bold transition-all shadow-inner" 
                      placeholder="Contoh: Blok B1 No. 12" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Alamat Lengkap</label>
                  <div className="relative group">
                    <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                      required 
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 text-sm font-bold transition-all shadow-inner" 
                      placeholder="Nama Jalan, Desa, dll." 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-all"
                >
                  Batalkan
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-[2] bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-emerald-500/20 transition-all active:scale-95 text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
                  {isEditMode ? 'SIMPAN PERUBAHAN' : 'REKAP DATA KK'}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* DETAIL VIEW MODAL: Tetap menggunakan yang sudah ada namun dipercantik */}
      {selectedFamily && !isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
            <div className="p-10 border-b dark:border-slate-800 flex justify-between items-center bg-emerald-500 text-white">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-white/20 backdrop-blur-md rounded-[2rem]">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight">Detail Keluarga</h3>
                  <p className="text-xs font-bold opacity-80 uppercase tracking-widest mt-1">KK: {selectedFamily.no_kk}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedFamily(null)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Lokasi Blok</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white">{selectedFamily.block_number}</p>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Anggota</p>
                  <p className="text-lg font-black text-emerald-600">{selectedFamily.residents?.length || 0} Orang</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Daftar Anggota Keluarga:</h4>
                <div className="space-y-3">
                  {selectedFamily.residents?.sort((a: any, b: any) => {
                    const priority: any = {'Kepala Keluarga': 1, 'Istri': 2, 'Anak': 3};
                    return (priority[a.family_relation] || 99) - (priority[b.family_relation] || 99);
                  }).map((member: any) => (
                    <div key={member.id} className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white ${
                          member.family_relation === 'Kepala Keluarga' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}>
                          {member.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white">{member.full_name}</p>
                          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">NIK: {member.nik}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black uppercase px-4 py-2 rounded-xl ${
                        member.family_relation === 'Kepala Keluarga' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {member.family_relation}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-10 border-t dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
               <p className="text-[10px] font-black text-slate-400 uppercase max-w-xs">{selectedFamily.address}</p>
               <button 
                onClick={() => setSelectedFamily(null)}
                className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black rounded-2xl hover:opacity-90 transition-opacity uppercase tracking-widest"
              >
                Tutup Detail
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
