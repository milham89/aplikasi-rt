import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { LogIn, User, Lock, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState(''); // Can be Email, NIK, or Username
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let loginEmail = identifier;

      // 1. "Smart Identifier" - Handle NIK or Username login
      if (!identifier.includes('@')) {
        const { data: userData, error: userError } = await supabase
          .from('residents')
          .select('email, role')
          .or(`nik.eq.${identifier},username.eq.${identifier}`)
          .maybeSingle();

        if (userError || !userData?.email) {
          throw new Error('Identitas (NIK/Username) tidak ditemukan atau belum terdaftar.');
        }
        loginEmail = userData.email;
      }

      // 2. Perform Auth
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });

      if (signInError) {
        if (signInError.message === 'Invalid login credentials') {
          throw new Error('Kombinasi email/password salah.');
        }
        if (signInError.message === 'Email not confirmed') {
          throw new Error('Email belum dikonfirmasi. Silakan cek inbox Anda.');
        }
        throw signInError;
      }

      // 3. Smart Routing & Sync Check
      const { data: resident, error: residentError } = await supabase
        .from('residents')
        .select('role, full_name')
        .eq('email', loginEmail)
        .maybeSingle();

      if (residentError || !resident) {
        throw new Error('Akun terdaftar di sistem login, tapi data profil warga tidak ditemukan. Hubungi Admin.');
      }

      if (resident.role === 'admin' || loginEmail.includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/warga');
      }

    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-700">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
          Portal <span className="text-emerald-500">Masuk</span>
        </h1>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-relaxed">
          Gunakan Email, NIK, atau Username anda
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleLogin}>
        {error && (
          <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 p-4 rounded-2xl text-xs font-bold border border-rose-100 dark:border-rose-900/30 flex items-center gap-3 animate-shake">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div className="group relative">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 group-focus-within:text-emerald-500 transition-colors">Identitas Anda</label>
            <div className="relative flex items-center">
              <User className="absolute left-4 h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="text"
                required
                placeholder="Email, NIK, atau Username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-12 pr-4 py-4.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-sm font-bold text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="group relative">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 group-focus-within:text-emerald-500 transition-colors">Kata Sandi</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="password"
                required
                placeholder="Masukkan password anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-sm font-bold text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner"
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-all hover:bg-emerald-600 group"
        >
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              MASUK KE PORTAL
              <LogIn className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <div className="pt-4 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Kesulitan Masuk? <a href="#" className="text-emerald-500 hover:underline">Hubungi Pengurus RT</a>
          </p>
        </div>
      </form>
      
      {/* Visual Badge for Trust */}
      <div className="flex items-center justify-center gap-4 pt-10 opacity-30 grayscale hover:grayscale-0 transition-all">
        <ShieldCheck className="h-8 w-8 text-emerald-500" />
        <div className="text-left border-l pl-4 border-slate-300 dark:border-slate-700">
          <p className="text-[9px] font-black uppercase tracking-tighter">Secured by</p>
          <p className="text-xs font-black uppercase tracking-widest">Enterprise Guard</p>
        </div>
      </div>
    </div>
  );
}
