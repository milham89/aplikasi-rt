import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';
import { Search, Plus, X, Loader2, Save, Edit2, Trash2, Key, User, Mail, Hash, Shield, ChevronRight, ChevronLeft, Check, Clock, PhoneCall, Briefcase, Camera } from 'lucide-react';

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [families, setFamilies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    full_name: '',
    nik: '',
    phone_number: '',
    occupation: '',
    username: '',
    email: '',
    password: '',
    role: 'warga',
    family_id: '',
    family_relation: 'Kepala Keluarga',
    status: 'Aktif',
    avatar_url: ''
  });

  useEffect(() => {
    fetchUsers();
    fetchFamilies();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('residents')
        .select(`id, user_id, full_name, nik, phone_number, occupation, username, email, role, status, family_id, family_relation, avatar_url`)
        .order('full_name', { ascending: true });
      if (error) {
        console.error("Fetch Users Error:", error);
        setUsers([]); // Reset data agar tidak crash
        return;
      }
      setUsers(data || []);
    } catch (error: any) {
      alert("Gagal memuat data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFamilies = async () => {
    const { data } = await supabase.from('families').select('id, no_kk, address');
    setFamilies(data || []);
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setSelectedId(null);
    setCurrentStep(1);
    setFormData({
      full_name: '',
      nik: '',
      phone_number: '',
      occupation: '',
      username: '',
      email: '',
      password: '',
      role: 'warga',
      family_id: families.length > 0 ? families[0].id : '',
      family_relation: 'Kepala Keluarga',
      status: 'Aktif',
      avatar_url: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user: any) => {
    setIsEditMode(true);
    setSelectedId(user.id);
    setCurrentStep(1);
    setFormData({
      full_name: user.full_name || '',
      nik: user.nik || '',
      phone_number: user.phone_number || '',
      occupation: user.occupation || '',
      username: user.username || '',
      email: user.email || '',
      password: '',
      role: user.role || 'warga',
      family_id: user.family_id || '',
      family_relation: user.family_relation || 'Kepala Keluarga',
      status: user.status || 'Aktif',
      avatar_url: user.avatar_url || ''
    });
    setIsModalOpen(true);
  };

  const handlePhotoUpload = async (e: any, residentId: string) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      // Limit to 500KB
      if (file.size > 500 * 1024) {
        alert("Ukuran foto terlalu besar (Maksimal 500KB).");
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${residentId}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('residents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('residents')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('residents')
        .update({ avatar_url: publicUrl })
        .eq('id', residentId);

      if (updateError) throw updateError;
      
      setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
      fetchUsers();
      alert("Foto profil berhasil diperbarui!");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handlePhotoDelete = async (residentId: string) => {
    if (!window.confirm("Hapus foto profil user ini?")) return;
    try {
      setUploading(true);
      const { error } = await supabase
        .from('residents')
        .update({ avatar_url: null })
        .eq('id', residentId);

      if (error) throw error;
      
      setFormData(prev => ({ ...prev, avatar_url: '' }));
      fetchUsers();
      alert("Foto profil berhasil dihapus!");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(isEditMode ? 'editing' : 'adding');
    try {
      const payload: any = {
        full_name: formData.full_name,
        nik: formData.nik,
        phone_number: formData.phone_number,
        occupation: formData.occupation,
        username: formData.username,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        family_id: formData.family_id || null,
        family_relation: formData.family_relation
      };

      if (isEditMode && selectedId) {
        // Logika Update: Cek apakah admin mengganti password
        if (formData.password) {
          // Update password via API (butuh admin privileges atau re-auth, biasanya disarankan via admin panel)
          // Untuk demo ini, kita asumsikan update profil residents saja jika password kosong
        }

        const { error } = await supabase
          .from('residents')
          .update(payload)
          .eq('id', selectedId);
        if (error) throw error;
        
        alert("Profil warga berhasil diperbarui!");
      } else if (!isEditMode) {
        // 1. Cek apakah warga dengan NIK ini sudah ada di database (tapi belum punya user_id)
        const { data: existingResident } = await supabase
          .from('residents')
          .select('id, user_id')
          .eq('nik', formData.nik)
          .maybeSingle();

        // 2. Buat akun Auth baru
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password
        });

        if (authError) throw authError;

        if (authData.user) {
          if (existingResident) {
            // Jika warga sudah ada, SINKRONKAN (Update user_id pada record yang sudah ada)
            const { error: syncError } = await supabase
              .from('residents')
              .update({
                ...payload,
                user_id: authData.user.id
              })
              .eq('id', existingResident.id);
            
            if (syncError) throw syncError;
            alert("Berhasil menghubungkan akun login ke data warga yang sudah ada!");
          } else {
            // Jika warga benar-benar baru, INSERT baru
            const { error: resError } = await supabase.from('residents').insert([{
              ...payload,
              user_id: authData.user.id,
            }]);
            if (resError) throw resError;
            alert("Berhasil membuat data warga dan akun login baru!");
          }
        }
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setIsSaving(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Hapus akun user/warga ini?")) return;
    try {
      const { error } = await supabase.from('residents').delete().eq('id', id);
      if (error) throw error;
      fetchUsers();
    } catch (error: any) {
      alert("Gagal menghapus: " + error.message);
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.nik?.includes(searchTerm)
  );

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Manajemen User</h2>
          <p className="text-[10px] text-slate-500 font-black mt-1 uppercase tracking-widest">Total {users.length} Akun Warga</p>
        </div>
        <button onClick={openAddModal} className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black shadow-lg flex items-center gap-2 active:scale-95 transition-all">
          <Plus className="h-5 w-5" /> TAMBAH USER
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors duration-300" />
          </div>
          <input 
            type="text" 
            placeholder="Cari berdasarkan nama atau NIK warga..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4.5 bg-white dark:bg-slate-900 border-none shadow-xl shadow-slate-200/50 dark:shadow-none rounded-3xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all duration-300 placeholder:text-slate-300 dark:placeholder:text-slate-600"
          />
        </div>
      </div>

      <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 border-b dark:border-slate-800">
              <tr>
                <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px]">Identitas & Pekerjaan</th>
                <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px]">WhatsApp</th>
                <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px]">Username & Email</th>
                <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px]">Status Akun</th>
                <th className="px-6 py-5 text-right font-black uppercase tracking-widest text-[10px]">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-5 w-5 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white">{user.full_name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Briefcase className="h-3 w-3 text-emerald-500" />
                          <p className="text-[10px] text-slate-500 font-bold uppercase">{user.occupation || 'Belum Diisi'}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <div className="h-8 w-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                        <PhoneCall className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="text-xs font-bold">{user?.phone_number || '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Auth Identity</span>
                      <span className="text-xs font-black text-emerald-600">{user?.username ? `@${user.username}` : ''}</span>
                      <span className="text-[10px] text-slate-500 font-bold lowercase line-clamp-1">{user?.email || '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      {user?.user_id ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full w-fit border border-emerald-500/20">
                          <Check className="h-3 w-3" />
                          <span className="text-[9px] font-black uppercase tracking-tighter">SIAP LOGIN</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full w-fit border border-slate-200 dark:border-slate-700">
                          <Clock className="h-3 w-3" />
                          <span className="text-[9px] font-black uppercase tracking-tighter">BELUM DAFTAR</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEditModal(user)} className="p-2.5 bg-blue-50 text-blue-600 dark:bg-blue-900/20 rounded-xl transition-all hover:scale-110" title="Edit User">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="p-2.5 bg-rose-50 text-rose-600 dark:bg-rose-900/20 rounded-xl transition-all hover:scale-110" title="Hapus User">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL STEPPER: KEMBALI KE TENGAH DENGAN POSISI SEMPURNA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            
            {/* Header Modal */}
            <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {isEditMode ? 'Update Data' : 'Tambah User'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-rose-500 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {isEditMode && (
                <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-1 flex items-center gap-2">
                    <Camera className="h-3 w-3" /> Foto Profil User
                  </h4>
                  <div className="flex items-center gap-6">
                    <div className="h-24 w-24 rounded-[2rem] bg-white dark:bg-slate-900 shadow-inner flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-700">
                      {uploading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                      ) : formData.avatar_url ? (
                        <img src={formData.avatar_url} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-10 w-10 text-slate-300" />
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <button 
                        type="button"
                        onClick={() => document.getElementById('admin-avatar-upload')?.click()}
                        className="px-5 py-2.5 bg-emerald-500 text-white text-[10px] font-black rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all uppercase"
                      >
                        Ganti Foto
                      </button>
                      {formData.avatar_url && (
                        <button 
                          type="button"
                          onClick={() => handlePhotoDelete(selectedId!)}
                          className="px-5 py-2.5 bg-white dark:bg-slate-900 text-rose-500 text-[10px] font-black rounded-xl border border-rose-100 dark:border-rose-900/30 active:scale-95 transition-all uppercase"
                        >
                          Hapus Foto
                        </button>
                      )}
                      <input 
                        id="admin-avatar-upload"
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handlePhotoUpload(e, selectedId!)}
                      />
                    </div>
                  </div>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section 1: Domisili */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span> 1. Data Domisili
                  </h4>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Pilih Kartu Keluarga (KK)</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                        <Hash className="h-5 w-5" />
                      </div>
                      <select 
                        required 
                        value={formData.family_id} 
                        onChange={(e) => setFormData({...formData, family_id: e.target.value})} 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-800 dark:text-white border-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                      >
                        <option value="">-- Pilih Kartu Keluarga --</option>
                        {families?.map(f => (
                          <option key={f.id} value={f.id}>
                            {f.no_kk} - {f.address}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Identitas */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span> 2. Identitas & Kontak
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputGroup icon={<User />} label="Nama Lengkap" value={formData.full_name} onChange={(v) => setFormData({...formData, full_name: v})} placeholder="Sesuai KTP" />
                    <InputGroup icon={<Hash />} label="NIK" value={formData.nik} onChange={(v) => setFormData({...formData, nik: v})} placeholder="16 Digit NIK" />
                    <InputGroup 
                      icon={<PhoneCall />} 
                      label="Nomor WhatsApp" 
                      required={false} 
                      value={formData.phone_number} 
                      onChange={(v) => setFormData({...formData, phone_number: v})} 
                      placeholder="0812xxxx" 
                    />
                    <InputGroup icon={<Briefcase />} label="Pekerjaan" required={false} value={formData.occupation} onChange={(v) => setFormData({...formData, occupation: v})} placeholder="PNS, Swasta, dll" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Hubungan Keluarga</label>
                    <select 
                      value={formData.family_relation} 
                      onChange={(e) => setFormData({...formData, family_relation: e.target.value})} 
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-800 dark:text-white border-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                    >
                      <option value="Kepala Keluarga">Kepala Keluarga</option>
                      <option value="Istri">Istri</option>
                      <option value="Anak">Anak</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>

                {/* Section 3: Akses Akun */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span> 3. Akses Login & Role
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputGroup icon={<Shield />} label="Username" value={formData.username} onChange={(v) => setFormData({...formData, username: v})} placeholder="budi01" />
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Peran Akses</label>
                      <select 
                        value={formData.role} 
                        onChange={(e) => setFormData({...formData, role: e.target.value})} 
                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-800 dark:text-white border-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                      >
                        <option value="warga">Warga Biasa</option>
                        <option value="admin">Administrator RT</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Status Warga</label>
                      <select 
                        value={formData.status} 
                        onChange={(e) => setFormData({...formData, status: e.target.value})} 
                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-800 dark:text-white border-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                      >
                        <option value="Aktif">Aktif</option>
                        <option value="Pindah">Pindah</option>
                        <option value="Meninggal">Meninggal</option>
                      </select>
                    </div>
                  </div>
                  <InputGroup icon={<Mail />} label="Email Login" type="email" required={!isEditMode} value={formData.email} onChange={(v) => setFormData({...formData, email: v})} placeholder="alamat@email.com" />
                  <InputGroup 
                    icon={<Key />} 
                    label={isEditMode ? "Ganti Password (Kosongkan jika tidak diubah)" : "Password Awal"} 
                    type="password" 
                    required={!isEditMode} 
                    value={formData.password} 
                    onChange={(v) => setFormData({...formData, password: v})} 
                    placeholder={isEditMode ? "••••••" : "Min. 6 karakter"} 
                  />
                </div>

                {/* Footer Action */}
                <div className="pt-4">
                  <button type="submit" disabled={!!isSaving} className="w-full py-5 bg-emerald-600 text-white font-black rounded-3xl shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all active:scale-[0.98]">
                    {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
                    {isEditMode ? 'PERBARUI DATA USER' : 'SIMPAN USER BARU'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InputGroup({ icon, label, value, onChange, placeholder, type = "text", required = true }: any) {
  return (
    <div>
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">{label}</label>
      <div className="relative flex items-center group">
        <div className="absolute left-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors">{icon}</div>
        <input required={required} type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-800 dark:text-white border-none focus:ring-2 focus:ring-emerald-500 shadow-inner" placeholder={placeholder} />
      </div>
    </div>
  );
}
