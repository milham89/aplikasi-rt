import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { User, MapPin, Lock, Save, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profil');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    admin_name: '',
    admin_phone: '',
    rt_number: '',
    rw_number: '',
    kelurahan: '',
    monthly_fee: 0
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // Record not found
          // Table exists but no record, we'll use defaults
          return;
        }
        throw error;
      }
      if (data) setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ 
      ...prev, 
      [name]: name === 'monthly_fee' ? parseFloat(value) : value 
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('app_settings')
        .update(settings)
        .eq('id', 1);

      if (error) throw error;
      alert("Pengaturan berhasil disimpan!");
    } catch (error: any) {
      alert("Gagal menyimpan: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Pengaturan Aplikasi</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Sesuaikan profil admin dan informasi rukun tetangga.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 space-y-1">
          <button 
            onClick={() => setActiveTab('profil')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'profil' 
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <User className="h-5 w-5" />
            Profil Admin
          </button>
          <button 
            onClick={() => setActiveTab('rt')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'rt' 
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <MapPin className="h-5 w-5" />
            Informasi RT
          </button>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          {activeTab === 'profil' && (
            <Card className="animate-fade-in">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Informasi Pribadi</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Ubah data diri Anda sebagai pengelola sistem.</p>
                </div>
                <hr className="border-slate-100 dark:border-slate-800" />
                
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-1.5">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nama Lengkap</label>
                      <Input name="admin_name" value={settings.admin_name} onChange={handleInputChange} className="bg-slate-50 dark:bg-slate-900" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nomor Telepon / WhatsApp</label>
                    <Input name="admin_phone" value={settings.admin_phone} onChange={handleInputChange} className="bg-slate-50 dark:bg-slate-900" />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Simpan Perubahan
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'rt' && (
            <Card className="animate-fade-in">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Data Rukun Tetangga (RT)</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Informasi ini akan tampil di aplikasi warga dan kop surat.</p>
                </div>
                <hr className="border-slate-100 dark:border-slate-800" />
                
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-1.5">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nomor RT</label>
                      <Input name="rt_number" value={settings.rt_number} onChange={handleInputChange} className="bg-slate-50 dark:bg-slate-900" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nomor RW</label>
                      <Input name="rw_number" value={settings.rw_number} onChange={handleInputChange} className="bg-slate-50 dark:bg-slate-900" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nama Desa / Kelurahan</label>
                    <Input name="kelurahan" value={settings.kelurahan} onChange={handleInputChange} className="bg-slate-50 dark:bg-slate-900" />
                  </div>

                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Simpan Informasi RT
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
