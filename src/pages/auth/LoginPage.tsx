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
      // Cek apakah .env belum diatur (masih kosong/placeholder)
      const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'your_supabase_project_url';

      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        // Simulasi delay loading untuk testing UI
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Dummy logic to route based on email (for demo purposes)
      if (email.includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/warga');
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
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Email / NIK
        </label>
        <Input
          type="email"
          required
          placeholder="admin@rt.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
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
