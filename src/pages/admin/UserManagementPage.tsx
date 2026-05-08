import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';
import { Search, Plus, X, Loader2, Save, Edit2, Trash2, Key, User, Mail, Hash, Shield, ChevronRight, ChevronLeft, Check } from 'lucide-react';

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [families, setFamilies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    full_name: '',
    nik: '',
    username: '',
    email: '',
    password: '',
    role: 'warga',
    family_id: '',
    family_relation: 'Kepala Keluarga',
    status: 'Aktif'
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
        .select(`id, full_name, nik, username, email, role, status, family_id, family_relation`)
        .order('full_name', { ascending: true });
      if (error) throw error;
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
      username: '',
      email: '',
      password: '',
      role: 'warga',
      family_id: families.length > 0 ? families[0].id : '',
      family_relation: 'Kepala Keluarga',
      status: 'Aktif'
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
      username: user.username || '',
      email: user.email || '',
      password: '',
      role: user.role || 'warga',
      family_id: user.family_id || '',
      family_relation: user.family_relation || 'Kepala Keluarga',
      status: user.status || 'Aktif'
    });
    setIsModalOpen(true);
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(isEditMode ? 'editing' : 'adding');
    try {
      if (isEditMode && selectedId) {
        const { error } = await supabase.from('residents').update({
          full_name: formData.full_name,
          nik: formData.nik,
          username: formData.username,
          email: formData.email,
          role: formData.role,
          status: formData.status,
          family_id: formData.family_id,
          family_relation: formData.family_relation
        }).eq('id', selectedId);
        if (error) throw error;
      } else {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password
        });
        if (authError) throw authError;
        if (authData.user) {
          const { error: resError } = await supabase.from('residents').insert([{
            user_id: authData.user.id,
            full_name: formData.full_name,
            nik: formData.nik,
            username: formData.username,
            email: formData.email,
            role: formData.role,
            status: formData.status,
            family_id: formData.family_id,
            family_relation: formData.family_relation
          }]);
          if (resError) throw resError;
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
                <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px]">Identitas</th>
                <th className="px-6 py-5 font-black uppercase tracking-widest text-[10px]">Email & User</th>
                <th className="px-6 py-5 text-right font-black uppercase tracking-widest text-[10px]">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800 dark:text-white">{user.full_name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">NIK: {user.nik}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{user.email}</span>
                      <span className="text-[10px] font-black text-emerald-600">@{user.username || 'user'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openEditModal(user)} className="p-2.5 bg-blue-50 text-blue-600 dark:bg-blue-900/20 rounded-xl transition-all hover:scale-110">
                      <Edit2 className="h-4 w-4" />
                    </button>
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
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            
            {/* Header Modal */}
            <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {isEditMode ? 'Update Data' : 'Tambah User'}
                </h3>
                <p className="text-[10px] text-emerald-600 font-black uppercase mt-1 tracking-widest">Langkah {currentStep} dari 3</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-rose-500 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Form */}
            <div className="p-8">
              {/* Step Progress Line */}
              <div className="flex gap-2 mb-8">
                {[1, 2, 3].map(s => (
                  <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${currentStep >= s ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-slate-100 dark:bg-slate-800'}`}></div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {currentStep === 1 && (
                  <div className="space-y-4 animate-in slide-in-from-right duration-300">
                    <InputGroup icon={<User />} label="Nama Lengkap" value={formData.full_name} onChange={(v) => setFormData({...formData, full_name: v})} placeholder="Sesuai KTP" />
                    <InputGroup icon={<Hash />} label="NIK" value={formData.nik} onChange={(v) => setFormData({...formData, nik: v})} placeholder="16 Digit NIK" />
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4 animate-in slide-in-from-right duration-300">
                    <InputGroup icon={<Shield />} label="Username" value={formData.username} onChange={(v) => setFormData({...formData, username: v})} placeholder="budi01" />
                    <InputGroup icon={<Mail />} label="Email Login" type="email" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} placeholder="alamat@email.com" />
                    {!isEditMode && (
                      <InputGroup icon={<Key />} label="Password Awal" type="password" value={formData.password} onChange={(v) => setFormData({...formData, password: v})} placeholder="Min. 6 karakter" />
                    )}
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4 animate-in slide-in-from-right duration-300">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Pilih No. KK</label>
                      <select required value={formData.family_id} onChange={(e) => setFormData({...formData, family_id: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-800 dark:text-white border-none focus:ring-2 focus:ring-emerald-500 shadow-inner">
                        <option value="">-- Pilih KK --</option>
                        {families.map(f => <option key={f.id} value={f.id}>{f.no_kk} - {f.address}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Peran Akses</label>
                      <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-800 dark:text-white border-none focus:ring-2 focus:ring-emerald-500 shadow-inner">
                        <option value="warga">Warga Biasa</option>
                        <option value="admin">Administrator RT</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Footer Navigation */}
                <div className="flex gap-3 pt-6">
                  {currentStep > 1 && (
                    <button type="button" onClick={prevStep} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all">
                      <ChevronLeft className="h-4 w-4" /> KEMBALI
                    </button>
                  )}
                  
                  {currentStep < 3 ? (
                    <button type="button" onClick={nextStep} className="flex-[2] py-4 bg-emerald-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all active:scale-95">
                      LANJUT <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button type="submit" disabled={!!isSaving} className="flex-[2] py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all active:scale-95">
                      {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                      SIMPAN DATA
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InputGroup({ icon, label, value, onChange, placeholder, type = "text" }: any) {
  return (
    <div>
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">{label}</label>
      <div className="relative flex items-center group">
        <div className="absolute left-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors">{icon}</div>
        <input required type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-800 dark:text-white border-none focus:ring-2 focus:ring-emerald-500 shadow-inner" placeholder={placeholder} />
      </div>
    </div>
  );
}
