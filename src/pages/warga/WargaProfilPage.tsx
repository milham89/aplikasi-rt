import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { User, Phone, Mail, MapPin, Hash, Briefcase, ShieldCheck, LogOut, Settings, X, Save, Loader2, Camera, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function WargaProfilPage() {
  const { resident, refreshData } = useOutletContext<{ resident: any, refreshData: () => void }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({
    phone_number: resident?.phone_number || '',
    occupation: resident?.occupation || '',
    avatar_url: resident?.avatar_url || ''
  });
  const [uploading, setUploading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentResident, setCurrentResident] = useState(resident);

  // Auto-sync when data changes
  useEffect(() => {
    if (resident) {
      setEditData({
        phone_number: resident.phone_number || '',
        occupation: resident.occupation || '',
        avatar_url: resident.avatar_url || ''
      });
    }
  }, [resident]);

  const handlePhotoUpload = async (e: any) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      // Limit to 500KB
      if (file.size > 500 * 1024) {
        alert("Ukuran foto terlalu besar (Maksimal 500KB). Silakan kompres foto Anda terlebih dahulu.");
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${resident.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('residents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('residents')
        .getPublicUrl(filePath);

      // Update database
      const { error: updateError } = await supabase
        .from('residents')
        .update({ avatar_url: publicUrl })
        .eq('id', resident.id);

      if (updateError) throw updateError;
      
      if (refreshData) refreshData();
      alert("Foto profil berhasil diperbarui!");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('residents')
        .update({
          phone_number: editData.phone_number,
          occupation: editData.occupation
        })
        .eq('id', resident.id);
      
      if (error) throw error;
      alert("Profil berhasil diperbarui!");
      setIsModalOpen(false);
      if (refreshData) refreshData(); // Update data tanpa reload halaman
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="px-2">
        <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Profil Warga</h2>
        <p className="text-[10px] text-slate-900 dark:text-white/70 font-black mt-1 uppercase tracking-widest">Digital RT Management System</p>
      </div>

      <div className="flex flex-col items-center py-6">
        <div 
          className="relative group cursor-pointer active:scale-95 transition-transform"
          onClick={() => resident?.avatar_url && setIsPreviewOpen(true)}
        >
          <div className="absolute inset-0 bg-emerald-500 rounded-[3rem] blur-2xl opacity-20 transition-opacity"></div>
          <div className="h-32 w-32 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-[3rem] flex items-center justify-center text-white shadow-2xl relative z-10 border-4 border-white dark:border-slate-800 overflow-hidden">
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : resident?.avatar_url ? (
              <img src={resident.avatar_url} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <User className="h-16 w-16" />
            )}
          </div>
        </div>

        {/* Action Buttons Below Photo */}
        <div className="flex gap-3 mt-6 relative z-20">
          <button 
            type="button"
            onClick={() => document.getElementById('avatar-upload')?.click()}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Camera className="h-4 w-4" /> Ganti Foto Profil
          </button>
          
          <input 
            id="avatar-upload"
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handlePhotoUpload}
          />
        </div>

        <h2 className="text-2xl font-black text-slate-800 dark:text-white mt-4 tracking-tight uppercase">{resident?.full_name}</h2>
        <div className="flex items-center gap-2 mt-2">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-1.5 rounded-full tracking-widest uppercase">
            {resident?.family_relation}
          </span>
        </div>
      </div>

      <Card className="border-none bg-white dark:bg-slate-900 shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-8 space-y-4">
          <ProfileItem icon={<ShieldCheck className="h-5 w-5" />} label="Username" value={`@${resident?.username || 'user'}`} />
          <ProfileItem icon={<Hash className="h-5 w-5" />} label="NIK Terdaftar" value={resident?.nik} />
          <ProfileItem icon={<Mail className="h-5 w-5" />} label="Email Login" value={resident?.email} />
          <ProfileItem icon={<Phone className="h-5 w-5" />} label="Nomor WhatsApp" value={resident?.phone_number || '-'} />
          <ProfileItem icon={<Briefcase className="h-5 w-5" />} label="Pekerjaan" value={resident?.occupation || 'Warga'} />
          <ProfileItem icon={<MapPin className="h-5 w-5" />} label="Lokasi Rumah" value={resident?.families?.block_number || 'Blok Utama'} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="py-5 bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-black rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all uppercase text-[10px] tracking-widest"
        >
          <Settings className="h-4 w-4" /> Pengaturan
        </button>
        <button 
          onClick={() => supabase.auth.signOut().then(() => window.location.href = '/login')}
          className="py-5 bg-rose-50 dark:bg-rose-900/20 text-rose-500 font-black rounded-2xl border border-rose-100 dark:border-rose-900/20 shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all uppercase text-[10px] tracking-widest"
        >
          <LogOut className="h-4 w-4" /> Keluar
        </button>
      </div>

      {/* Settings Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/90 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-[3rem] sm:rounded-[2.5rem] shadow-2xl animate-in slide-in-from-bottom duration-500">
            <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Edit Profil</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleUpdate} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Nomor WhatsApp</label>
                  <div className="relative flex items-center group">
                    <Phone className="absolute left-4 h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                      type="text" 
                      value={editData.phone_number} 
                      onChange={(e) => setEditData({...editData, phone_number: e.target.value})} 
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-800 dark:text-white border-none focus:ring-2 focus:ring-emerald-500" 
                      placeholder="0812..." 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Pekerjaan</label>
                  <div className="relative flex items-center group">
                    <Briefcase className="absolute left-4 h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                      type="text" 
                      value={editData.occupation} 
                      onChange={(e) => setEditData({...editData, occupation: e.target.value})} 
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-800 dark:text-white border-none focus:ring-2 focus:ring-emerald-500" 
                      placeholder="Contoh: Karyawan Swasta" 
                    />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={isSaving} className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 active:scale-95 transition-all">
                {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
                SIMPAN PERUBAHAN
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Photo Preview Modal - Immersive Full Screen */}
      {isPreviewOpen && resident?.avatar_url && (
        <div 
          className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-10 animate-in fade-in duration-500"
          onClick={() => setIsPreviewOpen(false)}
        >
          <button 
            onClick={() => setIsPreviewOpen(false)}
            className="absolute top-6 right-6 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:rotate-90 z-[10001]"
          >
            <X className="h-8 w-8" />
          </button>
          
          <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
            <img 
              src={resident.avatar_url} 
              alt="Full Preview" 
              className="max-w-full max-h-[90vh] object-contain rounded-2xl sm:rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] border-2 border-white/5 animate-in zoom-in-90 duration-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileItem({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center gap-5 p-5 bg-slate-50 dark:bg-slate-800/30 rounded-3xl transition-all hover:bg-emerald-50 dark:hover:bg-emerald-500/5 group">
      <div className="h-10 w-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight">{value}</p>
      </div>
    </div>
  );
}
