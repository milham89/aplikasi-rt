import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';
import { BookOpen, Search, Plus, Home, Users, ChevronRight, Hash, MapPin, X, Loader2, Save, Trash2 } from 'lucide-react';

export default function KeluargaPage() {
  const [families, setFamilies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [selectedFamily, setSelectedFamily] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const [formData, setFormData] = useState({
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
      // Fetch families along with resident details
      const { data, error } = await supabase
        .from('families')
        .select(`
          *,
          residents(id, full_name, nik, family_relation, gender, status)
        `);
        
      if (error) throw error;
      setFamilies(data || []);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = (family: any) => {
    setSelectedFamily(family);
    setIsDetailOpen(true);
  };

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabase.from('families').insert([formData]);
      if (error) throw error;
      setIsModalOpen(false);
      setFormData({ no_kk: '', address: '', block_number: '' });
      fetchFamilies();
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm("Hapus data keluarga ini? Seluruh data anggota yang terhubung akan tetap ada namun tidak memiliki referensi keluarga.")) return;
    try {
      const { error } = await supabase.from('families').delete().eq('id', id);
      if (error) throw error;
      fetchFamilies();
    } catch (error: any) {
      alert("Gagal menghapus: " + error.message);
    }
  };

  const filteredFamilies = families.filter(f => 
    f.no_kk.includes(searchTerm) || 
    f.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Data Keluarga</h2>
          <p className="text-[10px] text-slate-500 font-black mt-1 uppercase tracking-[0.2em]">Manajemen Kartu Keluarga (KK) RT Digital</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 text-white px-8 py-4 rounded-3xl font-black shadow-xl shadow-emerald-600/20 flex items-center gap-2 hover:bg-emerald-700 transition-all active:scale-95"
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
          placeholder="Cari berdasarkan No. KK atau alamat..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-16 pr-6 py-5 bg-white dark:bg-slate-900 border-none shadow-xl shadow-slate-200/50 dark:shadow-none rounded-[2rem] text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-64 bg-white dark:bg-slate-900 rounded-[2.5rem] animate-pulse"></div>
          ))}
        </div>
      ) : filteredFamilies.length === 0 ? (
        <div className="p-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] shadow-sm">
          <BookOpen className="h-16 w-16 text-slate-200 mx-auto mb-6" />
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Belum ada data keluarga</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFamilies.map((family) => (
            <Card 
              key={family.id} 
              onClick={() => handleOpenDetail(family)}
              className="border-none shadow-xl shadow-slate-200/40 dark:shadow-none rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-900 group hover:-translate-y-2 transition-all duration-500 cursor-pointer"
            >
              <CardContent className="p-0">
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="h-14 w-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-emerald-500 transition-colors duration-500">
                      <Home className="h-6 w-6 text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Blok / No</span>
                        <span className="text-sm font-black text-slate-900 dark:text-white uppercase">{family.block_number || '-'}</span>
                      </div>
                      <button 
                        onClick={(e) => handleDelete(e, family.id)}
                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all"
                        title="Hapus Data Keluarga"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-1">Nomor Kartu Keluarga</h4>
                    <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{family.no_kk}</p>
                  </div>

                  <div className="flex items-center gap-3 py-4 border-y border-slate-50 dark:border-slate-800">
                    <MapPin className="h-4 w-4 text-slate-300" />
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 line-clamp-1">{family.address}</p>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {[...Array(Math.min(family.residents?.length || 0, 3))].map((_, i) => (
                          <div key={i} className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-black text-slate-400">
                            <Users className="h-3 w-3" />
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {family.residents?.length || 0} Anggota
                      </span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Detail Keluarga */}
      {isDetailOpen && selectedFamily && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/10">
            <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Detail Anggota Keluarga</h3>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">No. KK: {selectedFamily.no_kk}</p>
              </div>
              <button onClick={() => setIsDetailOpen(false)} className="p-3 bg-white dark:bg-slate-800 rounded-full text-slate-400 hover:text-rose-500 transition-all shadow-sm">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                {selectedFamily.residents?.length > 0 ? (
                  selectedFamily.residents.map((r: any) => (
                    <div key={r.id} className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 transition-all">
                      <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-emerald-500 font-black">
                        {r.gender === 'L' ? 'L' : 'P'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 dark:text-white">{r.full_name}</p>
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                            r.family_relation === 'Kepala Keluarga' ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                          }`}>
                            {r.family_relation}
                          </span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 font-mono mt-1 tracking-wider">NIK: {r.nik}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${r.status === 'Aktif' ? 'text-emerald-500' : 'text-slate-400'}`}>
                          {r.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <Users className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Belum ada anggota keluarga terdaftar</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-t dark:border-slate-800 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Total {selectedFamily.residents?.length || 0} Anggota Terdata</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah KK */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Tambah KK Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-rose-500 transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateFamily} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nomor Kartu Keluarga (KK)</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <input 
                    required 
                    value={formData.no_kk}
                    onChange={(e) => setFormData({...formData, no_kk: e.target.value})}
                    type="text" 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 text-sm font-bold text-slate-900 dark:text-white transition-all shadow-inner" 
                    placeholder="16 Digit No. KK" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Blok & Nomor Rumah</label>
                <div className="relative">
                  <Home className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <input 
                    required 
                    value={formData.block_number}
                    onChange={(e) => setFormData({...formData, block_number: e.target.value})}
                    type="text" 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 text-sm font-bold text-slate-900 dark:text-white transition-all shadow-inner" 
                    placeholder="Contoh: Blok A No. 12" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Alamat Lengkap</label>
                <textarea 
                  required 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 text-sm font-bold text-slate-900 dark:text-white transition-all shadow-inner min-h-[100px]" 
                  placeholder="Jl. Merdeka No..." 
                />
              </div>

              <button 
                type="submit" 
                disabled={isSaving}
                className="w-full py-5 bg-emerald-600 text-white font-black rounded-3xl shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all active:scale-[0.98]"
              >
                {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
                SIMPAN DATA KK
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
