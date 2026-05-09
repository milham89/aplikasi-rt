import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';
import { Users, X, Hash, User, Home } from 'lucide-react';

export default function WargaPage() {
  const [wargaList, setWargaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    no_kk: '', address: '', block_number: '', // Data KK
    nik: '', full_name: '', gender: 'Laki-laki', phone_number: '', role: 'warga', status: 'Aktif', family_relation: 'Kepala Keluarga' // Data Warga
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWarga();
  }, []);

  const fetchWarga = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('residents')
        .select(`
          *,
          families (no_kk, address, block_number)
        `);
        
      if (error) throw error;
      
      // Sort logic: Kepala Keluarga > Istri > Anak > Others
      const sortedData = (data || []).sort((a, b) => {
        // First sort by Family (to group them together)
        const kkA = a.families?.no_kk || '';
        const kkB = b.families?.no_kk || '';
        if (kkA !== kkB) return kkA.localeCompare(kkB);

        // Then sort by Relation within the family
        const priority: any = {
          'Kepala Keluarga': 1,
          'Istri': 2,
          'Anak': 3,
          'Orang Tua': 4,
          'Lainnya': 5
        };
        const pA = priority[a.family_relation] || 99;
        const pB = priority[b.family_relation] || 99;
        return pA - pB;
      });

      setWargaList(sortedData);
    } catch (error: any) {
      alert("Gagal memuat data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredWarga = wargaList.filter(warga => 
    warga.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warga.nik?.includes(searchTerm)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let familyId;
      const { data: existingFamily, error: checkError } = await supabase
        .from('families')
        .select('id')
        .eq('no_kk', formData.no_kk)
        .maybeSingle();
        
      if (checkError) throw new Error(`Gagal mengecek data KK: ${checkError.message}`);
        
      if (existingFamily) {
        // Jika KK sudah ada, cukup ambil ID-nya. 
        // JANGAN UPDATE alamat/blok agar data lama tidak terhapus (karena inputnya sudah kita hapus dari form)
        familyId = existingFamily.id;
      } else {
        // Jika KK belum ada, buat baru dengan data minimal (karena input alamat sudah dihapus)
        const { data: newFamily, error: famError } = await supabase
          .from('families')
          .insert([{ 
            no_kk: formData.no_kk,
            address: '-', // Beri nilai default agar tidak kosong total
            block_number: '-' 
          }])
          .select()
          .single();
          
        if (famError) throw new Error(`Gagal membuat KK baru: ${famError.message}`);
        familyId = newFamily.id;
      }

      const { error: resError } = await supabase
        .from('residents')
        .insert([{
          family_id: familyId,
          nik: formData.nik,
          full_name: formData.full_name,
          gender: formData.gender === 'Laki-laki' ? 'L' : 'P',
          phone_number: formData.phone_number,
          role: formData.role,
          status: formData.status,
          family_relation: formData.family_relation
        }]);

      if (resError) throw new Error(`Gagal menyimpan data warga: ${resError.message}`);
      
      setIsModalOpen(false);
      setFormData({ 
        no_kk: '', address: '', block_number: '', 
        nik: '', full_name: '', gender: 'Laki-laki', phone_number: '', 
        role: 'warga', status: 'Aktif', family_relation: 'Kepala Keluarga'
      });
      alert("Data warga berhasil disimpan!");
      fetchWarga();
      
    } catch (error: any) {
      alert("Error: " + error.message);
      console.error("CRUD Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data warga ini?")) return;
    try {
      const { error } = await supabase.from('residents').delete().eq('id', id);
      if (error) throw error;
      alert("Data warga berhasil dihapus!");
      fetchWarga();
    } catch (error: any) {
      alert("Gagal menghapus data: " + error.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-navy-900 dark:text-white">Data Warga</h2>
          <p className="text-sm text-slate-500 mt-1">Kelola data penduduk RT secara digital</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-medium shadow-sm transition-colors flex items-center"
        >
          <span className="mr-2 text-lg leading-none">+</span> Tambah Warga
        </button>
      </div>
      
      {/* Modal Form Tambah Warga */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-start justify-center p-4 sm:p-8 overflow-y-auto pt-24 sm:pt-32">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-xl flex flex-col overflow-hidden animate-in slide-in-from-top-10 duration-500 relative border border-white/10 mb-20">
            {/* Header: Dibuat sangat kontras dan menempel */}
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 z-20">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Tambah Data Warga</h3>
                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.2em] mt-1">Sistem Pendataan Digital RT</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-rose-500 transition-all hover:rotate-90">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 bg-white dark:bg-slate-900">
              <div className="space-y-8 pb-4">
                {/* Section 1: Data KK */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span> 1. Data Kartu Keluarga
                  </h4>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nomor Kartu Keluarga (KK)</label>
                    <div className="relative group">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                      <input required name="no_kk" value={formData.no_kk} onChange={handleInputChange} type="text" className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 text-sm font-bold text-slate-900 dark:text-white transition-all shadow-inner" placeholder="16 Digit No. KK" />
                    </div>
                  </div>
                </div>

                {/* Section 2: Data Individu */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span> 2. Data Individu
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-full space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nama Sesuai KTP</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                        <input required name="full_name" value={formData.full_name} onChange={handleInputChange} type="text" className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 text-sm font-bold text-slate-900 dark:text-white transition-all shadow-inner" placeholder="Nama Lengkap" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">NIK (16 Digit)</label>
                      <input required name="nik" value={formData.nik} onChange={handleInputChange} type="text" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 text-sm font-bold text-slate-900 dark:text-white transition-all shadow-inner font-mono" placeholder="320..." />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Jenis Kelamin</label>
                      <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 text-sm font-bold text-slate-900 dark:text-white transition-all shadow-inner">
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Hubungan Keluarga</label>
                      <select name="family_relation" value={formData.family_relation} onChange={handleInputChange} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 text-sm font-bold text-slate-900 dark:text-white transition-all shadow-inner">
                        <option value="Kepala Keluarga">Kepala Keluarga</option>
                        <option value="Istri">Istri</option>
                        <option value="Anak">Anak</option>
                        <option value="Orang Tua">Orang Tua</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-4 sticky bottom-0 bg-white dark:bg-slate-900">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-all">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting} className="px-10 py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black shadow-2xl shadow-emerald-500/30 hover:bg-emerald-600 active:scale-95 transition-all">
                  {isSubmitting ? 'MENYIMPAN...' : 'SIMPAN DATA WARGA'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Card>
        <div className="p-6 border-b border-slate-200">
          <input 
            type="text" 
            placeholder="Cari nama atau NIK..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-700 dark:text-slate-200"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-4 rounded-tl-lg">Nama Lengkap</th>
                <th className="px-6 py-4">L/P</th>
                <th className="px-6 py-4">NIK</th>
                <th className="px-6 py-4">Blok / Rumah</th>
                <th className="px-6 py-4">Peran</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right rounded-tr-lg">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="h-8 w-8 bg-slate-200 rounded-full mb-3"></div>
                      <p>Memuat data warga...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredWarga.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                      <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-3">
                        <Users className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="font-medium text-slate-700 dark:text-slate-300">
                        {searchTerm ? 'Pencarian tidak ditemukan' : 'Belum ada data warga'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredWarga.map((warga) => (
                  <tr key={warga.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{warga.full_name}</td>
                    <td className="px-6 py-4 text-slate-500 font-bold">{warga.gender}</td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{warga.nik}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{warga.families?.block_number || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600 dark:text-slate-400">{warga.role === 'admin_rt' ? 'Pengurus RT' : 'Warga'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                        warga.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : 
                        warga.status === 'Pindah' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {warga.status || 'Aktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(warga.id)}
                        className="text-rose-600 hover:text-rose-800 font-medium px-3 py-1 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        Hapus
                      </button>
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
