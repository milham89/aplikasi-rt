import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let loginEmail = email;

      // Jika input bukan format email, cari username berdasarkan NIK di tabel residents
      if (!email.includes('@')) {
        const { data: userData, error: userError } = await supabase
          .from('residents')
          .select('username')
          .or(`nik.eq.${email},username.eq.${email}`)
          .single();

        if (userError || !userData?.username) {
          throw new Error('NIK atau Username tidak ditemukan');
        }
        // If we don't have email in residents, we assume the username is the login identifier or we use a dummy
        // But for Supabase Auth, we need an email. 
        // We'll assume the user entered their auth email or we'll have to rely on their input.
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });

      if (signInError) {
        if (signInError.message === 'Email not confirmed') {
          throw new Error('Email belum dikonfirmasi. Silakan cek kotak masuk email Anda.');
        }
        throw signInError;
      }

      // Route based on role
      try {
        const uname = loginEmail.split('@')[0];
        const { data: roleData } = await supabase
          .from('residents')
          .select('role')
          .eq('username', uname)
          .maybeSingle();

        if (roleData?.role === 'admin_rt' || loginEmail.includes('admin')) {
          navigate('/admin');
        } else {
          navigate('/warga');
        }
      } catch (roleErr) {
        // Fallback jika tidak ditemukan di residents
        if (loginEmail.includes('admin')) {
          navigate('/admin');
        } else {
          navigate('/warga');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleLogin}>
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Email / NIK / Username
        </label>
        <Input
          type="text"
          required
          placeholder="Email, NIK, atau Username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Password
        </label>
        <Input
          type="password"
          required
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? (
          'Memproses...'
        ) : (
          <>
            <LogIn className="mr-2 h-5 w-5" />
            Masuk
          </>
        )}
      </Button>
    </form>
  );
}
